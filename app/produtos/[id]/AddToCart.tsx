'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { trackAddToCart } from '@/lib/marketing-analytics';
import CartIcon from '@/components/CartIcon';
import { getEffectivePrice } from '@/lib/products';
import { getShippingPrice } from '@/lib/shipping';
import Link from 'next/link';

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

  const selectionSubtotal = getEffectivePrice(product) * quantity;
  const shipping = getShippingPrice(selectionSubtotal);
  const formatBRL = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="purchase-selection">
    <div className="add-to-cart-control">
      <div className="quantity-control" aria-label="Quantidade">
        <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">−</button>
        <span aria-live="polite">{quantity}</span>
        <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))} disabled={quantity >= 99} aria-label="Aumentar quantidade">+</button>
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
    <div className="purchase-selection-summary" aria-live="polite" aria-atomic="true">
      <span>{quantity} {quantity === 1 ? 'peça' : 'peças'}: {formatBRL(selectionSubtotal)} · {shipping === 0 ? 'Frete grátis' : `Frete: ${formatBRL(shipping)}`}</span>
      <strong>Esta seleção com frete: {formatBRL(selectionSubtotal + shipping)}</strong>
      <small>Entrega no Brasil. O total da sacola é atualizado ao adicionar outras peças.</small>
    </div>
    <p className="purchase-selection-help">Compra sem cadastro · Pagamento pela InfinitePay</p>
    <Link href="/contato" className="text-link">Consultar prazo de entrega</Link>
    </div>
  );
}
