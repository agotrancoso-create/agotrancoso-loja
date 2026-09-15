'use client';

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice } from '@/lib/products';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import type { CartItem, Product } from '@/lib/types';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type FormState = {
  name: string; email: string; phone: string; street: string; number: string;
  complement: string; neighborhood: string; city: string; state: string; zip: string;
};

export default function CheckoutPage() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ name:'', email:'', phone:'', street:'', number:'', complement:'', neighborhood:'', city:'', state:'', zip:'' });

  type Line = { item: CartItem; product: Product };
  const lines = useMemo<Line[]>(() => items.flatMap((item): Line[] => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  }), [items]);

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
    e.preventDefault();
    setError(null);
    if (!lines.length) { setError('Seu carrinho está vazio.'); return; }
    if (form.zip.replace(/\D/g, '').length !== 8) { setShippingError('Informe um CEP válido com 8 dígitos.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          items,
          shippingValue,
          shippingName: freeShipping ? 'Frete grátis' : 'Frete fixo',
          customer: { name:form.name, email:form.email, phone:form.phone, address:{ street:form.street, number:form.number, complement:form.complement, neighborhood:form.neighborhood, city:form.city, state:form.state, zip:form.zip } },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir esta etapa. Tente novamente.');
      setLoading(false);
    }
  }

  if (!lines.length) return <div className="max-w-content mx-auto px-5 py-24 text-center"><h1 className="font-serif text-3xl text-marrom">Seu carrinho está vazio.</h1></div>;

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-20 grid md:grid-cols-[1.1fr_.9fr] gap-10 md:gap-16">
      <div>
        <p className="eyebrow mb-3">Pedido</p>
        <h1 className="section-title mb-9">Finalizar compra</h1>
        <form onSubmit={submit} className="space-y-5 text-sm">
          <h2 className="font-serif text-2xl text-marrom pt-1">Seus dados</h2>
          <input required name="name" placeholder="Nome completo" value={form.name} onChange={change} className="input" />
          <div className="grid sm:grid-cols-2 gap-4">
            <input required type="email" name="email" placeholder="E-mail" value={form.email} onChange={change} className="input" />
            <input required name="phone" placeholder="Telefone / WhatsApp" value={form.phone} onChange={change} className="input" />
          </div>

          <h2 className="font-serif text-2xl text-marrom pt-6">Entrega</h2>
          <div>
            <label className="block text-[10px] uppercase tracking-[.15em] text-oliva mb-1">CEP</label>
            <input required name="zip" inputMode="numeric" placeholder="00000-000" value={form.zip} onChange={change} className="input" />
          </div>

          <div className="rounded-[12px] border border-terracota/20 bg-areia2/70 px-4 py-3 text-sm text-marrom">
            {freeShipping ? 'Frete grátis neste pedido.' : <>Frete fixo de <strong>R$ 39,90</strong>.</>}
            <span className="block text-xs text-oliva mt-1">Compras acima de R$ 500 têm frete grátis.</span>
          </div>

          {shippingError && <p className="text-sm text-red-700">{shippingError}</p>}

          <div className="grid grid-cols-[1fr_110px] gap-3"><input required name="street" placeholder="Rua" value={form.street} onChange={change} className="input" /><input required name="number" placeholder="Número" value={form.number} onChange={change} className="input" /></div>
          <input name="complement" placeholder="Complemento (opcional)" value={form.complement} onChange={change} className="input" />
          <input required name="neighborhood" placeholder="Bairro" value={form.neighborhood} onChange={change} className="input" />
          <div className="grid grid-cols-[1fr_80px] gap-3"><input required name="city" placeholder="Cidade" value={form.city} onChange={change} className="input" /><input required name="state" placeholder="UF" value={form.state} onChange={change} className="input" /></div>

          {error && <p className="text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="w-full rounded-sm bg-terracota hover:bg-marrom disabled:opacity-50 text-areia py-4 text-[11px] uppercase tracking-[.18em] transition-colors">{loading ? 'Preparando pagamento…' : 'Ir para o pagamento'}</button>
          <p className="text-xs text-oliva leading-6">Pagamento seguro pela InfinitePay. Frete fixo de R$ 39,90 ou grátis em compras acima de R$ 500.</p>
        </form>
      </div>

      <aside className="md:pl-10 md:border-l border-oliva/20 md:sticky md:top-28 self-start">
        <p className="eyebrow mb-3">Resumo</p>
        <h2 className="font-serif text-2xl text-marrom mb-7">Seu pedido</h2>
        <div className="space-y-4">
          {lines.map(({item,product}) => <div key={item.productId} className="flex justify-between gap-5 text-sm"><span className="text-marrom/80">{product.name} × {item.quantity}</span><span className="text-marrom whitespace-nowrap">{formatBRL(getEffectivePrice(product)*item.quantity)}</span></div>)}
        </div>
        <div className="border-t border-oliva/20 mt-8 pt-4 flex justify-between text-sm text-marrom"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
        <div className="pt-2 flex justify-between text-sm text-marrom"><span>Frete</span><span>{shippingValue === 0 ? 'Grátis' : formatBRL(shippingValue)}</span></div>
        <div className="border-t border-oliva/20 mt-4 pt-5 flex justify-between font-serif text-2xl text-marrom"><span>Total</span><span>{formatBRL(total)}</span></div>
      </aside>
    </div>
  );
}
