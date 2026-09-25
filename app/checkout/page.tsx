'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice } from '@/lib/products';
import { calculateCouponDiscount, FIRST_PURCHASE_COUPON, isFirstPurchaseCoupon, normalizeCoupon } from '@/lib/coupons';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import type { CartItem, Product } from '@/lib/types';
import { trackBeginCheckout } from '@/lib/marketing-analytics';

const STORAGE_COUPON = 'ago_primeira_compra_v3_cupom';
const STORAGE_EMAIL = 'ago_primeira_compra_v3_email';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function normalizeBrazilPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);
  return digits.length === 10 || digits.length === 11 ? digits : '';
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
};
type Line = { item: CartItem; product: Product };
type CheckoutStep = 1 | 2 | 3 | 4;

const initialForm: FormState = {
  name: '', email: '', phone: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '',
};

const customerFields = new Set(['name', 'email', 'phone']);
const deliveryFields = new Set(['street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zip']);

export default function CheckoutPage() {
  const { items, hydrated } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState<CheckoutStep>(1);
  const [completed, setCompleted] = useState<CheckoutStep[]>([]);
  const [coupon, setCoupon] = useState('');
  const [couponEligible, setCouponEligible] = useState<boolean | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [benefitAvailable, setBenefitAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedCoupon = normalizeCoupon(window.localStorage.getItem(STORAGE_COUPON));
      const storedEmail = String(window.localStorage.getItem(STORAGE_EMAIL) || '').trim();
      if (isFirstPurchaseCoupon(storedCoupon)) setCoupon(storedCoupon);
      if (storedEmail) setForm((current) => ({ ...current, email: current.email || storedEmail }));
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/first-purchase/eligibility', { method: 'GET', cache: 'no-store' })
      .then((response) => response.json().catch(() => ({})))
      .then((data) => {
        if (!active) return;
        const available = data?.available === true;
        setBenefitAvailable(available);
        if (!available) {
          setCoupon('');
          setCouponEligible(null);
          setCouponMessage(null);
        }
      })
      .catch(() => {
        if (!active) return;
        setBenefitAvailable(false);
        setCoupon('');
        setCouponEligible(null);
        setCouponMessage(null);
      });
    return () => { active = false; };
  }, []);

  const lines = useMemo<Line[]>(() => items.flatMap((item): Line[] => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);

  const subtotal = lines.reduce((sum, line) => sum + getEffectivePrice(line.product) * line.item.quantity, 0);
  const discount = benefitAvailable === true && couponEligible === true ? calculateCouponDiscount(subtotal, coupon) : 0;
  const freeShipping = shouldOfferFreeShipping(subtotal);
  const shippingValue = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = Math.max(0, subtotal - discount) + shippingValue;

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneValid = Boolean(normalizeBrazilPhone(form.phone));
  const identityComplete = emailValid && phoneValid;
  const customerComplete = form.name.trim().length >= 2 && identityComplete;
  const deliveryComplete = form.zip.replace(/\D/g, '').length === 8
    && form.street.trim().length >= 2
    && form.number.trim().length >= 1
    && form.neighborhood.trim().length >= 2
    && form.city.trim().length >= 2
    && /^[A-Z]{2}$/.test(form.state.trim().toUpperCase());

  function complete(value: CheckoutStep) {
    setCompleted((current) => current.includes(value) ? current : [...current, value]);
  }

  function invalidateBenefit(messageText?: string) {
    if (!isFirstPurchaseCoupon(coupon)) return;
    setCouponEligible(null);
    setCouponMessage(messageText || null);
    setCompleted((current) => current.filter((value) => value < 3));
  }

  function change(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setMessage(null);

    if (customerFields.has(name)) {
      setCompleted([]);
      if (name === 'email' || name === 'phone') invalidateBenefit('Confirme o cupom novamente após alterar seus dados.');
    } else if (deliveryFields.has(name)) {
      setCompleted((current) => current.filter((value) => value < 2));
    }

    setForm((current) => ({
      ...current,
      [name]: name === 'zip'
        ? value.replace(/\D/g, '').slice(0, 8)
        : name === 'state'
          ? value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2)
          : value,
    }));
  }

  function nextFromCustomer() {
    if (!customerComplete) {
      setMessage('Preencha nome, e-mail e WhatsApp válidos para continuar.');
      return;
    }
    setMessage(null);
    complete(1);
    setStep(2);
  }

  function nextFromDelivery() {
    if (!deliveryComplete) {
      setMessage('Complete os dados de entrega. O CEP deve ter 8 dígitos e a UF deve ter 2 letras.');
      return;
    }
    setMessage(null);
    complete(2);
    setStep(3);
  }

  async function applyCoupon() {
    if (benefitAvailable !== true) {
      setCouponEligible(false);
      setCouponMessage('O benefício de primeira compra está temporariamente indisponível.');
      return;
    }

    const normalized = normalizeCoupon(coupon);
    setCoupon(normalized);
    setCouponEligible(null);
    setCouponMessage(null);
    setCompleted((current) => current.filter((value) => value < 3));

    if (!normalized) return;
    if (!isFirstPurchaseCoupon(normalized)) {
      setCouponEligible(false);
      setCouponMessage('Cupom não encontrado. Confira o código ou continue sem cupom.');
      return;
    }
    if (!identityComplete) {
      setCouponMessage('Informe um e-mail e telefone válidos na etapa Seus dados antes de validar o benefício.');
      return;
    }

    setCouponChecking(true);
    try {
      const response = await fetch('/api/first-purchase/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, phone: form.phone }),
        cache: 'no-store',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setCouponEligible(false);
        setCouponMessage(data.error || 'Não foi possível validar o benefício agora.');
        return;
      }
      if (data.eligible === true) {
        setCouponEligible(true);
        setCouponMessage(`Cupom ${FIRST_PURCHASE_COUPON} validado: 3% OFF na primeira compra.`);
      } else {
        setCouponEligible(false);
        setCouponMessage(data.reason || 'Este benefício não está disponível para os dados informados.');
      }
    } catch {
      setCouponEligible(false);
      setCouponMessage('Não foi possível validar o benefício agora. Tente novamente.');
    } finally {
      setCouponChecking(false);
    }
  }

  function nextFromBenefit(skip = false) {
    if (benefitAvailable !== true) skip = true;

    if (skip) {
      setCoupon('');
      setCouponEligible(null);
      setCouponMessage(null);
    } else if (coupon.trim()) {
      if (!isFirstPurchaseCoupon(coupon)) {
        setCouponMessage('Confira o código do cupom ou continue sem cupom.');
        return;
      }
      if (couponChecking) return;
      if (couponEligible !== true) {
        setCouponMessage('Clique em Aplicar para validar o benefício antes de continuar.');
        return;
      }
    }

    complete(3);
    setStep(4);
    setMessage(null);
  }

  function canOpen(next: CheckoutStep) {
    if (next === 1) return true;
    if (next === 2) return customerComplete;
    if (next === 3) return customerComplete && deliveryComplete;
    return customerComplete && deliveryComplete && completed.includes(3);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (!hydrated || !lines.length || loading) return;
    if (!customerComplete) {
      setStep(1);
      setMessage('Complete seus dados antes de finalizar.');
      return;
    }
    if (!deliveryComplete) {
      setStep(2);
      setMessage('Complete a entrega antes de finalizar.');
      return;
    }
    if (benefitAvailable === true && coupon.trim() && (!isFirstPurchaseCoupon(coupon) || couponEligible !== true)) {
      setStep(3);
      setCouponMessage('Valide o benefício antes de seguir para o pagamento.');
      return;
    }

    setLoading(true);
    trackBeginCheckout(
      lines.map(({ item, product }) => ({ item_id: product.id, item_name: product.name, price: getEffectivePrice(product), quantity: item.quantity, item_category: product.category })),
      total,
    );

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          coupon: benefitAvailable === true && couponEligible === true ? normalizeCoupon(coupon) : '',
          customer: {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone,
            address: {
              street: form.street.trim(),
              number: form.number.trim(),
              complement: form.complement.trim(),
              neighborhood: form.neighborhood.trim(),
              city: form.city.trim(),
              state: form.state.trim().toUpperCase(),
              zip: form.zip,
            },
          },
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if ((response.status === 409 || response.status === 503) && isFirstPurchaseCoupon(coupon)) {
          setCouponEligible(false);
          setCouponMessage(data.error || 'O benefício não pôde ser confirmado.');
          setCompleted((current) => current.filter((value) => value < 3));
          setStep(3);
        }
        throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      }
      if (!data.checkoutUrl) throw new Error('A InfinitePay não retornou o endereço de pagamento.');
      complete(4);
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível concluir esta etapa. Tente novamente.');
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="checkout-page checkout-loading" aria-busy="true"><div className="checkout-shell"><p className="eyebrow">Agô Trancoso</p><h1 className="checkout-title">Preparando seu pedido…</h1></div></div>;
  }
  if (!lines.length) {
    return <div className="checkout-page checkout-empty"><div className="checkout-shell"><p className="eyebrow">Sua sacola</p><h1 className="checkout-title">Sua sacola está vazia.</h1></div></div>;
  }

  const steps: Array<{ number: CheckoutStep; label: string }> = [
    { number: 1, label: 'Seus dados' },
    { number: 2, label: 'Entrega' },
    { number: 3, label: 'Benefício' },
    { number: 4, label: 'Pagamento' },
  ];
  const couponStatusClass = couponEligible === true ? 'success' : couponEligible === false ? 'error' : 'info';

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="ago-clean-checkout-head">
          <p className="eyebrow">Seu pedido</p>
          <h1 className="checkout-title">Finalizar compra</h1>
          <p>Etapas curtas e sequenciais. Você vê o resumo do pedido o tempo todo.</p>
        </header>

        <nav className="checkout-progress" aria-label="Etapas da compra">
          {steps.map(({ number, label }) => {
            const done = completed.includes(number) || step > number;
            return (
              <button key={number} type="button" className={`checkout-progress-step${step === number ? ' is-active' : ''}${done ? ' is-complete' : ''}`} disabled={!canOpen(number)} aria-current={step === number ? 'step' : undefined} onClick={() => canOpen(number) && setStep(number)}>
                <span>{done ? '✓' : number}</span><strong>{label}</strong>
              </button>
            );
          })}
        </nav>

        <div className="checkout-layout">
          <form onSubmit={submit} className="checkout-form-panel checkout-stepped-form" noValidate>
            {benefitAvailable === true && <div className="checkout-first-purchase"><strong>3% OFF na 1ª compra</strong><span>O benefício é validado pelo e-mail e telefone antes do pagamento.</span></div>}

            <section className={`checkout-stage${step === 1 ? ' is-active' : ''}${completed.includes(1) ? ' is-complete' : ''}`} aria-labelledby="checkout-customer-title">
              <div className="checkout-stage-head"><div><span>01</span><h2 id="checkout-customer-title">Seus dados</h2></div>{step !== 1 && customerComplete && <button type="button" onClick={() => setStep(1)}>Editar</button>}</div>
              {step === 1 ? <div className="checkout-stage-body">
                <div className="checkout-fields-two">
                  <div className="checkout-field"><label htmlFor="name">Nome completo</label><input className="checkout-input" id="name" required name="name" value={form.name} onChange={change} autoComplete="name" /></div>
                  <div className="checkout-field"><label htmlFor="email">E-mail</label><input className="checkout-input" id="email" required type="email" name="email" value={form.email} onChange={change} autoComplete="email" /></div>
                </div>
                <div className="checkout-field"><label htmlFor="phone">Telefone / WhatsApp</label><input className="checkout-input" id="phone" required name="phone" inputMode="tel" value={form.phone} onChange={change} autoComplete="tel" /></div>
                {message && <p className="checkout-error" role="alert">{message}</p>}
                <button type="button" className="checkout-next-step" onClick={nextFromCustomer}>Continuar para entrega</button>
              </div> : customerComplete ? <p className="checkout-stage-summary">{form.name} · {form.email} · {form.phone}</p> : null}
            </section>

            <section className={`checkout-stage${step === 2 ? ' is-active' : ''}${completed.includes(2) ? ' is-complete' : ''}`} aria-labelledby="checkout-address-title">
              <div className="checkout-stage-head"><div><span>02</span><h2 id="checkout-address-title">Entrega</h2></div>{step !== 2 && deliveryComplete && <button type="button" onClick={() => setStep(2)}>Editar</button>}</div>
              {step === 2 ? <div className="checkout-stage-body">
                <div className="checkout-fields-address"><div className="checkout-field"><label htmlFor="zip">CEP</label><input className="checkout-input" id="zip" required name="zip" inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={change} /></div><div className="checkout-field checkout-number"><label htmlFor="number">Número</label><input className="checkout-input" id="number" required name="number" value={form.number} onChange={change} /></div></div>
                <div className="checkout-field"><label htmlFor="street">Rua</label><input className="checkout-input" id="street" required name="street" autoComplete="address-line1" value={form.street} onChange={change} /></div>
                <div className="checkout-field"><label htmlFor="complement">Complemento <span>(opcional)</span></label><input className="checkout-input" id="complement" name="complement" value={form.complement} onChange={change} /></div>
                <div className="checkout-field"><label htmlFor="neighborhood">Bairro</label><input className="checkout-input" id="neighborhood" required name="neighborhood" value={form.neighborhood} onChange={change} /></div>
                <div className="checkout-fields-address"><div className="checkout-field"><label htmlFor="city">Cidade</label><input className="checkout-input" id="city" required name="city" autoComplete="address-level2" value={form.city} onChange={change} /></div><div className="checkout-field checkout-uf"><label htmlFor="state">UF</label><input className="checkout-input" id="state" required name="state" maxLength={2} autoComplete="address-level1" value={form.state} onChange={change} /></div></div>
                <div className="checkout-shipping-note"><span>{freeShipping ? 'Frete grátis neste pedido.' : <>Frete fixo de <strong>R$ 39,90</strong>.</>}</span><span>Grátis acima de R$ 500.</span></div>
                {message && <p className="checkout-error" role="alert">{message}</p>}
                <button type="button" className="checkout-next-step" onClick={nextFromDelivery}>Continuar para benefício</button>
              </div> : deliveryComplete ? <p className="checkout-stage-summary">{form.street}, {form.number} · {form.neighborhood} · {form.city}/{form.state}</p> : <p className="checkout-stage-locked">Conclua seus dados para liberar esta etapa.</p>}
            </section>

            <section className={`checkout-stage checkout-coupon-section${step === 3 ? ' is-active' : ''}${completed.includes(3) ? ' is-complete' : ''}`} aria-labelledby="checkout-coupon-title">
              <div className="checkout-stage-head"><div><span>03</span><h2 id="checkout-coupon-title">Seu benefício</h2></div>{step !== 3 && completed.includes(3) && <button type="button" onClick={() => setStep(3)}>Editar</button>}</div>
              {step === 3 ? <div className="checkout-stage-body">
                {benefitAvailable === null ? <p className="checkout-benefit-copy">Verificando a disponibilidade do benefício…</p> : benefitAvailable === false ? <><p className="checkout-benefit-copy">O benefício de primeira compra está temporariamente indisponível. Seu pedido pode continuar normalmente, sem alterar frete, produtos ou pagamento.</p><button type="button" className="checkout-next-step" onClick={() => nextFromBenefit(true)}>Continuar para pagamento</button></> : <>
                  <p className="checkout-benefit-copy">Na primeira compra, use <strong>{FIRST_PURCHASE_COUPON}</strong>. A validação acontece antes de liberar o pagamento.</p>
                  <div className="checkout-coupon-row"><input className="checkout-input" aria-label="Cupom de desconto" value={coupon} onChange={(event) => { setCoupon(event.target.value.toUpperCase().replace(/\s/g, '').slice(0, 20)); setCouponEligible(null); setCouponMessage(null); setCompleted((current) => current.filter((value) => value < 3)); }} placeholder="Cupom" /><button type="button" disabled={couponChecking} onClick={applyCoupon}>{couponChecking ? 'Validando…' : 'Aplicar'}</button></div>
                  {couponMessage && <p className={`checkout-coupon-message ${couponStatusClass}`} role="status">{couponMessage}</p>}
                  <div className="checkout-benefit-actions"><button type="button" className="checkout-next-step" disabled={couponChecking} onClick={() => nextFromBenefit(false)}>Continuar para pagamento</button><button type="button" className="checkout-skip-benefit" onClick={() => nextFromBenefit(true)}>Continuar sem cupom</button></div>
                </>}
              </div> : completed.includes(3) ? <p className="checkout-stage-summary">{discount > 0 ? `${FIRST_PURCHASE_COUPON} validado · ${formatBRL(discount)} de desconto` : 'Sem cupom aplicado'}</p> : <p className="checkout-stage-locked">Conclua a entrega para liberar esta etapa.</p>}
            </section>

            <section className={`checkout-stage checkout-payment-stage${step === 4 ? ' is-active' : ''}`} aria-labelledby="checkout-payment-title">
              <div className="checkout-stage-head"><div><span>04</span><h2 id="checkout-payment-title">Pagamento</h2></div></div>
              {step === 4 ? <div className="checkout-stage-body"><div className="checkout-payment-card"><div><strong>InfinitePay</strong><span>Ambiente seguro para concluir o pagamento.</span></div><strong>{formatBRL(total)}</strong></div>{message && <p className="checkout-error" role="alert">{message}</p>}<button disabled={loading} type="submit" className="checkout-submit">{loading ? 'Preparando pagamento…' : 'Pagar com InfinitePay'}</button><p className="checkout-note">Você será direcionado ao ambiente seguro da InfinitePay.</p></div> : <p className="checkout-stage-locked">Conclua a etapa de benefício para liberar o pagamento.</p>}
            </section>
          </form>

          <aside className="checkout-summary" aria-label="Resumo do pedido">
            <div className="ago-clean-summary-head"><p className="eyebrow">Resumo</p><h2>Seu pedido</h2></div>
            <div className="checkout-summary-items">{lines.map(({ item, product }) => <div key={item.productId} className="checkout-summary-item"><div className="checkout-product-main"><div className="checkout-product-image"><Image src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} width={60} height={60} quality={82} /></div><div><span className="checkout-product-name">{product.name}</span><span className="checkout-product-price">{item.quantity} × {formatBRL(getEffectivePrice(product))}</span></div></div><span className="checkout-line-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</span></div>)}</div>
            <div className="ago-clean-summary-bottom"><div className="checkout-summary-row"><span>Subtotal</span><strong>{formatBRL(subtotal)}</strong></div>{discount > 0 && <div className="checkout-summary-row checkout-discount-row"><span>1ª compra · 3% OFF</span><strong>- {formatBRL(discount)}</strong></div>}<div className="checkout-summary-row"><span>Frete</span><strong>{shippingValue === 0 ? 'Grátis' : formatBRL(shippingValue)}</strong></div><div className="checkout-total"><span>Total</span><strong>{formatBRL(total)}</strong></div></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
