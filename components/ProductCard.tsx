'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { trackAddToCart, trackViewItem } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type ProductCardProps = { product: Product; priority?: boolean };

const photoScales: Record<string, number> = {
  'igreja-quadrado-p': 1.05,
  'igreja-quadrado-m': 1.06,
  'igreja-quadrado-gg': 1.04,
  'igrejinha-luminaria-trancoso': 1.08,
  'casinha-luminaria': 1.07,
  'miniatura-quadrado-trancoso': 1.06,
  'cruzeiro-do-quadrado': 1.08,
  'mobile-trancoso': 1.05,
  'estatueta-iemanja': 1.06,
  'nossa-senhora-grande': 1.05,
  'presepio-em-ceramica': 1.05,
  'casal-pretos-velhos': 1.06,
  'nossa-senhora-aparecida': 1.06,
  'divino-espirito-santo': 1.07,
  'terco-em-ceramica': 1.07,
  'rosario-trancoso': 1.06,
  'esfera-decorativa': 1.07,
  'colar-igreja-quadrado': 1.06,
  'ima-igrejinha-trancoso': 1.07,
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(timer);
  }, [added]);

  const image = product.images?.[0] || '/images/placeholder.svg';
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const photoScale = photoScales[product.id] ?? 1.05;

  const trackView = () => trackViewItem({
    item_id: product.id,
    item_name: product.name,
    price,
    quantity: 1,
    item_category: product.category,
  });

  return (
    <article className="product-card" data-product-id={product.id}>
      <Link href={`/produtos/${product.id}`} className="product-card-link" onClick={trackView}>
        <div className="product-image-wrap">
          <Image
            src={image}
            alt={product.imageAlt || product.name}
            fill
            priority={priority}
            sizes="(max-width: 430px) 47vw, (max-width: 900px) 48vw, (max-width: 1200px) 32vw, 430px"
            className="product-image product-image-primary"
            style={{ '--product-photo-scale': photoScale } as CSSProperties}
          />
          {product.images?.[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 430px) 47vw, (max-width: 900px) 48vw, (max-width: 1200px) 32vw, 430px"
              className="product-image product-image-secondary"
              aria-hidden="true"
            />
          )}
          {hasPromo && <span className="product-badge">Preço especial</span>}
          {!product.available && <span className="product-badge">Indisponível</span>}
        </div>

        <div className="product-card-copy">
          <h3 className="product-name">{product.name}</h3>
          {hasPromo ? (
            <div className="price-row">
              <span className="old-price">{formatBRL(product.price)}</span>
              <span className="current-price">{formatBRL(price)}</span>
            </div>
          ) : (
            <p className="current-price">{formatBRL(price)}</p>
          )}
        </div>
      </Link>

      {product.available && (
        <button
          type="button"
          onClick={() => {
            addItem(product.id);
            trackAddToCart({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category });
            setAdded(true);
          }}
          className={`product-add${added ? ' is-added' : ''}`}
          aria-live="polite"
          aria-label={added ? `${product.name} adicionado à sacola` : `Adicionar ${product.name} à sacola`}
        >
          <span>{added ? 'Na sacola' : 'Adicionar'}</span>
          <span aria-hidden="true">{added ? '✓' : '+'}</span>
        </button>
      )}
    </article>
  );
}
