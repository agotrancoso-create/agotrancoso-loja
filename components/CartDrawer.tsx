'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice, getAvailableProducts } from '@/lib/products';
import CartIcon from './CartIcon';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';
import { trackRemoveFromCart, trackAddToCart } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, addItem } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeDrawerRef = useRef(closeDrawer);

  useEffect(() => { closeDrawerRef.current = closeDrawer; }, [closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = Array.from(document.querySelectorAll<HTMLElement>('.site-header, main, .site-footer, .ago-topbar, .ago-social-floaters')).filter(node => !node.hasAttribute('inert'));
    background.forEach(node => node.setAttribute('inert', ''));
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawerRef.current();
      if (event.key === 'Tab') {
        const controls = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]') ?? [])
          .filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || !drawerRef.current?.contains(document.activeElement))) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !drawerRef.current?.contains(document.activeElement))) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach(node => node.removeAttribute('inert'));
      window.removeEventListener('keydown', handleKeyDown);
      if (previousActive?.isConnected) previousActive.focus({ preventScroll: true });
    };
  }, [isDrawerOpen]);

  const lines = items
    .map((item) => {
      const product = getProductById(item.productId);
      return product?.available ? { item, product } : null;
    })
    .filter(Boolean) as { item: { productId: string; quantity: number }; product: NonNullable<ReturnType<typeof getProductById>> }[];

  const subtotal = lines.reduce((sum, line) => sum + getEffectivePrice(line.product) * line.item.quantity, 0);
  const freeShipping = shouldOfferFreeShipping(subtotal);
  const shipping = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = subtotal + shipping;
  const remaining = Math.max(0, (FREE_SHIPPING_THRESHOLD + 0.01) - subtotal);
  const progressTarget = FREE_SHIPPING_THRESHOLD + 0.01;
  const progress = Math.min(100, (subtotal / progressTarget) * 100);
  const cartIds = new Set(lines.map(({ product }) => product.id));
  const complementary = getAvailableProducts()
    .filter((product) => !cartIds.has(product.id) && getEffectivePrice(product) <= 500)
    .slice(0, 2);

  return (
    <>
      {isDrawerOpen && <div className="cart-backdrop fixed inset-0 z-50" onClick={closeDrawer} aria-hidden="true" />}
      <div
        ref={drawerRef}
        className={`cart-drawer fixed top-0 right-0 h-full w-full sm:w-[460px] z-50 transform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!isDrawerOpen}
        aria-labelledby="ago-cart-title"
        role="dialog"
        aria-modal={isDrawerOpen ? true : undefined}
      >
        <div className="cart-header">
          <div className="cart-header-title">
            <CartIcon size={22} />
            <h2 id="ago-cart-title">Sua seleção</h2>
          </div>
          <button ref={closeRef} type="button" onClick={closeDrawer} aria-label="Fechar sacola" className="cart-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <p>Sua seleção está vazia.</p>
              <span>Escolha uma peça para levar um pouco de Trancoso para sua casa.</span>
              <Link href="/produtos" onClick={closeDrawer}>Continuar comprando</Link>
            </div>
          ) : (
            <ul className="cart-items">
              {lines.map(({ item, product }) => (
                <li key={item.productId} className="cart-item">
                  <div className="cart-product-image">
                    <Image
                      src={product.images?.[0] || '/images/placeholder.svg'}
                      alt={product.name}
                      fill
                      sizes="82px"
                      className="object-contain"
                    />
                  </div>

                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p>{formatBRL(getEffectivePrice(product))} / un.</p>
                    <div className="cart-item-controls">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label={`Diminuir quantidade de ${product.name}`}>−</button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label={`Aumentar quantidade de ${product.name}`}>+</button>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.productId);
                          trackRemoveFromCart({
                            item_id: product.id,
                            item_name: product.name,
                            price: getEffectivePrice(product),
                            quantity: item.quantity,
                            item_category: product.category,
                          });
                        }}
                        aria-label={`Remover ${product.name}`}
                        className="cart-remove"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</div>
                </li>
              ))}
            </ul>
          )}
            {complementary.length > 0 && (
              <div className="cart-complementary" aria-label="Peças que podem acompanhar sua seleção">
                <div className="cart-complementary-head">
                  <span>Para acompanhar</span>
                  <small>Mais uma peça, mais um pouco de Trancoso.</small>
                </div>
                <div className="cart-complementary-list">
                  {complementary.map((product) => (
                    <article key={product.id} className="cart-complementary-item">
                      <Link href={`/produtos/${product.id}`} onClick={closeDrawer} className="cart-complementary-image" aria-label={`Ver ${product.name}`}>
                        <Image
                          src={product.images?.[0] || '/images/placeholder.svg'}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </Link>
                      <div className="cart-complementary-info">
                        <Link href={`/produtos/${product.id}`} onClick={closeDrawer}>
                          <strong>{product.name}</strong>
                        </Link>
                        <span>{formatBRL(getEffectivePrice(product))}</span>
                      </div>
                      <button
                        type="button"
                        className="cart-complementary-add"
                        onClick={() => {
                          const price = getEffectivePrice(product);
                          addItem(product.id);
                          trackAddToCart({
                            item_id: product.id,
                            item_name: product.name,
                            price,
                            quantity: 1,
                            item_category: product.category,
                          });
                        }}
                        aria-label={`Levar ${product.name} para a sacola`}
                      >
                        <CartIcon size={18} withPlus />
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}
        </div>

        {lines.length > 0 && (
          <div className="cart-summary">
            <div className="cart-shipping-progress-block">
              {!freeShipping ? (
                <p className="cart-shipping-message">
                  Faltam <strong>{formatBRL(remaining)}</strong> para o frete grátis.
                </p>
              ) : (
                <p className="cart-shipping-message is-free">Você ganhou frete grátis neste pedido.</p>
              )}
              <div className="cart-shipping-progress" aria-hidden="true">
                <span style={{ width: progress + '%' }} />
              </div>
              <div className="cart-shipping-progress-labels">
                <span>Frete fixo R$ 39,90</span>
                <span>Grátis acima de R$ 500</span>
              </div>
            </div>
            <div className="cart-summary-row"><span>Subtotal</span><span>{formatBRL(subtotal)}</span></div>
            <div className="cart-summary-row"><span>Frete</span><span>{freeShipping ? 'Grátis' : formatBRL(FIXED_SHIPPING_PRICE)}</span></div>
            <div className="cart-total-row"><span>Total</span><strong>{formatBRL(total)}</strong></div>
            <Link href="/checkout" onClick={closeDrawer} className="cart-checkout">Finalizar pedido</Link>
            <button type="button" onClick={closeDrawer} className="cart-continue">Continuar comprando</button>
          </div>
        )}
      </div>
    </>
  );
}
