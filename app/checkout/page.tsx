'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice } from '@/lib/products';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import type { CartItem, Product } from '@/lib/types';

function formatBRL(value: number) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

type FormState = { name: string; email: string; phone: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; zip: string };

export default function CheckoutPage() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name:'', email:'', phone:'', street:'', number:'', complement:'', neighborhood:'', city:'', state:'', zip:'' });

  type Line = { item: CartItem; product: Product };
  const lines = useMemo<Line[]>(() => items.flatMap((item): Line[] => { const product = getProductById(item.productId); return product ? [{ item, product }] : []; }), [items]);
  const subtotal = lines.reduce((sum, line) => sum + getEffectivePrice(line.product) * line.item.quantity, 0);
  const freeShipping = shouldOfferFreeShipping(subtotal);
  const shippingValue = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = subtotal + shippingValue;

  function change(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'zip' ? value.replace(/\D/g, '').slice(0, 8) : name === 'state' ? value.toUpperCase().slice(0, 2) : value }));
    if (name === 'zip') setShippingError(null);
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setError(null);
    if (!lines.length) { setError('Seu carrinho está vazio.'); return; }
    if (form.zip.replace(/\D/g, '').length !== 8) { setShippingError('Informe um CEP válido com 8 dígitos.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items, shippingValue, shippingName: freeShipping ? 'Frete grátis' : 'Frete fixo', customer: { name:form.name, email:form.email, phone:form.phone, address:{ street:form.street, number:form.number, complement:form.complement, neighborhood:form.neighborhood, city:form.city, state:form.state, zip:form.zip } } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      window.location.href = data.checkoutUrl;
    } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível concluir esta etapa. Tente novamente.'); setLoading(false); }
  }

  if (!lines.length) return <div className="checkout-page checkout-empty"><div className="checkout-shell"><h1 className="checkout-title">Seu carrinho está vazio.</h1></div></div>;

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <div className="checkout-layout">
          <div className="checkout-form-panel">
            <p className="eyebrow">Pedido</p>
            <h1 className="checkout-title">Finalizar compra</h1>
            <form onSubmit={submit} className="checkout-form">
              <section className="checkout-section">
                <h2>Seus dados</h2>
                <div className="checkout-field"><label htmlFor="name" className="checkout-label">Nome completo</label><input id="name" required name="name" placeholder="Como devemos chamar você?" value={form.name} onChange={change} className="checkout-input" /></div>
                <div className="checkout-fields-two">
                  <div className="checkout-field"><label htmlFor="email" className="checkout-label">E-mail</label><input id="email" required type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={change} className="checkout-input" /></div>
                  <div className="checkout-field"><label htmlFor="phone" className="checkout-label">Telefone / WhatsApp</label><input id="phone" required name="phone" inputMode="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={change} className="checkout-input" /></div>
                </div>
              </section>

              <section className="checkout-section">
                <h2>Entrega</h2>
                <div className="checkout-field"><label htmlFor="zip" className="checkout-label">CEP</label><input id="zip" required name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={form.zip} onChange={change} className="checkout-input" /></div>
                <div className="checkout-shipping-note">{freeShipping ? 'Frete grátis neste pedido.' : <>Frete fixo de <strong>R$ 39,90</strong>.</>}<span>Compras acima de R$ 500 têm frete grátis.</span></div>
                {shippingError && <p className="checkout-error" role="alert">{shippingError}</p>}
                <div className="checkout-fields-address"><div className="checkout-field"><label htmlFor="street" className="checkout-label">Rua</label><input id="street" required name="street" autoComplete="street-address" placeholder="Rua / avenida" value={form.street} onChange={change} className="checkout-input" /></div><div className="checkout-field checkout-number"><label htmlFor="number" className="checkout-label">Número</label><input id="number" required name="number" placeholder="Nº" value={form.number} onChange={change} className="checkout-input" /></div></div>
                <div className="checkout-field"><label htmlFor="complement" className="checkout-label">Complemento <span>(opcional)</span></label><input id="complement" name="complement" placeholder="Apartamento, casa, etc." value={form.complement} onChange={change} className="checkout-input" /></div>
                <div className="checkout-field"><label htmlFor="neighborhood" className="checkout-label">Bairro</label><input id="neighborhood" required name="neighborhood" value={form.neighborhood} onChange={change} className="checkout-input" /></div>
                <div className="checkout-fields-address"><div className="checkout-field"><label htmlFor="city" className="checkout-label">Cidade</label><input id="city" required name="city" value={form.city} onChange={change} className="checkout-input" /></div><div className="checkout-field checkout-uf"><label htmlFor="state" className="checkout-label">UF</label><input id="state" required name="state" maxLength={2} placeholder="UF" value={form.state} onChange={change} className="checkout-input" /></div></div>
              </section>

              {error && <p className="checkout-error" role="alert">{error}</p>}
              <button disabled={loading} type="submit" className="checkout-submit">{loading ? 'Preparando pagamento…' : 'Ir para o pagamento'}</button>
              <p className="checkout-note">Pagamento seguro pela InfinitePay. Frete fixo de R$ 39,90 ou grátis em compras acima de R$ 500.</p>
            </form>
          </div>

          <aside className="checkout-summary" aria-label="Resumo do pedido">
            <p className="eyebrow">Resumo</p><h2>Seu pedido</h2>
            <div className="checkout-summary-items">
              {lines.map(({item,product}) => <div key={item.productId} className="checkout-summary-item"><div className="checkout-product-main"><div className="checkout-product-image"><img src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} /></div><div><span className="checkout-product-name">{product.name} × {item.quantity}</span><span className="checkout-product-price">{formatBRL(getEffectivePrice(product))} / un.</span></div></div><span className="checkout-line-total">{formatBRL(getEffectivePrice(product)*item.quantity)}</span></div>)}
            </div>
            <div className="checkout-summary-row"><span>Subtotal</span><strong>{formatBRL(subtotal)}</strong></div>
            <div className="checkout-summary-row"><span>Frete</span><strong>{shippingValue === 0 ? 'Grátis' : formatBRL(shippingValue)}</strong></div>
            <div className="checkout-total"><span>Total</span><strong>{formatBRL(total)}</strong></div>
            <p className="checkout-privacy">Seus dados são enviados somente para processar o pedido e o pagamento.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
