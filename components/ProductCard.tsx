'use client';

import { useSiteEnglish } from '@/lib/use-site-english';
import { cartEnglish } from '@/lib/cart-copy';
import Link from 'next/link';
import CartIcon from './CartIcon';
import Image from '@/components/ProductImage';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { getAttentionCoverImage } from '@/lib/merchandising';
import { shouldOfferFreeShipping } from '@/lib/shipping';
import { useCart } from '@/context/CartContext';
import { trackAddToCart, trackSelectItem } from '@/lib/marketing-analytics';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function productImageAlt(product: Product) {
  if (product.id === 'igreja-quadrado-p') return 'Igrejinha do Quadrado de Trancoso em cerâmica, tamanho P';
  if (product.id === 'igreja-quadrado-m') return 'Igrejinha do Quadrado de Trancoso em cerâmica, tamanho M';
  if (product.id === 'igreja-quadrado-gg') return 'Igreja do Quadrado de Trancoso em cerâmica, tamanho GG e versão luminária';
  if (product.id === 'igrejinha-luminaria-trancoso') return 'Igrejinha do Quadrado de Trancoso em cerâmica na versão luminária';
  if (product.id === 'ima-igrejinha-trancoso') return 'Ímã em cerâmica da Igrejinha do Quadrado de Trancoso';
  if (product.id === 'colar-igreja-quadrado') return 'Colar em cerâmica inspirado na Igrejinha do Quadrado de Trancoso';
  if (product.id === 'casal-pretos-velhos') return 'Casal de Pretos-Velhos em cerâmica artesanal da Agô Trancoso, Bahia';
  return product.imageAlt || `${product.name} em cerâmica disponível na Agô Trancoso`;
}

type ProductCardProps = { product: Product; priority?: boolean; listName?: string };

export default function ProductCard({ product, priority = false, listName = 'Coleção Agô' }: ProductCardProps) {
  const english = useSiteEnglish();
  const name = english ? (cartEnglish[product.name] ?? product.name) : product.name;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  const image = getAttentionCoverImage(product);
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const freeShipping = shouldOfferFreeShipping(price);
  const imageAlt = english ? `${name} — handmade ceramic by Agô Trancoso` : productImageAlt(product);
  const marketingItem = { item_id: product.id, item_name: product.name, price, quantity: 1, item_category: product.category };

  return (
    <article data-no-translate="true" className="product-card group" data-product-id={product.id}>
      <Link
        href={`${english ? "/en" : ""}/produtos/${product.id}`}
        className="product-card-main"
        onClick={() => trackSelectItem(marketingItem, listName)}
      >
        <div className="product-image-wrap">
          <Image src={image} alt={imageAlt} fill quality={100} priority={priority} sizes="(max-width: 900px) 46vw, (max-width: 1400px) 30vw, 424px" className="product-image product-image-primary" />
          {hasPromo && <span className="product-badge">{english ? 'Sale' : 'Oferta'}</span>}
          {!product.available && <span className="product-badge">{english ? 'Unavailable' : 'Indisponível'}</span>}
        </div>

        <div className="product-card-copy">
          <h2 className="product-name">{name}</h2>
          {hasPromo ? (
            <div className="price-row"><span className="old-price">{formatBRL(product.price)}</span><span className="current-price">{formatBRL(price)}</span></div>
          ) : <p className="current-price">{formatBRL(price)}</p>}
          <p className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#765e52]">
            {english ? 'Handmade ceramic' : 'Cerâmica artesanal'}{freeShipping ? (english ? ' · Free shipping in Brazil' : ' · Frete grátis no Brasil') : ''}
          </p>
        </div>
      </Link>

      {product.available && (
        <button
          type="button"
          onClick={() => {
            addItem(product.id);
            trackAddToCart(marketingItem);
            setAdded(true);
          }}
          className={`product-add ago-premium-add ago-bag-cta${added ? ' is-added' : ''}`}
          aria-live="polite"
          aria-label={added ? (english ? `${name} is in your bag` : `${name} está na sacola`) : (english ? `Add to bag: ${name}` : `Adicionar à sacola: ${name}`)}
        >
          <span className="ago-bag-cta-icon"><CartIcon size={18} withPlus={!added} /></span>
          <span>{english ? (added ? 'In bag' : 'Add to bag') : (added ? 'Na sacola' : 'Adicionar à sacola')}</span>
        </button>
      )}
    </article>
  );
}
