'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function pixPrice(value: number) {
  return Number((value * 0.97).toFixed(2));
}

function installmentPrice(value: number) {
  return Number((value / 3).toFixed(2));
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
  const pix = pixPrice(price);
  const installment = installmentPrice(price);

  return (
    <article className="product-card group" data-product-id={product.id}>
      <Link href={`/produtos/${product.id}`} className="block">
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
          <div className="product-price-info" aria-label={`Pagamento de ${product.name}`}>
            <div className="product-price-pix">
              <svg className="product-payment-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path fill="currentColor" d="M12 2.5 4.5 10 12 17.5 19.5 10 12 2.5Zm0 3.1L16.4 10 12 14.4 7.6 10 12 5.6Z"/>
                <path fill="currentColor" d="M7.4 14.5 10.3 17.4a2.4 2.4 0 0 0 3.4 0l2.9-2.9-1.7-1.7-2.9 2.9a.1.1 0 0 1-.2 0l-2.9-2.9-1.5 1.7Z"/>
              </svg>
              <span><strong>{formatBRL(pix)}</strong> no Pix</span>
            </div>
            <div className="product-price-card">
              <svg className="product-payment-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M3 9h18" fill="none" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M6.5 15h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span><strong>{formatBRL(price)}</strong> em até <strong>3x de {formatBRL(installment)}</strong> sem juros</span>
            </div>
          </div>
        </div>
      </Link>
      {product.available && (
        <button type="button" onClick={() => addItem(product.id)} className="product-add">
          Adicionar ao carrinho <span>+</span>
        </button>
      )}
    </article>
  );
}
