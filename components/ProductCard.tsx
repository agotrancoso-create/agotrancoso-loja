'use client';

import Link from 'next/link';
import PhotoLightbox from './PhotoLightbox';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { trackAddToCart, trackViewItem } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type ProductCardProps = { product: Product; priority?: boolean };

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(timer);
  }, [added]);

  const image = product.images?.[0] || '/images/placeholder.svg';
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const hasGallery = (product.images?.length ?? 0) > 1;

  const trackView = () => trackViewItem({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category });

  return (
    <article className="product-card group" data-product-id={product.id}>
      <Link href={`/produtos/${product.id}`} className="block" onClick={trackView}>
        <div className="product-image-wrap">
          <Image src={image} alt={product.imageAlt || product.name} fill priority={priority} sizes="(max-width: 420px) 44vw, (max-width: 767px) 45vw, (max-width: 1100px) 44vw, (max-width: 1440px) 23vw, 330px" className="product-image product-image-primary" />
          {product.images?.[1] && <Image src={product.images[1]} alt="" fill sizes="(max-width: 420px) 44vw, (max-width: 767px) 45vw, (max-width: 1100px) 44vw, (max-width: 1440px) 23vw, 330px" className="product-image-secondary" aria-hidden="true" />}
          {hasPromo && <span className="product-badge">Oferta</span>}
          {!product.available && <span className="product-badge">Indisponível</span>}
          <span className="product-view">Ver peça</span>
        </div>

        <div className="mt-4 pr-1">
          <h3 className="product-name">{product.name}</h3>
          {hasPromo ? (
            <div className="price-row"><span className="old-price">{formatBRL(product.price)}</span><span className="current-price">{formatBRL(price)}</span></div>
          ) : <p className="current-price">{formatBRL(price)}</p>}
        </div>
      </Link>

      {hasGallery && <button type="button" className="ago-card-photos" onClick={() => setShowPhotos(true)} aria-label={`Ver fotos de ${product.name}`}>Ver fotos</button>}
      {showPhotos && <PhotoLightbox name={product.name} images={product.images?.length ? product.images : [image]} onClose={() => setShowPhotos(false)} />}

      {product.available && (
        <button
          type="button"
          onClick={() => {
            addItem(product.id);
            trackAddToCart({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category });
            setAdded(true);
          }}
          className={`product-add ago-premium-add${added ? ' is-added' : ''}`}
          aria-live="polite"
          aria-label={added ? `${product.name} adicionado à sacola` : `Adicionar ${product.name} à sacola`}
        >
          {added ? 'Adicionado ✓' : 'Adicionar à sacola'}
        </button>
      )}
    </article>
  );
}
