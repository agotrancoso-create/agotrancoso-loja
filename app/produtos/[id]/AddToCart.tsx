'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';

export default function AddToCart({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  if (!product.available) {
    return (
      <div className="mt-6 border border-oliva/30 text-oliva font-sans text-sm px-5 py-3 inline-block">
        Peça indisponível no momento
      </div>
    );
  }

  return (
    <div className="mt-6 flex items-center gap-4">
      <div className="flex items-center border border-oliva/30">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-9 h-9 flex items-center justify-center text-marrom hover:text-terracota"
          aria-label="Diminuir quantidade"
        >
          −
        </button>
        <span className="w-8 text-center font-sans text-sm">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="w-9 h-9 flex items-center justify-center text-marrom hover:text-terracota"
          aria-label="Aumentar quantidade"
        >
          +
        </button>
      </div>

      <button
        onClick={() => addItem(product.id, quantity)}
        className="bg-terracota hover:bg-marrom transition-colors text-areia font-sans text-sm tracking-wide px-8 py-3"
      >
        Adicionar ao carrinho
      </button>
    </div>
  );
}
