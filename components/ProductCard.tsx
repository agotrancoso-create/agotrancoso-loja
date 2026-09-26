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

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function productImageAlt(product: Product) {
  if (product.id === 'igreja-quadrado-p') return 'Igrejinha do Quadrado de Trancoso em cerâmica, tamanho P';
  if (product.id === 'igreja-quadrado-m') return 'Igrejinha do Quadrado de Trancoso em cerâmica, tamanho M';
  if (product.id === 'igreja-quadrado-gg') return 'Igreja do Quadrado de Trancoso em cerâmica, tamanho GG';
  if (product.id === 'igrejinha-luminaria-trancoso') return 'Igrejinha do Quadrado de Trancoso em cerâmica na versão luminária';
  if (product.id === 'ima-igrejinha-trancoso') return 'Ímã em cerâmica da Igrejinha do Quadrado de Trancoso';
  if (product.id === 'colar-igreja-quadrado') return 'Colar em cerâmica inspirado na Igrejinha do Quadrado de Trancoso';
  return product.imageAlt || `${product.name} em cerâmica disponível na Agô Trancoso`;
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
  const secondaryImage = product.images?.[1];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const hasGallery = (product.images?.length ?? 0) > 1;
  const imageAlt = productImageAlt(product);

  const trackView = () => trackViewItem({ item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category });

  return (
    <article className={`product-card group${secondaryImage ? ' has-secondary-image' : ''}`} data-product-id={product.id}>
      <Link href={`/produtos/${product.id}`} className="product-card-main" onClick={trackView}>
        <div className="product-image-wrap">
          <Image src={image} alt={imageAlt} fill quality={88} priority={priority} sizes="(max-width: 900px) 46vw, (max-width: 1400px) 30vw, 424px" className="product-image product-image-primary" />
          {secondaryImage && (
            <Image src={secondaryImage} alt="" fill quality={88} sizes="(max-width: 900px) 46vw, (max-width: 1400px) 30vw, 424px" className="product-image product-image-secondary" aria-hidden="true" />
          )}
          {hasPromo && <span className="product-badge">Oferta</span>}
          {!product.available && <span className="product-badge">Indisponível</span>}
          <span className="product-view" aria-hidden="true">Ver de perto</span>
        </div>

        <div className="product-card-copy">
          <h2 className="product-name">{product.name}</h2>
          {hasPromo ? (
            <div className="price-row"><span className="old-price">{formatBRL(product.price)}</span><span className="current-price">{formatBRL(price)}</span></div>
          ) : <p className="current-price">{formatBRL(price)}</p>}
        </div>
      </Link>

      {hasGallery && <button type="button" className="ago-card-photos" onClick={() => setShowPhotos(true)} aria-label={`Ver outras fotos de ${product.name}`}>Ver fotos</button>}
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
