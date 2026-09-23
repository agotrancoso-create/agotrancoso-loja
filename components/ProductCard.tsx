'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { trackAddToCart, trackViewItem } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

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
  const image = product.images?.[0] || '/images/placeholder.svg';
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const photoScale = photoScales[product.id] ?? 1.05;

  return (
    <article className="product-card group" data-product-id={product.id}>
      <Link href={`/produtos/${product.id}`} className="block" onClick={() => trackViewItem({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category })}>
        <div className="product-image-wrap">
          <Image
            src={image}
            alt={product.imageAlt || product.name}
            fill
            priority={priority}
            sizes="(max-width: 420px) 44vw, (max-width: 767px) 45vw, (max-width: 1100px) 44vw, (max-width: 1440px) 23vw, 330px"
            className="product-image"
            style={{ '--product-photo-scale': photoScale } as CSSProperties}
          />
          {hasPromo && <span className="product-badge">Oferta</span>}
          {!product.available && <span className="product-badge">Indisponível</span>}
          <span className="product-view">Ver peça</span>
        </div>
        <div className="mt-4 pr-1">
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
        <button type="button" onClick={() => { addItem(product.id); trackAddToCart({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category }); }} className="product-add ago-premium-add" aria-label={`Adicionar ${product.name} ao carrinho`}>
          Adicionar ao carrinho
        </button>
      )}
    </article>
  );
}
