'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

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
      <button type="button" onClick={() => addItem(product.id, quantity)} className="product-primary-cta">Adicionar ao carrinho</button>
    </div>
  );
}
