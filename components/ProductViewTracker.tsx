'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { trackViewItem } from '@/lib/marketing-analytics';

const RECENT_KEY = 'ago:recent-products';

export default function ProductViewTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      price: getEffectivePrice(product),
      quantity: 1,
      item_category: product.category,
    });

    try {
      const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]');
      const current = Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
      const next = [product.id, ...current.filter((id) => id !== product.id)].slice(0, 12);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Browsing history is an enhancement only. Never block product viewing.
    }
  }, [product]);
  return null;
}
