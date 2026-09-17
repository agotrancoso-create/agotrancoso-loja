import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getEffectivePrice, getProductById } from '@/lib/products';
import { whatsappLink } from '@/lib/config';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import AddToCart from './AddToCart';
import ProductGallery from '@/components/ProductGallery';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProductById(params.id);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/produtos/${product.id}` },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const waMessage = `Olá! Vim pelo site da Agô Trancoso e tenho interesse em ${product.name}.`;
  const freeShippingAtProductQuantity = shouldOfferFreeShipping(price);

  return (
    <div className="product-page">
      <div className="product-page-shell">
        <Link href="/produtos" className="product-back">← Voltar à coleção</Link>
        <div className="product-page-grid">
          <div className="product-gallery-column">
            <ProductGallery name={product.name} images={images} />
          </div>
          <div className="product-info-column">
            <p className="eyebrow">Agô Trancoso</p>
            <h1 className="product-detail-title">{product.name}</h1>
            {hasPromo ? (
              <div className="price-detail-row"><span className="product-old-price">{formatBRL(product.price)}</span><span className="product-current-price">{formatBRL(price)}</span></div>
            ) : (<p className="product-current-price">{formatBRL(price)}</p>)}
            <p className="product-description">{product.description}</p>
            {product.dimensions && <p className="product-dimensions">Dimensões: {product.dimensions}</p>}
            <div className="product-shipping-note">
              {freeShippingAtProductQuantity ? 'Frete grátis nesta peça.' : <>Frete fixo de <strong>{formatBRL(FIXED_SHIPPING_PRICE)}</strong>.</>}
              <span>Compras acima de R$ 500 têm frete grátis.</span>
            </div>
            <div className="product-purchase"><AddToCart product={product} /></div>
            <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="product-whatsapp">Comprar pelo WhatsApp</a>
            <div className="product-trust-grid">
              <div><span>Feito à mão</span></div>
              <div><span>Peça especial</span></div>
              <div><span>Envio nacional</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
