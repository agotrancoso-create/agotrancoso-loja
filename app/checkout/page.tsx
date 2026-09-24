'use client';

import Image from 'next/image';
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
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

export default function CheckoutPage() {
  const { items, hydrated } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
  });

  const lines = useMemo<Line[]>(() => items.flatMap((item): Line[] => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);

  const subtotal = lines.reduce((sum, line) => sum + getEffectivePrice(line.product) * line.item.quantity, 0);
  const discount = calculateCouponDiscount(subtotal, coupon);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const freeShipping = shouldOfferFreeShipping(subtotal);
  const shippingValue = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = discountedSubtotal + shippingValue;

  function change(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === 'zip'
        ? value.replace(/\D/g, '').slice(0, 8)
        : name === 'state'
          ? value.toUpperCase().slice(0, 2)
          : value,
    }));
    if (name === 'zip') setShippingError(null);
  }

  function applyCoupon() {
    const normalized = normalizeCoupon(coupon);
    setCoupon(normalized);
    if (!normalized) {
      setCouponMessage(null);
      return;
    }
    if (!isFirstPurchaseCoupon(normalized)) {
      setCouponMessage('Cupom não encontrado. Confira o código e tente novamente.');
      return;
    }
    setCouponMessage(`Cupom ${FIRST_PURCHASE_COUPON} aplicado: 3% OFF.`);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setShippingError(null);

    if (!hydrated) return;
    if (!lines.length) {
      setError('Seu carrinho está vazio.');
      return;
    }
    if (form.zip.replace(/\D/g, '').length !== 8) {
      setShippingError('Informe um CEP válido com 8 dígitos.');
      return;
    }
    if (coupon && !isFirstPurchaseCoupon(coupon)) {
      setCouponMessage('Confira o código do cupom antes de continuar.');
      return;
    }

    setLoading(true);
    trackBeginCheckout(
      lines.map(({ item, product }) => ({
        item_id: product.id,
        item_name: product.name,
        price: getEffectivePrice(product),
        quantity: item.quantity,
        item_category: product.category,
      })),
      total
    );

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          coupon: normalizeCoupon(coupon),
          shippingValue,
          shippingName: freeShipping ? 'Frete grátis' : 'Frete fixo',
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: {
              street: form.street,
              number: form.number,
              complement: form.complement,
              neighborhood: form.neighborhood,
              city: form.city,
              state: form.state,
              zip: form.zip,
            },
          },
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

  if (!hydrated) {
    return (
      <div className="checkout-page checkout-loading" aria-busy="true">
        <div className="checkout-shell">
          <div className="checkout-loading-card">
            <p className="eyebrow">Agô Trancoso</p>
            <h1 className="checkout-title">Preparando seu pedido…</h1>
            <p>Carregando suas peças com segurança.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="checkout-page checkout-empty">
        <div className="checkout-shell">
          <p className="eyebrow">Sua sacola</p>
          <h1 className="checkout-title">Seu carrinho está vazio.</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <header className="ago-clean-checkout-head">
          <p className="eyebrow">Seu pedido</p>
          <h1 className="checkout-title">Finalizar compra</h1>
          <p>Você está a um passo de levar uma peça da Agô para casa.</p>
        </header>

        <div className="checkout-layout">
          <form onSubmit={submit} className="checkout-form-panel" noValidate={false}>
            <div className="checkout-first-purchase">
              <strong>3% OFF na 1ª compra</strong>
              <span>Use o cupom <b>{FIRST_PURCHASE_COUPON}</b>.</span>
            </div>

            <section className="checkout-section" aria-labelledby="checkout-customer-title">
              <h2 id="checkout-customer-title">Seus dados</h2>
              <div className="checkout-fields-two">
                <div className="checkout-field">
                  <label htmlFor="name">Nome completo</label>
                  <input className="checkout-input" id="name" required name="name" placeholder="Seu nome" value={form.name} onChange={change} autoComplete="name" />
                </div>
                <div className="checkout-field">
                  <label htmlFor="email">E-mail</label>
                  <input className="checkout-input" id="email" required type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={change} autoComplete="email" />
                </div>
              </div>
              <div className="checkout-field">
                <label htmlFor="phone">Telefone / WhatsApp</label>
                <input className="checkout-input" id="phone" required name="phone" inputMode="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={change} autoComplete="tel" />
              </div>
            </section>

            <section className="checkout-section" aria-labelledby="checkout-address-title">
              <h2 id="checkout-address-title">Entrega</h2>
              <div className="checkout-fields-address">
                <div className="checkout-field">
                  <label htmlFor="zip">CEP</label>
                  <input className="checkout-input" id="zip" required name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="00000000" value={form.zip} onChange={change} aria-describedby={shippingError ? 'checkout-shipping-error' : undefined} />
                </div>
                <div className="checkout-field checkout-number">
                  <label htmlFor="number">Número</label>
                  <input className="checkout-input" id="number" required name="number" placeholder="Nº" value={form.number} onChange={change} autoComplete="address-line2" />
                </div>
              </div>
              <div className="checkout-field">
                <label htmlFor="street">Rua</label>
                <input className="checkout-input" id="street" required name="street" autoComplete="address-line1" placeholder="Rua / avenida" value={form.street} onChange={change} />
              </div>
              <div className="checkout-field">
                <label htmlFor="complement">Complemento <span>(opcional)</span></label>
                <input className="checkout-input" id="complement" name="complement" placeholder="Apartamento, casa, referência" value={form.complement} onChange={change} autoComplete="address-line3" />
              </div>
              <div className="checkout-field">
                <label htmlFor="neighborhood">Bairro</label>
                <input className="checkout-input" id="neighborhood" required name="neighborhood" value={form.neighborhood} onChange={change} />
              </div>
              <div className="checkout-fields-address">
                <div className="checkout-field">
                  <label htmlFor="city">Cidade</label>
                  <input className="checkout-input" id="city" required name="city" value={form.city} onChange={change} autoComplete="address-level2" />
                </div>
                <div className="checkout-field checkout-uf">
                  <label htmlFor="state">UF</label>
                  <input className="checkout-input" id="state" required name="state" maxLength={2} placeholder="BA" value={form.state} onChange={change} autoComplete="address-level1" />
                </div>
              </div>
              <div className="checkout-shipping-note">
                <span>{freeShipping ? 'Frete grátis neste pedido.' : <>Frete fixo de <strong>R$ 39,90</strong>.</>}</span>
                <span>Grátis acima de R$ 500.</span>
              </div>
              {shippingError && <p id="checkout-shipping-error" className="checkout-error" role="alert">{shippingError}</p>}
            </section>

            <section className="checkout-section checkout-coupon-section" aria-labelledby="checkout-coupon-title">
              <h2 id="checkout-coupon-title">Seu benefício</h2>
              <div className="checkout-coupon-row">
                <input
                  className="checkout-input"
                  aria-label="Cupom de desconto"
                  value={coupon}
                  onChange={(event) => {
                    setCoupon(event.target.value.toUpperCase().replace(/\s/g, '').slice(0, 20));
                    setCouponMessage(null);
                  }}
                  placeholder="Cupom"
                />
                <button type="button" onClick={applyCoupon}>Aplicar</button>
              </div>
              {couponMessage && <p className={`checkout-coupon-message ${isFirstPurchaseCoupon(coupon) ? 'success' : 'error'}`} role="status">{couponMessage}</p>}
            </section>

            {error && <p className="checkout-error" role="alert">{error}</p>}
            <button disabled={loading} type="submit" className="checkout-submit">{loading ? 'Preparando pagamento…' : 'Ir para o pagamento'}</button>
            <p className="checkout-note">Pagamento seguro pela InfinitePay.</p>
          </form>

          <aside className="checkout-summary" aria-label="Resumo do pedido">
            <div className="ago-clean-summary-head">
              <p className="eyebrow">Resumo</p>
              <h2>Seu pedido</h2>
            </div>

            <div className="checkout-summary-items" aria-label="Suas peças">
              {lines.map(({ item, product }) => (
                <div key={item.productId} className="checkout-summary-item">
                  <div className="checkout-product-main">
                    <div className="checkout-product-image">
                      <Image src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} width={60} height={66} />
                    </div>
                    <div>
                      <span className="checkout-product-name">{product.name}</span>
                      <span className="checkout-product-price">{item.quantity} × {formatBRL(getEffectivePrice(product))}</span>
                    </div>
                  </div>
                  <span className="checkout-line-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="ago-clean-summary-bottom">
              <div className="checkout-summary-row"><span>Subtotal</span><strong>{formatBRL(subtotal)}</strong></div>
              {discount > 0 && <div className="checkout-summary-row checkout-discount-row"><span>1ª compra · 3% OFF</span><strong>- {formatBRL(discount)}</strong></div>}
              <div className="checkout-summary-row"><span>Frete</span><strong>{shippingValue === 0 ? 'Grátis' : formatBRL(shippingValue)}</strong></div>
              <div className="checkout-total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
