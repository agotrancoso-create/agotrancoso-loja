'use client';

import Link from 'next/link';
import PhotoLightbox from './PhotoLightbox';
import CartIcon from './CartIcon';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { trackAddToCart, trackViewItem } from '@/lib/marketing-analytics';
import styles from './ProductCardTouch.module.css';

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
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const image = product.images?.[0] || '/images/placeholder.svg';
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const hasGallery = (product.images?.length ?? 0) > 1;

  const trackView = () => trackViewItem({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category });

  return (
    <article className="product-card group" data-product-id={product.id}>
      <Link href={`/produtos/${product.id}`} className={`product-card-main ${styles.touchLink}`} onClick={trackView}>
        <div className={`product-image-wrap ${styles.touchSurface}`}>
          <Image
            src={image}
            alt={product.imageAlt || product.name}
            fill
            priority={priority}
            quality={86}
            sizes="(max-width: 350px) 92vw, (max-width: 767px) 45vw, (max-width: 1100px) 30vw, (max-width: 1440px) 23vw, 330px"
            className={`product-image product-image-primary ${styles.touchImage}`}
          />
          {hasPromo && <span className="product-badge">Oferta</span>}
          {!product.available && <span className="product-badge">Indisponível</span>}
          <span className={`product-view ${styles.touchCue}`} aria-hidden="true">Ver peça</span>
        </div>

        <div className="product-card-copy">
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
          className={`product-add ago-premium-add ago-bag-cta${added ? ' is-added' : ''}`}
          aria-live="polite"
          aria-label={added ? `${product.name} está na sacola` : `Levar ${product.name} para a sacola`}
        >
          <span className="ago-bag-cta-icon"><CartIcon size={18} withPlus={!added} /></span>
          <span>{added ? 'Na sacola' : 'Levar para a sacola'}</span>
        </button>
      )}
    </article>
  );
}
