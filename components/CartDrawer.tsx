'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice } from '@/lib/products';
import CartIcon from './CartIcon';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCart();
  const lines = items.map((item) => { const product = getProductById(item.productId); return product ? { item, product } : null; }).filter(Boolean) as { item: { productId: string; quantity: number }; product: NonNullable<ReturnType<typeof getProductById>> }[];
  const subtotal = lines.reduce((sum, l) => sum + getEffectivePrice(l.product) * l.item.quantity, 0);
  const freeShipping = shouldOfferFreeShipping(subtotal);
  const shipping = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD + 0.01 - subtotal);

  return (
    <>
      {isDrawerOpen && <div className="fixed inset-0 bg-marrom/40 z-50 backdrop-blur-[1px]" onClick={closeDrawer} aria-hidden="true" />}
      <aside className={`cart-drawer fixed top-0 right-0 h-full w-full sm:w-[420px] bg-areia z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!isDrawerOpen}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-oliva/15">
          <div className="flex items-center gap-2 text-marrom"><CartIcon size={20} /><h2 className="font-serif text-lg">Seu carrinho</h2></div>
          <button onClick={closeDrawer} aria-label="Fechar carrinho" className="text-marrom hover:text-terracota"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="text-center mt-14"><p className="font-serif text-lg text-marrom mb-2">Seu carrinho está vazio.</p><p className="font-sans text-sm text-oliva mb-6">Explore nossa coleção e encontre uma peça para levar um pouco de Trancoso para sua casa.</p><Link href="/produtos" onClick={closeDrawer} className="inline-block border border-marrom/30 hover:border-terracota hover:text-terracota transition-colors text-marrom font-sans text-xs tracking-widest uppercase px-6 py-3">Ver coleção</Link></div>
          ) : (
            <ul className="space-y-5">{lines.map(({ item, product }) => (
              <li key={item.productId} className="flex gap-4">
                <div className="cart-product-image relative w-20 h-20 flex-shrink-0 bg-[#FCFBF8] rounded-[12px] overflow-hidden"><Image src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} fill sizes="80px" className="object-contain" /></div>
                <div className="flex-1"><h4 className="font-serif text-sm text-marrom">{product.name}</h4><p className="font-sans text-xs text-oliva mt-0.5">{formatBRL(getEffectivePrice(product))} / un.</p>
                  <div className="flex items-center gap-3 mt-2"><button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Diminuir quantidade" className="w-7 h-7 border border-oliva/30 text-marrom flex items-center justify-center text-sm hover:border-terracota hover:text-terracota">−</button><span className="font-sans text-sm text-marrom w-4 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Aumentar quantidade" className="w-7 h-7 border border-oliva/30 text-marrom flex items-center justify-center text-sm hover:border-terracota hover:text-terracota">+</button><button onClick={() => removeItem(item.productId)} aria-label="Remover item" className="ml-auto text-xs text-oliva hover:text-terracota underline">remover</button></div>
                </div>
                <div className="font-sans text-sm text-marrom self-start">{formatBRL(getEffectivePrice(product) * item.quantity)}</div>
              </li>
            ))}</ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-oliva/15 px-6 py-5 space-y-2">
            {!freeShipping ? <p className="text-xs text-oliva leading-5">Faltam <strong className="text-marrom">{formatBRL(remaining)}</strong> para o frete grátis.</p> : <p className="text-xs text-terracota leading-5">Você ganhou frete grátis neste pedido.</p>}
            <div className="flex justify-between font-sans text-sm text-marrom/80"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
            <div className="flex justify-between font-sans text-sm text-marrom/80"><span>Frete</span><span>{freeShipping ? 'Grátis' : formatBRL(FIXED_SHIPPING_PRICE)}</span></div>
            <div className="flex justify-between font-serif text-xl text-marrom pt-2 pb-4"><span>Total</span><span className="cart-total">{formatBRL(total)}</span></div>
            <Link href="/checkout" onClick={closeDrawer} className="block w-full text-center bg-terracota hover:bg-marrom transition-colors text-areia font-sans text-xs tracking-widest uppercase py-3">Finalizar compra</Link>
            <button onClick={closeDrawer} className="block w-full text-center border border-marrom/20 hover:border-terracota hover:text-terracota transition-colors text-marrom font-sans text-xs tracking-widest uppercase py-3 mt-2">Continuar comprando</button>
          </div>
        )}
      </aside>
    </>
  );
}
