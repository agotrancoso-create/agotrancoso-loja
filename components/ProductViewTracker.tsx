'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { trackViewItem } from '@/lib/marketing-analytics';

export default function ProductViewTracker({ product }: { product: Product }) {
  useEffect(() => {
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      price: getEffectivePrice(product),
      quantity: 1,
      item_category: product.category,
    });
  }, [product]);
  return null;
}
