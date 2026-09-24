import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getEffectivePrice, getProductById } from '@/lib/products';
import { SITE_DOMAIN, whatsappLink } from '@/lib/config';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
import AddToCart from './AddToCart';
import ProductGallery from '@/components/ProductGallery';
import ProductViewTracker from '@/components/ProductViewTracker';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ id: product.id }));
}

function metadataImage(images: string[] | undefined) {
  return (images?.length ? images : ['/images/placeholder.svg']).map((image) => ({ url: image, alt: 'Peças da Agô Trancoso' }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = getProductById(params.id);
  if (!product) return {};
  return {
    title: { absolute: `${product.name} | Agô Trancoso` },
    description: product.description,
    alternates: { canonical: `/produtos/${product.id}` },
    openGraph: {
      title: `${product.name} | Agô Trancoso`,
      description: product.description,
      url: `/produtos/${product.id}`,
      siteName: 'Agô Trancoso',
      locale: 'pt_BR',
      type: 'website',
      images: metadataImage(product.images),
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const waMessage = `Olá! Vim pelo site da Agô Trancoso e tenho interesse em ${product.name}.`;
  const internationalMessage = `Olá! Gostaria de consultar o envio internacional de ${product.name}.`;
  const freeShippingAtProductQuantity = shouldOfferFreeShipping(price);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.map((image) => `${SITE_DOMAIN}${image}`),
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Agô Trancoso' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_DOMAIN}/produtos/${product.id}`,
      priceCurrency: 'BRL',
      price: price.toFixed(2),
      availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProductViewTracker product={product} />

      <div className="site-container product-page-shell">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/produtos">Coleção</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
        </nav>

        <div className="product-page-grid">
          <div className="product-gallery-column">
            <ProductGallery name={product.name} images={images} />
          </div>

          <div className="product-info-column">
            <div className="product-buybox">
              <p className="eyebrow">Cerâmica feita à mão</p>
              <h1 className="product-detail-title">{product.name}</h1>

              {hasPromo ? (
                <div className="price-detail-row">
                  <span className="product-old-price">{formatBRL(product.price)}</span>
                  <span className="product-current-price">{formatBRL(price)}</span>
                </div>
              ) : (
                <p className="product-current-price">{formatBRL(price)}</p>
              )}

              <p className="product-description">{product.description}</p>
              {product.dimensions && <p className="product-dimensions"><strong>Dimensões</strong><span>{product.dimensions}</span></p>}

              <div className="product-purchase"><AddToCart product={product} /></div>
              <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="product-whatsapp">Prefere comprar pelo WhatsApp? <span aria-hidden="true">↗</span></a>

              <div className="product-service-grid">
                <div><strong>Entrega no Brasil</strong><span>{freeShippingAtProductQuantity ? 'Frete grátis nesta peça.' : <>Frete fixo de {formatBRL(FIXED_SHIPPING_PRICE)}.</>}</span></div>
                <div><strong>Acima de R$ 500</strong><span>Frete grátis para pedidos nacionais.</span></div>
                <div><strong>Pagamento</strong><span>Ambiente de pagamento seguro pela InfinitePay.</span></div>
              </div>

              <div className="product-international-note">
                <p className="eyebrow">International shipping</p>
                <h2>Fora do Brasil?</h2>
                <p>Como o envio de cerâmica depende do destino e da embalagem de cada pedido, fazemos a cotação internacional manualmente, sem estimar peso ou medidas.</p>
                <a href={whatsappLink(internationalMessage)} target="_blank" rel="noopener noreferrer">Consultar envio <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="product-aftercare">
        <div className="site-container product-aftercare-inner">
          <p className="eyebrow">Continue explorando</p>
          <h2>Veja outras peças da coleção.</h2>
          <Link href="/produtos" className="text-link">Explorar coleção <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
