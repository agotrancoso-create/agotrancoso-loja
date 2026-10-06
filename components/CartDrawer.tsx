'use client';

import Image from '@/components/ProductImage';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cartEnglish } from '@/lib/cart-copy';
import { useCart } from '@/context/CartContext';
import { getProductById, getEffectivePrice, getAvailableProducts } from '@/lib/products';
import { getAttentionCoverImage, sortProductsByAttention, getRelatedProductIds } from '@/lib/merchandising';
import CartIcon from './CartIcon';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping, FREE_SHIPPING_SUBTOTAL_MINIMUM } from '@/lib/shipping';
import { trackRemoveFromCart, trackAddToCart, trackSelectItem, trackViewCart } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CartDrawer() {
  const { international, setInternational, items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, addItem } = useCart();
  const pathname = usePathname();
  const [english, setEnglish] = useState(false);
  useEffect(() => {
    setEnglish(pathname === '/en' || pathname.startsWith('/en/') || document.cookie.split('; ').includes('ago_locale=en'));
  }, [pathname, isDrawerOpen]);
  const t = (text: string) => english ? (cartEnglish[text] ?? text) : text;
  const href = (path: string) => english ? `/en${path}` : path;
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const complementaryRef = useRef<HTMLDivElement>(null);
  const closeDrawerRef = useRef(closeDrawer);
  const viewCartRef = useRef('');

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
  const shipping = international ? null : freeShipping ? 0 : FIXED_SHIPPING_PRICE;
  const total = subtotal + (shipping ?? 0);
  const remaining = Math.max(0, Number((FREE_SHIPPING_SUBTOTAL_MINIMUM - subtotal).toFixed(2)));
  const progressTarget = FREE_SHIPPING_SUBTOTAL_MINIMUM;
  const progress = Math.min(100, (subtotal / progressTarget) * 100);
  const cartIds = new Set(lines.map(({ product }) => product.id));
  const cartMarketingItems = lines.map(({ item, product }) => ({
    item_id: product.id,
    item_name: product.name,
    price: getEffectivePrice(product),
    quantity: item.quantity,
    item_category: product.category,
  }));
  const cartSignature = cartMarketingItems.map(item => `${item.item_id}:${item.quantity}`).join('|');

  useEffect(() => {
    if (!isDrawerOpen) {
      viewCartRef.current = '';
      return;
    }
    if (!cartMarketingItems.length || viewCartRef.current === cartSignature) return;
    viewCartRef.current = cartSignature;
    trackViewCart(cartMarketingItems, total);
  }, [isDrawerOpen, cartSignature, total]);

  const relatedIds = new Set(lines.flatMap(({ product }) => getRelatedProductIds(product.id)));
  const complementary = lines.length === 0 ? [] : sortProductsByAttention(getAvailableProducts())
    .filter(product => !cartIds.has(product.id))
    .sort((a, b) => {
      const relatedDifference = Number(relatedIds.has(b.id)) - Number(relatedIds.has(a.id));
      if (relatedDifference) return relatedDifference;
      return 0;
    })
    .slice(0, 6);

  function scrollComplementary(direction: -1 | 1) {
    const node = complementaryRef.current;
    if (!node) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollBy({ left: direction * Math.max(180, node.clientWidth * .72), behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <>
      {isDrawerOpen && <div className="cart-backdrop fixed inset-0 z-50" onClick={closeDrawer} aria-hidden="true" />}
      <div
        data-no-translate="true"
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
            <div><h2 id="ago-cart-title">{t('Sua seleção')}</h2>{lines.length > 0 && <small>{t('Peças escolhidas por você.')}</small>}</div>
          </div>
          <button ref={closeRef} type="button" onClick={closeDrawer} aria-label={t('Fechar sacola')} className="cart-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="cart-body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <p>{t('Sua seleção está vazia.')}</p>
              <span>{t('Explore a coleção e encontre algo para levar ou presentear.')}</span>
              <Link href={href('/produtos')} onClick={closeDrawer}>{t('Continuar comprando')}</Link>
            </div>
          ) : (
            <ul className="cart-items">
              {lines.map(({ item, product }) => (
                <li key={item.productId} className="cart-item">
                  <div className="cart-product-image"><Image src={getAttentionCoverImage(product)} alt={t(product.name)} fill quality={100} sizes="82px" className="object-contain" /></div>
                  <div className="cart-item-info">
                    <h3>{t(product.name)}</h3>
                    <p>{formatBRL(getEffectivePrice(product))} {english ? '/ unit' : '/ un.'}</p>
                    <div className="cart-item-controls">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label={`${english ? 'Decrease quantity of' : 'Diminuir quantidade de'} ${t(product.name)}`}>−</button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label={`${english ? 'Increase quantity of' : 'Aumentar quantidade de'} ${t(product.name)}`}>+</button>
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.productId);
                          trackRemoveFromCart({ item_id: product.id, item_name: product.name, price: getEffectivePrice(product), quantity: item.quantity, item_category: product.category });
                        }}
                        aria-label={`${t('Remover')} ${t(product.name)}`}
                        className="cart-remove"
                      >{t('Remover')}</button>
                    </div>
                  </div>
                  <div className="cart-item-total">{formatBRL(getEffectivePrice(product) * item.quantity)}</div>
                </li>
              ))}
            </ul>
          )}

          {complementary.length > 0 && (
            <div className="cart-complementary" aria-label={t('Peças para acompanhar sua seleção')}>
              <div className="cart-complementary-head">
                <div><span>{t('Para acompanhar')}</span><small>{t('Destaques da coleção que combinam com sua seleção.')}</small></div>
                <div className="cart-complementary-nav" aria-label={t('Navegar pelas sugestões')}>
                  <button type="button" onClick={() => scrollComplementary(-1)} aria-label={t('Ver sugestões anteriores')}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg></button>
                  <button type="button" onClick={() => scrollComplementary(1)} aria-label={t('Ver próximas sugestões')}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg></button>
                </div>
              </div>
              <div ref={complementaryRef} className="cart-complementary-list" tabIndex={0} aria-label={t('Sugestões para acompanhar')}>
                {complementary.map((product) => {
                  const price = getEffectivePrice(product);
                  const item = { item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category };
                  return (
                    <article key={product.id} className="cart-complementary-item">
                      <Link href={href(`/produtos/${product.id}`)} onClick={() => { trackSelectItem(item, 'Sugestões da sacola'); closeDrawer(); }} className="cart-complementary-image" aria-label={`${english ? 'View' : 'Ver'} ${t(product.name)}`}>
                        <Image src={getAttentionCoverImage(product)} alt={t(product.name)} fill quality={100} sizes="(max-width: 600px) 44vw, 190px" className="object-contain" />
                      </Link>
                      <div className="cart-complementary-info">
                        <Link href={href(`/produtos/${product.id}`)} onClick={() => { trackSelectItem(item, 'Sugestões da sacola'); closeDrawer(); }}><strong>{t(product.name)}</strong></Link>
                        <span>{formatBRL(price)}</span>
                        {!international && !freeShipping && shouldOfferFreeShipping(subtotal + price) && <small>{t('Com esta peça, seu pedido ganha frete grátis.')}</small>}
                      </div>
                      <button
                        type="button"
                        className="cart-complementary-add"
                        onClick={() => { addItem(product.id); trackAddToCart(item); }}
                        aria-label={english ? `Add ${t(product.name)} to bag` : `Levar ${product.name} para a sacola`}
                      ><CartIcon size={18} withPlus /></button>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="cart-summary">
            <label className="cart-summary-row">{english ? 'Delivery destination' : 'Destino da entrega'}
              <select className="min-w-0 rounded-lg border border-current bg-transparent px-2 py-2 text-base" aria-label={english ? 'Delivery destination' : 'Destino da entrega'} value={international ? 'international' : 'brazil'} onChange={event => setInternational(event.target.value === 'international')}>
                <option value="brazil">{english ? 'Brazil' : 'Brasil'}</option><option value="international">{english ? 'Outside Brazil' : 'Fora do Brasil'}</option>
              </select>
            </label>
            {!international && <div className="cart-shipping-progress-block">
              {!freeShipping ? <p className="cart-shipping-message">{english ? 'Add ' : 'Faltam '}<strong>{formatBRL(remaining)}</strong>{english ? ' more for free shipping.' : ' para o frete grátis.'}</p> : <p className="cart-shipping-message is-free">{t('Você ganhou frete grátis neste pedido.')}</p>}
              <div className="cart-shipping-progress" aria-hidden="true"><span style={{ width: progress + '%' }} /></div>
              <div className="cart-shipping-progress-labels"><span>{t('Frete fixo R$ 39,90')}</span><span>{t('Grátis a partir de R$ 500 em produtos')}</span></div>
            </div>}
            <div className="cart-summary-row"><span>{t('Subtotal')}</span><span>{formatBRL(subtotal)}</span></div>
            <div className="cart-summary-row"><span>{t('Frete')}</span><span>{international ? (english ? 'Quoted separately' : 'Sob consulta') : freeShipping ? t('Grátis') : formatBRL(FIXED_SHIPPING_PRICE)}</span></div>
            <div className="cart-total-row"><span>{international ? (english ? 'Products total' : 'Total das peças') : t('Total')}</span><strong>{formatBRL(total)}</strong></div>
            <Link href={href(international ? '/envio-internacional' : '/checkout')} onClick={closeDrawer} className="cart-checkout">{international ? (english ? 'Request shipping quote' : 'Consultar frete') : t('Finalizar pedido')}</Link>
            <p className="cart-checkout-reassurance">{international ? (english ? 'Shipping and final total confirmed before payment.' : 'Frete e total final confirmados antes do pagamento.') : t('Sem criar conta · Pagamento pela InfinitePay')}</p>
            <button type="button" onClick={closeDrawer} className="cart-continue">{t('Continuar escolhendo')}</button>
          </div>
        )}
      </div>
    </>
  );
}
