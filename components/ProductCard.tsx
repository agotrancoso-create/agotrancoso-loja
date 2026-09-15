'use client';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';

function formatBRL(value: number) { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

const imageScales: Record<string, number> = {
  'igreja-quadrado-p': 1.34, 'igreja-quadrado-m': 1.22, 'igreja-quadrado-gg': 1.10,
  'igrejinha-luminaria-trancoso': 1.30, 'casinha-luminaria': 1.25, 'miniatura-quadrado-trancoso': 1.18,
  'cruzeiro-do-quadrado': 1.25, 'mobile-trancoso': 1.12, 'estatueta-iemanja': 1.18,
  'nossa-senhora-grande': 1.20, 'presepio-em-ceramica': 1.18, 'casal-pretos-velhos': 1.18,
  'nossa-senhora-aparecida': 1.18, 'divino-espirito-santo': 1.25, 'terco-em-ceramica': 1.20,
  'rosario-trancoso': 1.16, 'esfera-decorativa': 1.22, 'colar-igreja-quadrado': 1.16, 'ima-igrejinha-trancoso': 1.32,
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const image = product.images?.[0] || '/images/placeholder.svg';
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const imageScale = imageScales[product.id] ?? 1.22;

  return (
    <article className="product-card group">
      <Link href={`/produtos/${product.id}`} className="block">
        <div className="product-image-wrap">
          <img src={image} alt={product.name} className="product-image" style={{ '--image-scale': imageScale } as React.CSSProperties} loading="lazy" decoding="async" />
          {hasPromo && <span className="product-badge">Oferta</span>}
          {!product.available && <span className="product-badge">Indisponível</span>}
          <span className="product-view">Ver peça</span>
        </div>
        <div className="mt-4 pr-1">
          <h3 className="product-name">{product.name}</h3>
          {hasPromo ? <div className="price-row"><span className="old-price">{formatBRL(product.price)}</span><span className="current-price">{formatBRL(price)}</span></div> : <p className="current-price">{formatBRL(price)}</p>}
        </div>
      </Link>
      {product.available && <button type="button" onClick={() => addItem(product.id)} className="product-add">Adicionar ao carrinho <span>+</span></button>}
    </article>
  );
}
