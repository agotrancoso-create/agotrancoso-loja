'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getEffectivePrice } from '@/lib/products';
import type { Product } from '@/lib/types';
import { trackAddToCart } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function MobilePurchaseDock({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (!product.available) return null;

  const price = getEffectivePrice(product);

  return (
    <aside className="ago-mobile-purchase-dock" aria-label={`Compra rápida de ${product.name}`}>
      <div className="ago-mobile-purchase-copy">
        <span className="ago-mobile-purchase-kicker">Sua escolha</span>
        <strong>{formatBRL(price)}</strong>
      </div>
      <button
        type="button"
        className={`ago-mobile-purchase-button${added ? ' is-added' : ''}`}
        onClick={() => {
          addItem(product.id, 1);
          trackAddToCart({
            item_id: product.id,
            item_name: product.name,
            price,
            quantity: 1,
            item_category: product.category,
          });
          setAdded(true);
        }}
        aria-label={added ? `${product.name} está na sacola` : `Adicionar ${product.name} à sacola`}
      >
        {added ? 'Na sacola' : 'Adicionar à sacola'}
      </button>
    </aside>
  );
}
