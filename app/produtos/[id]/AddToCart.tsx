'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { trackAddToCart } from '@/lib/marketing-analytics';
import CartIcon from '@/components/CartIcon';

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (!product.available) {
    return <div className="product-unavailable">Peça indisponível no momento</div>;
  }

  return (
    <div className="add-to-cart-control">
      <div className="quantity-control" aria-label="Quantidade">
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar quantidade">+</button>
      </div>
      <button
        type="button"
        onClick={() => {
          addItem(product.id, quantity);
          trackAddToCart({ item_id: product.id, item_name: product.name, price: product.promotionalPrice ?? product.price, quantity, item_category: product.category });
          setAdded(true);
        }}
        className={`product-primary-cta ago-bag-primary${added ? ' is-added' : ''}`}
        aria-live="polite"
        aria-label={added ? `${product.name} está na sacola` : `Levar ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'} de ${product.name} para a sacola`}
      >
        <span className="ago-bag-primary-icon"><CartIcon size={21} withPlus={!added} /></span>
        <span>{added ? 'Na sacola' : 'Levar para a sacola'}</span>
      </button>
    </div>
  );
}
