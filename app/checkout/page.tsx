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

  if (!lines.length) return <div className="max-w-content mx-auto px-5 py-24 text-center confirmation-page"><h1 className="font-serif text-3xl text-marrom">Seu carrinho está vazio.</h1></div>;

  return (
    <div className="checkout-page-text max-w-content mx-auto px-5 md:px-8">
      <div className="checkout-stepbar" aria-label="Etapas da compra">
        <div className="checkout-step is-active"><span>01</span>Dados</div><div className="checkout-step"><span>02</span>Revisão</div><div className="checkout-step"><span>03</span>Pagamento</div>
      </div>
      <div className="grid md:grid-cols-[1.1fr_.9fr] gap-10 md:gap-16 items-start">
        <div>
          <p className="eyebrow mb-3">Pedido</p><h1 className="section-title mb-9">Finalizar compra</h1>
          <form onSubmit={submit} className="space-y-5 text-sm">
            <div><h2 className="font-serif text-2xl text-marrom mb-5">Seus dados</h2>
              <div className="checkout-field"><label htmlFor="name" className="checkout-label">Nome completo</label><input id="name" required name="name" placeholder="Como devemos chamar você?" value={form.name} onChange={change} className="checkout-input" /></div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4"><div className="checkout-field"><label htmlFor="email" className="checkout-label">E-mail</label><input id="email" required type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={change} className="checkout-input" /></div><div className="checkout-field"><label htmlFor="phone" className="checkout-label">Telefone / WhatsApp</label><input id="phone" required name="phone" inputMode="tel" placeholder="(00) 00000-0000" value={form.phone} onChange={change} className="checkout-input" /></div></div>
            </div>

            <div className="pt-5"><h2 className="font-serif text-2xl text-marrom mb-5">Entrega</h2>
              <div className="checkout-field"><label htmlFor="zip" className="checkout-label">CEP</label><input id="zip" required name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={form.zip} onChange={change} className="checkout-input" /></div>
              <div className="checkout-shipping-note mt-4">{freeShipping ? 'Frete grátis neste pedido.' : <>Frete fixo de <strong>R$ 39,90</strong>.</>}<span className="block text-xs text-oliva mt-1">Compras acima de R$ 500 têm frete grátis.</span></div>
              {shippingError && <p className="text-sm text-red-700 mt-3" role="alert">{shippingError}</p>}
              <div className="grid grid-cols-[1fr_110px] gap-3 mt-4"><div className="checkout-field"><label htmlFor="street" className="checkout-label">Rua</label><input id="street" required name="street" autoComplete="street-address" placeholder="Rua / avenida" value={form.street} onChange={change} className="checkout-input" /></div><div className="checkout-field"><label htmlFor="number" className="checkout-label">Número</label><input id="number" required name="number" placeholder="Nº" value={form.number} onChange={change} className="checkout-input" /></div></div>
              <div className="checkout-field mt-4"><label htmlFor="complement" className="checkout-label">Complemento <span className="normal-case tracking-normal font-normal">(opcional)</span></label><input id="complement" name="complement" placeholder="Apartamento, casa, etc." value={form.complement} onChange={change} className="checkout-input" /></div>
              <div className="checkout-field mt-4"><label htmlFor="neighborhood" className="checkout-label">Bairro</label><input id="neighborhood" required name="neighborhood" value={form.neighborhood} onChange={change} className="checkout-input" /></div>
              <div className="grid grid-cols-[1fr_80px] gap-3 mt-4"><div className="checkout-field"><label htmlFor="city" className="checkout-label">Cidade</label><input id="city" required name="city" value={form.city} onChange={change} className="checkout-input" /></div><div className="checkout-field"><label htmlFor="state" className="checkout-label">UF</label><input id="state" required name="state" maxLength={2} placeholder="UF" value={form.state} onChange={change} className="checkout-input" /></div></div>
            </div>

            {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
            <button disabled={loading} type="submit" className="w-full text-[11px] uppercase tracking-[.18em] transition-colors">{loading ? 'Preparando pagamento…' : 'Ir para o pagamento'}</button>
            <p className="text-xs text-oliva leading-6">Pagamento seguro pela InfinitePay. Frete fixo de R$ 39,90 ou grátis em compras acima de R$ 500.</p>
          </form>
        </div>

        <aside className="checkout-summary md:sticky md:top-28 self-start" aria-label="Resumo do pedido">
          <p className="eyebrow mb-3">Resumo</p><h2 className="font-serif text-2xl text-marrom mb-7">Seu pedido</h2>
          <div className="space-y-5">
            {lines.map(({item,product}) => <div key={item.productId} className="checkout-summary-item flex items-center justify-between gap-4"><div className="flex items-center gap-3 min-w-0"><div className="checkout-product-image"><img src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} /></div><div className="min-w-0"><span className="checkout-product-name block">{product.name} × {item.quantity}</span><span className="checkout-product-price block mt-1">{formatBRL(getEffectivePrice(product))} / un.</span></div></div><span className="text-marrom whitespace-nowrap">{formatBRL(getEffectivePrice(product)*item.quantity)}</span></div>)}
          </div>
          <div className="border-t border-oliva/20 mt-8 pt-4 flex justify-between text-sm text-marrom"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
          <div className="pt-2 flex justify-between text-sm text-marrom"><span>Frete</span><span>{shippingValue === 0 ? 'Grátis' : formatBRL(shippingValue)}</span></div>
          <div className="border-t border-oliva/20 mt-4 pt-5 flex justify-between font-serif text-2xl text-marrom"><span>Total</span><span>{formatBRL(total)}</span></div>
          <p className="mt-5 pt-4 border-t border-oliva/10 text-xs text-oliva leading-5">Seus dados são enviados somente para processar o pedido e o pagamento.</p>
        </aside>
      </div>
    </div>
  );
}
