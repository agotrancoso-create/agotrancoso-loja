'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { useCart } from '@/context/CartContext';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const image = product.images?.[0] || '/images/placeholder.svg';
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);

  return (
    <article className="product-card group">
      <Link href={`/produtos/${product.id}`} className="block">
        <div className="product-image-wrap">
          <Image
            src={image}
            alt={product.imageAlt || product.name}
            fill
            priority={priority}
            sizes="(max-width: 599px) 46vw, (max-width: 900px) 46vw, (max-width: 1200px) 30vw, 22vw"
            className="product-image"
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
        <button type="button" onClick={() => addItem(product.id)} className="product-add">
          Adicionar ao carrinho <span>+</span>
        </button>
      )}
    </article>
  );
}
