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

function pixPrice(value: number) {
  return Number((value * 0.97).toFixed(2));
}

function installmentPrice(value: number) {
  return Number((value / 3).toFixed(2));
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) return {};
  return { title: `${product.name} | Agô Trancoso`, description: product.description };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const pix = pixPrice(price);
  const installment = installmentPrice(price);
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
            <div className="product-price-detail" aria-label={`Pagamento de ${product.name}`}>
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
              {hasPromo && <span className="product-detail-reference-price">De {formatBRL(product.price)}</span>}
            </div>
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
