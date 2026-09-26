'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

const FAVORITES_KEY = 'ago:favorites';

export default function SavedProducts({ products }: { products: Product[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
      if (Array.isArray(parsed)) setIds(parsed.filter((value): value is string => typeof value === 'string'));
    } catch {
      setIds([]);
    }
  }, []);

  const saved = ids
    .map((id) => productMap.get(id))
    .filter((product): product is Product => Boolean(product?.available))
    .slice(0, 4);

  if (!saved.length) return null;

  return (
    <section className="saved-products-section ago-reveal is-visible" aria-labelledby="saved-products-title">
      <div className="site-container">
        <div className="ago-premium-section-head">
          <div>
            <p className="eyebrow">Sua seleção</p>
            <h2 id="saved-products-title">Peças que você salvou.</h2>
          </div>
        </div>
        <div className="ago-premium-product-grid product-related-grid saved-products-grid">
          {saved.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
