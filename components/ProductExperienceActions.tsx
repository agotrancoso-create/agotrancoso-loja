'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { trackProductInteraction } from '@/lib/marketing-analytics';

const FAVORITES_KEY = 'ago:favorites';

function readFavorites(): string[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export default function ProductExperienceActions({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false);
  const [shareLabel, setShareLabel] = useState('Compartilhar');
  const price = getEffectivePrice(product);
  const analyticsItem = { item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category };

  useEffect(() => {
    setSaved(readFavorites().includes(product.id));
  }, [product.id]);

  function toggleSaved() {
    const current = readFavorites();
    const wasSaved = current.includes(product.id);
    const next = wasSaved
      ? current.filter((id) => id !== product.id)
      : [product.id, ...current].slice(0, 24);

    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    setSaved(next.includes(product.id));
    trackProductInteraction(wasSaved ? 'unsave_product' : 'save_product', analyticsItem);
  }

  async function shareProduct() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: `${product.name} · Agô Trancoso`, url });
        trackProductInteraction('share_product', analyticsItem);
        return;
      }
      await navigator.clipboard.writeText(url);
      trackProductInteraction('share_product', analyticsItem);
      setShareLabel('Link copiado');
      window.setTimeout(() => setShareLabel('Compartilhar'), 1800);
    } catch (error) {
      if ((error as DOMException)?.name === 'AbortError') return;
      setShareLabel('Copiar link');
    }
  }

  return (
    <div className="product-experience-actions" aria-label="Ações da peça">
      <button type="button" className={`product-experience-action${saved ? ' is-saved' : ''}`} onClick={toggleSaved} aria-pressed={saved}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-7.2-4.35-7.2-10.05A4.35 4.35 0 0 1 12 6.88a4.35 4.35 0 0 1 7.2 3.27C19.2 15.85 12 20.2 12 20.2Z" /></svg>
        <span>{saved ? 'Salvo' : 'Salvar'}</span>
      </button>
      <button type="button" className="product-experience-action" onClick={shareProduct}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.3"/><circle cx="6" cy="12" r="2.3"/><circle cx="18" cy="19" r="2.3"/><path d="m8 11 7.8-4.6M8 13l7.8 4.6"/></svg>
        <span>{shareLabel}</span>
      </button>
    </div>
  );
}
