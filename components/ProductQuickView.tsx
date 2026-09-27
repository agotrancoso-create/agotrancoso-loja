'use client';

import Image from '@/components/ProductImage';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/marketing-analytics';
import CartIcon from './CartIcon';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ProductQuickView({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const price = getEffectivePrice(product);

  useEffect(() => {
    const node = dialogRef.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  function go(index: number) {
    setActive((index + images.length) % images.length);
  }

  return (
    <dialog
      ref={dialogRef}
      className="ago-quick-view-dialog"
      aria-label={`Visualização rápida de ${product.name}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="ago-quick-view-shell">
        <button type="button" className="ago-quick-view-close" onClick={onClose} aria-label="Fechar visualização">✕</button>
        <div className="ago-quick-view-media">
          <div className="ago-quick-view-image">
            <Image src={images[active]} alt={`${product.name}, foto ${active + 1}`} fill quality={94} sizes="(max-width: 760px) 100vw, 52vw" />
          </div>
          {images.length > 1 && (
            <div className="ago-quick-view-controls" aria-label="Navegar pelas fotos">
              <button type="button" onClick={() => go(active - 1)} aria-label="Foto anterior">←</button>
              <span aria-live="polite">{active + 1} / {images.length}</span>
              <button type="button" onClick={() => go(active + 1)} aria-label="Próxima foto">→</button>
            </div>
          )}
        </div>
        <div className="ago-quick-view-copy">
          <p className="eyebrow">Visualização rápida</p>
          <h2>{product.name}</h2>
          <strong className="ago-quick-view-price">{formatBRL(price)}</strong>
          <p>{product.description}</p>
          <div className="ago-quick-view-actions">
            {product.available && (
              <button
                type="button"
                className={`product-primary-cta ago-bag-primary${added ? ' is-added' : ''}`}
                onClick={() => {
                  addItem(product.id);
                  trackAddToCart({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category });
                  setAdded(true);
                }}
                aria-live="polite"
              >
                <span className="ago-bag-primary-icon"><CartIcon size={20} withPlus={!added} /></span>
                <span>{added ? 'Na sacola' : 'Levar para a sacola'}</span>
              </button>
            )}
            <Link href={`/produtos/${product.id}`} onClick={onClose} className="ago-premium-text-link">Ver página da peça <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
