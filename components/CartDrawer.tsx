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
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {isDrawerOpen && <div className="cart-backdrop fixed inset-0 z-50" onClick={closeDrawer} aria-hidden="true" />}
      <aside className={`cart-drawer fixed top-0 right-0 h-full w-full sm:w-[460px] z-50 transform transition-transform duration-300 flex flex-col ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`} aria-hidden={!isDrawerOpen}>
        <div className="cart-header">
          <div className="cart-header-title"><CartIcon size={22} /><h2>Seu carrinho</h2></div>
          <button onClick={closeDrawer} aria-label="Fechar carrinho" className="cart-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
        </div>
        <div className="cart-body">
          {lines.length === 0 ? (
            <div className="cart-empty"><p>Seu carrinho está vazio.</p><span>Explore a coleção e encontre uma peça para levar um pouco de Trancoso para sua casa.</span><Link href="/produtos" onClick={closeDrawer}>Ver coleção</Link></div>
          ) : (
            <ul className="cart-items">
              {lines.map(({ item, product }) => (
                <li key={item.productId} className="cart-item">
                  <div className="cart-product-image"><Image src={product.images?.[0] || '/images/placeholder.svg'} alt={product.name} fill sizes="82px" className="object-contain" /></div>
                  <div className="cart-item-info">
                    <h4>{product.name}</h4>
                    <p>{formatBRL(getEffectivePrice(product))} / un.</p>
                    <div className="cart-item-controls">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Diminuir quantidade">−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Aumentar quantidade">+</button>
                      <button type="button" onClick={() => removeItem(item.productId)} aria-label="Remover item" className="cart-remove">Remover</button>
                    </div>
                  </div>
                  <div className="cart-item-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="cart-summary">
            <div className="cart-shipping-progress-block">
              {!freeShipping ? <p className="cart-shipping-message">Faltam <strong>{formatBRL(remaining)}</strong> para o frete grátis.</p> : <p className="cart-shipping-message is-free">Você ganhou frete grátis neste pedido.</p>}
              <div className="cart-shipping-progress" aria-hidden="true">
                <span style={{ width: Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100) + '%' }} />
              </div>
              <div className="cart-shipping-progress-labels"><span>Frete fixo R$ 39,90</span><span>Grátis a partir de R$ 500</span></div>
            </div>
            <div className="cart-summary-row"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
            <div className="cart-summary-row"><span>Frete</span><span>{freeShipping ? 'Grátis' : formatBRL(FIXED_SHIPPING_PRICE)}</span></div>
            <div className="cart-total-row"><span>Total</span><strong>{formatBRL(total)}</strong></div>
            <Link href="/checkout" onClick={closeDrawer} className="cart-checkout">Finalizar compra</Link>
            <button onClick={closeDrawer} className="cart-continue">Continuar comprando</button>
          </div>
        )}
      </aside>
    </>
  );
}
