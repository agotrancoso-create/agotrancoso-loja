'use client';

import Image from 'next/image';
import Link from 'next/link';
import { whatsappLink } from '@/lib/config';
import { customerErrors, addressErrors } from '@/lib/checkout-validation';
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice } from '@/lib/products';
import { calculateCouponDiscount, FIRST_PURCHASE_COUPON, isFirstPurchaseCoupon, normalizeCoupon } from '@/lib/coupons';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import type { CartItem, Product } from '@/lib/types';
import { trackBeginCheckout } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

export default function CheckoutPage() {
  const { items, hydrated } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [benefitAvailable, setBenefitAvailable] = useState(false);
  const [couponChecking, setCouponChecking] = useState(false);
  const couponRequest = useRef(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [benefitConfirmed, setBenefitConfirmed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [step, setStep] = useState<CheckoutStep>(1);
  const [completedSteps, setCompletedSteps] = useState<CheckoutStep[]>([]);
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' });

  useEffect(() => {
    try {
      const storedCoupon = normalizeCoupon(localStorage.getItem('ago_primeira_compra_v3_cupom'));
      const storedEmail = localStorage.getItem('ago_primeira_compra_v3_email') || '';
      if (isFirstPurchaseCoupon(storedCoupon)) setCoupon(storedCoupon);
      if (storedEmail) setForm(current => ({ ...current, email: storedEmail }));
    } catch {}
    let active = true;
    fetch('/api/first-purchase/eligibility', { cache: 'no-store' }).then(response => response.json()).then(data => {
      if (!active) return;
      setBenefitAvailable(data.available === true);
      if (data.available !== true) { setCoupon(''); setAppliedCoupon(''); }
    }).catch(() => { if (active) { setBenefitAvailable(false); setCoupon(''); } });
    return () => { active = false; };
  }, []);

  const lines = useMemo<Line[]>(() => items.flatMap((item): Line[] => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);

  const subtotal = lines.reduce((sum, line) => sum + getEffectivePrice(line.product) * line.item.quantity, 0);
  const discount = calculateCouponDiscount(subtotal, appliedCoupon);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const freeShipping = shouldOfferFreeShipping(subtotal);
  const shippingValue = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = discountedSubtotal + shippingValue;

  const customerComplete = Object.keys(customerErrors(form)).length === 0;
  const deliveryComplete = Object.keys(addressErrors(form)).length === 0;
  useEffect(() => {
    if (step === 1) return;
    const heading = formRef.current?.querySelector<HTMLElement>('.checkout-stage.is-active h2');
    heading?.focus({ preventScroll: true });
  }, [step]);

  function validateStage(kind: 'customer' | 'address') {
    const errors = kind === 'customer' ? customerErrors(form) : addressErrors(form);
    setFieldErrors(errors);
    const first = Object.keys(errors)[0];
    if (first) document.getElementById(first)?.focus();
    return !first;
  }
  function fieldProps(name: string) {
    return { 'aria-invalid': Boolean(fieldErrors[name]), 'aria-describedby': fieldErrors[name] ? `${name}-error` : undefined };
  }
  function fieldError(name: string) {
    return fieldErrors[name] ? <p id={`${name}-error`} className="checkout-error">{fieldErrors[name]}</p> : null;
  }

  function change(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === 'email' || name === 'phone') {
      couponRequest.current += 1;
      setAppliedCoupon(''); setBenefitConfirmed(false); setCouponChecking(false);
      if (coupon) setCouponMessage('Confirme o cupom novamente após alterar seus dados.');
    }
    setForm((current) => ({ ...current, [name]: name === 'zip' ? value.replace(/\D/g, '').slice(0, 8) : name === 'state' ? value.toUpperCase().slice(0, 2) : value }));
    setFieldErrors((current) => { const next = { ...current }; delete next[name]; return next; });
    setCompletedSteps((current) => current.filter((n) => n < (['name','email','phone'].includes(name) ? 1 : 2)));
    setStepError(null);
    if (name === 'zip') setShippingError(null);
  }

  function markComplete(value: CheckoutStep) {
    setCompletedSteps((current) => current.includes(value) ? current : [...current, value]);
  }

  function goToDelivery() {
    setStepError(null);
    if (!validateStage('customer')) {
      setStepError('Preencha nome, e-mail e WhatsApp para continuar.');
      return;
    }
    markComplete(1);
    setStep(2);
  }

  function goToBenefit() {
    if (!customerComplete || !completedSteps.includes(1)) { setStep(1); return; }
    setStepError(null);
    setShippingError(null);
    if (!validateStage('address')) {
      if (form.zip.replace(/\D/g, '').length !== 8) setShippingError('Informe um CEP válido com 8 dígitos.');
      setStepError('Complete os dados de entrega para continuar.');
      return;
    }
    markComplete(2);
    setStep(3);
  }

  function editStep(next: CheckoutStep) {
    if (next >= 2 && (!customerComplete || !completedSteps.includes(1))) return;
    if (next >= 3 && (!deliveryComplete || !completedSteps.includes(2))) return;
    if (next === 4 && !benefitConfirmed) return;
    setStepError(null);
    setShippingError(null);
    setFieldErrors({});
    setStep(next);
  }

  async function applyCoupon() {
    if (couponChecking) return;
    setAppliedCoupon(''); setBenefitConfirmed(false);
    if (!benefitAvailable) { setCouponMessage('O benefício está temporariamente indisponível. Você pode continuar sem cupom.'); return; }
    const normalized = normalizeCoupon(coupon);
    setCoupon(normalized);
    if (!isFirstPurchaseCoupon(normalized)) { setCouponMessage('Cupom não encontrado. Confira o código e tente novamente.'); return; }
    if (!customerComplete) { setStep(1); return; }
    const request = ++couponRequest.current;
    setCouponChecking(true); setCouponMessage(null);
    try {
      const response = await fetch('/api/first-purchase/eligibility', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, phone: form.phone }), cache: 'no-store' });
      const data = await response.json();
      if (request !== couponRequest.current) return;
      if (!response.ok || data.eligible !== true) { setCouponMessage(data.error || data.reason || 'Não foi possível validar o benefício.'); return; }
      setAppliedCoupon(normalized);
      setCouponMessage(`Cupom ${FIRST_PURCHASE_COUPON} validado: 3% OFF.`);
    } catch { if (request === couponRequest.current) setCouponMessage('Não foi possível validar o benefício agora. Tente novamente.'); }
    finally { if (request === couponRequest.current) setCouponChecking(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setStepError(null);
    setShippingError(null);

    if (!hydrated || loading) return;
    if (step !== 4) {
      if (step === 1) goToDelivery();
      else if (step === 2) goToBenefit();
      else applyCoupon();
      return;
    }
    if (!benefitConfirmed) { setStep(3); return; }
    if (!lines.length) { setError('Sua sacola está vazia.'); return; }
    if (!customerComplete) { setStep(1); setStepError('Complete seus dados antes de finalizar.'); return; }
    if (!deliveryComplete) {
      setStep(2);
      if (form.zip.replace(/\D/g, '').length !== 8) setShippingError('Informe um CEP válido com 8 dígitos.');
      setStepError('Complete a entrega antes de finalizar.');
      return;
    }
    if (appliedCoupon && !isFirstPurchaseCoupon(appliedCoupon)) { setStep(3); setCouponMessage('Confira o código do cupom antes de continuar.'); return; }

    markComplete(3);
    setLoading(true);
    trackBeginCheckout(lines.map(({ item, product }) => ({ item_id: product.id, item_name: product.name, price: getEffectivePrice(product), quantity: item.quantity, item_category: product.category })), total);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          coupon: normalizeCoupon(appliedCoupon),
          shippingValue,
          shippingName: freeShipping ? 'Frete grátis' : 'Frete fixo',
          customer: { name: form.name, email: form.email, phone: form.phone, address: { street: form.street, number: form.number, complement: form.complement, neighborhood: form.neighborhood, city: form.city, state: form.state, zip: form.zip } },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir esta etapa. Tente novamente.');
      setLoading(false);
    }
  }

  if (!hydrated) return <div className="checkout-page checkout-loading" aria-busy="true"><div className="checkout-shell"><div className="checkout-loading-card"><p className="eyebrow">Agô Trancoso</p><h1 className="checkout-title">Preparando seu pedido…</h1><p>Carregando suas peças com segurança.</p></div></div></div>;
  if (!lines.length) return <div className="checkout-page checkout-empty"><div className="checkout-shell"><p className="eyebrow">Sua sacola</p><h1 className="checkout-title">Sua sacola está vazia.</h1><Link href="/produtos" className="text-link">Explorar coleção</Link></div></div>;

  const steps = [{ number: 1 as CheckoutStep, label: 'Seus dados' }, { number: 2 as CheckoutStep, label: 'Entrega' }, { number: 3 as CheckoutStep, label: 'Benefício' }, { number: 4 as CheckoutStep, label: 'Pagamento' }];

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="ago-clean-checkout-head">
          <p className="eyebrow">Seu pedido</p>
          <h1 className="checkout-title">Finalizar compra</h1>
          <p>Quatro etapas curtas. Você vê o pedido o tempo todo.</p>
        </header>

        <nav className="checkout-progress" aria-label="Etapas da compra">
          {steps.map(({ number, label }) => {
            const complete = completedSteps.includes(number);
            const unlocked = number === 1 || (number === 2 && completedSteps.includes(1) && customerComplete) || (number === 3 && completedSteps.includes(2) && customerComplete && deliveryComplete) || (number === 4 && completedSteps.includes(2) && customerComplete && deliveryComplete && benefitConfirmed);
            return <button key={number} type="button" className={`checkout-progress-step${step === number ? ' is-active' : ''}${complete ? ' is-complete' : ''}`} onClick={() => editStep(number)} disabled={!unlocked} aria-current={step === number ? 'step' : undefined}><span>{complete ? '✓' : number}</span><strong>{label}</strong></button>;
          })}
        </nav>

        <div className="checkout-layout">
          <form ref={formRef} onSubmit={submit} className="checkout-form-panel checkout-stepped-form" noValidate>
            {benefitAvailable && <div className="checkout-first-purchase"><strong>3% OFF na 1ª compra</strong><span>O cupom pode ser aplicado na etapa Benefício.</span></div>}

            <section className={`checkout-stage${step === 1 ? ' is-active' : ''}${completedSteps.includes(1) ? ' is-complete' : ''}`} aria-labelledby="checkout-customer-title">
              <div className="checkout-stage-head"><div><span>01</span><h2 tabIndex={-1} id="checkout-customer-title">Seus dados</h2></div>{step !== 1 && customerComplete && <button type="button" onClick={() => editStep(1)}>Editar</button>}</div>
              {step === 1 ? <div className="checkout-stage-body">
                <div className="checkout-fields-two"><div className="checkout-field"><label htmlFor="name">Nome completo</label><input className="checkout-input" id="name" {...fieldProps('name')} required name="name" placeholder="Seu nome" value={form.name} onChange={change} autoComplete="name" />{fieldError('name')}</div><div className="checkout-field"><label htmlFor="email">E-mail</label><input className="checkout-input" id="email" {...fieldProps('email')} required type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={change} autoComplete="email" />{fieldError('email')}</div></div>
                <div className="checkout-field"><label htmlFor="phone">Telefone / WhatsApp</label><input className="checkout-input" id="phone" {...fieldProps('phone')} required name="phone" inputMode="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={change} autoComplete="tel" />{fieldError('phone')}</div>
                {stepError && <p className="checkout-error" role="alert">{stepError}</p>}
                <button type="button" className="checkout-next-step" onClick={goToDelivery}>Continuar para entrega</button>
              </div> : customerComplete ? <p className="checkout-stage-summary">{form.name} · {form.email} · {form.phone}</p> : null}
            </section>

            <section className={`checkout-stage${step === 2 ? ' is-active' : ''}${completedSteps.includes(2) ? ' is-complete' : ''}`} aria-labelledby="checkout-address-title">
              <div className="checkout-stage-head"><div><span>02</span><h2 tabIndex={-1} id="checkout-address-title">Entrega</h2></div>{step !== 2 && customerComplete && completedSteps.includes(1) && deliveryComplete && <button type="button" onClick={() => editStep(2)}>Editar</button>}</div>
              {step === 2 ? <div className="checkout-stage-body">
                <div className="checkout-fields-address"><div className="checkout-field"><label htmlFor="zip">CEP</label><input className="checkout-input" id="zip" {...fieldProps('zip')} required name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="00000000" value={form.zip} onChange={change} />{fieldError('zip')}</div><div className="checkout-field checkout-number"><label htmlFor="number">Número</label><input className="checkout-input" id="number" {...fieldProps('number')} required name="number" placeholder="Nº" value={form.number} onChange={change} autoComplete="address-line2" />{fieldError('number')}</div></div>
                <div className="checkout-field"><label htmlFor="street">Rua</label><input className="checkout-input" id="street" {...fieldProps('street')} required name="street" autoComplete="address-line1" placeholder="Rua / avenida" value={form.street} onChange={change} />{fieldError('street')}</div>
                <div className="checkout-field"><label htmlFor="complement">Complemento <span>(opcional)</span></label><input className="checkout-input" id="complement" {...fieldProps('complement')} name="complement" placeholder="Apartamento, casa, referência" value={form.complement} onChange={change} autoComplete="address-line3" />{fieldError('complement')}</div>
                <div className="checkout-field"><label htmlFor="neighborhood">Bairro</label><input className="checkout-input" id="neighborhood" {...fieldProps('neighborhood')} required name="neighborhood" value={form.neighborhood} onChange={change} />{fieldError('neighborhood')}</div>
                <div className="checkout-fields-address"><div className="checkout-field"><label htmlFor="city">Cidade</label><input className="checkout-input" id="city" {...fieldProps('city')} required name="city" value={form.city} onChange={change} autoComplete="address-level2" />{fieldError('city')}</div><div className="checkout-field checkout-uf"><label htmlFor="state">UF</label><input className="checkout-input" id="state" {...fieldProps('state')} required name="state" maxLength={2} placeholder="BA" value={form.state} onChange={change} autoComplete="address-level1" />{fieldError('state')}</div></div>
                <a className="checkout-international-link" href={whatsappLink('Olá! Gostaria de consultar um envio internacional.')} target="_blank" rel="noopener noreferrer">Fora do Brasil? Consulte o envio internacional.</a><div className="checkout-shipping-note"><span>{freeShipping ? 'Frete grátis neste pedido.' : <>Frete fixo de <strong>R$ 39,90</strong>.</>}</span><span>Grátis acima de R$ 500.</span></div>
                {shippingError && <p id="checkout-shipping-error" className="checkout-error" role="alert">{shippingError}</p>}{stepError && <p className="checkout-error" role="alert">{stepError}</p>}
                <button type="button" className="checkout-next-step" onClick={goToBenefit}>Continuar para benefício</button>
              </div> : deliveryComplete ? <p className="checkout-stage-summary">{form.street}, {form.number} · {form.neighborhood} · {form.city}/{form.state}</p> : <p className="checkout-stage-locked">Conclua seus dados para liberar esta etapa.</p>}
            </section>

            <section className={`checkout-stage checkout-coupon-section${step === 3 ? ' is-active' : ''}`} aria-labelledby="checkout-coupon-title">
              <div className="checkout-stage-head"><div><span>03</span><h2 tabIndex={-1} id="checkout-coupon-title">Seu benefício</h2></div>{step !== 3 && customerComplete && deliveryComplete && completedSteps.includes(2) && benefitConfirmed && <button type="button" onClick={() => editStep(3)}>Editar</button>}</div>
              {step === 3 ? <div className="checkout-stage-body">
                <p className="checkout-benefit-copy">{benefitAvailable ? <>Se for sua primeira compra, aplique o cupom <strong>{FIRST_PURCHASE_COUPON}</strong>. A elegibilidade é validada pelo e-mail e telefone.</> : 'O benefício está temporariamente indisponível. Você pode continuar sem cupom.'}</p>
                {benefitAvailable && <div className="checkout-coupon-row"><input disabled={couponChecking} className="checkout-input" aria-label="Cupom de desconto" value={coupon} onChange={(event) => { setCoupon(event.target.value.toUpperCase().replace(/\s/g, '').slice(0, 20)); setCouponMessage(null); setAppliedCoupon(''); setBenefitConfirmed(false); }} placeholder="Cupom" /><button type="button" disabled={couponChecking} onClick={applyCoupon}>{couponChecking ? 'Validando…' : 'Aplicar'}</button></div>}
                {couponMessage && <p className={`checkout-coupon-message ${appliedCoupon ? 'success' : 'error'}`} role="status">{couponMessage}</p>}{error && <p className="checkout-error" role="alert">{error}</p>}
                {appliedCoupon && <button type="button" className="checkout-next-step" onClick={() => { setBenefitConfirmed(true); markComplete(3); setStep(4); }}>Continuar com benefício</button>}
                <button type="button" className="checkout-without-coupon" onClick={() => { couponRequest.current += 1; setCouponChecking(false); setCoupon(''); setAppliedCoupon(''); setCouponMessage(null); setBenefitConfirmed(true); markComplete(3); setStep(4); }}>Continuar sem cupom</button>
              </div> : <p className="checkout-stage-locked">{benefitConfirmed ? (appliedCoupon ? `Cupom ${appliedCoupon} aplicado.` : 'Continuar sem cupom.') : 'Conclua a entrega para liberar esta etapa.'}</p>}
            </section>
            <section className={`checkout-stage${step === 4 ? ' is-active' : ''}`} aria-labelledby="checkout-payment-title">
              <div className="checkout-stage-head"><div><span>04</span><h2 tabIndex={-1} id="checkout-payment-title">Pagamento</h2></div></div>
              {step === 4 ? <div className="checkout-stage-body">
                <p className="checkout-payment-copy">Revise seu pedido. Você será encaminhado ao ambiente seguro da InfinitePay para escolher a forma de pagamento e concluir a compra.</p>
                <div className="checkout-payment-total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
                {error && <p className="checkout-error" role="alert">{error}</p>}
                <button disabled={loading} type="submit" className="checkout-submit">{loading ? 'Preparando pagamento…' : 'Pagar com InfinitePay'}</button>
                <p className="checkout-note">O pagamento será feito na próxima tela.</p>
              </div> : <p className="checkout-stage-locked">Conclua a etapa de benefício para revisar e pagar.</p>}
            </section>
          </form>

          <aside className="checkout-summary" aria-label="Resumo do pedido">
            <div className="ago-clean-summary-head"><p className="eyebrow">Resumo</p><h2>Seu pedido</h2></div>
            <div className="checkout-summary-items" aria-label="Suas peças">{lines.map(({ item, product }) => <div key={item.productId} className="checkout-summary-item"><div className="checkout-product-main"><div className="checkout-product-image"><Image src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} width={60} height={60} /></div><div><span className="checkout-product-name">{product.name}</span><span className="checkout-product-price">{item.quantity} × {formatBRL(getEffectivePrice(product))}</span></div></div><span className="checkout-line-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</span></div>)}</div>
            <div className="ago-clean-summary-bottom"><div className="checkout-summary-row"><span>Subtotal</span><strong>{formatBRL(subtotal)}</strong></div>{discount > 0 && <div className="checkout-summary-row checkout-discount-row"><span>1ª compra · 3% OFF</span><strong>- {formatBRL(discount)}</strong></div>}<div className="checkout-summary-row"><span>Frete</span><strong>{shippingValue === 0 ? 'Grátis' : formatBRL(shippingValue)}</strong></div><div className="checkout-total"><span>Total</span><strong>{formatBRL(total)}</strong></div></div>
          </aside>
        </div>
      </div>
    </div>
  );
}
