'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

const RECENT_KEY = 'ago:recent-products';

export default function RecentlyViewed({ products, currentProductId }: { products: Product[]; currentProductId?: string }) {
  const [ids, setIds] = useState<string[]>([]);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]');
      if (Array.isArray(parsed)) setIds(parsed.filter((value): value is string => typeof value === 'string'));
    } catch {
      setIds([]);
    }
  }, []);

  const recent = ids
    .filter((id) => id !== currentProductId)
    .map((id) => productMap.get(id))
    .filter((product): product is Product => Boolean(product?.available))
    .slice(0, 4);

  if (!recent.length) return null;

  return (
    <section className="recently-viewed-section ago-reveal is-visible" aria-labelledby="recently-viewed-title">
      <div className="site-container">
        <div className="ago-premium-section-head">
          <div>
            <p className="eyebrow">Sua navegação</p>
            <h2 id="recently-viewed-title">Vistos recentemente.</h2>
          </div>
        </div>
        <div className="ago-premium-product-grid product-related-grid recently-viewed-grid">
          {recent.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
