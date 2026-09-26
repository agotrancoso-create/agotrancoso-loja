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

const IGREJINHA_PRODUCT_IDS = new Set([
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
]);

const PRODUCT_SEO: Record<string, { title: string; description: string }> = {
  'igreja-quadrado-p': {
    title: 'Igrejinha de Trancoso em Cerâmica P | Agô Trancoso',
    description: 'Miniatura em cerâmica da Igrejinha de Trancoso, inspirada na Igreja de São João Batista do Quadrado. Feita à mão pela Agô em Trancoso, Bahia.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha de Trancoso em Cerâmica M | Agô Trancoso',
    description: 'Igrejinha de Trancoso em cerâmica tamanho M, inspirada na Igreja do Quadrado. Uma peça feita à mão pela Agô em Trancoso, Bahia.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado em Cerâmica GG | Agô Trancoso',
    description: 'Escultura em cerâmica da Igreja do Quadrado de Trancoso, a Igreja de São João Batista, modelada à mão pela Agô em Trancoso, Bahia.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha de Trancoso Luminária em Cerâmica | Agô Trancoso',
    description: 'Luminária de cerâmica inspirada na Igrejinha do Quadrado de Trancoso. Feita à mão e criada para receber vela LED ou vela pequena.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha de Trancoso em Cerâmica | Agô Trancoso',
    description: 'Ímã artesanal em cerâmica inspirado na Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Uma lembrança feita à mão na Bahia.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igreja do Quadrado de Trancoso | Agô Trancoso',
    description: 'Colar em cerâmica inspirado na Igreja do Quadrado de Trancoso. A fachada da Igrejinha de São João Batista em um acessório feito à mão.',
  },
};

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ id: product.id }));
}

function metadataImage(name: string, images: string[] | undefined) {
  return (images?.length ? images : ['/images/placeholder.svg']).map((image) => ({
    url: image,
    alt: `${name} — Agô Trancoso`,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const seo = PRODUCT_SEO[product.id] ?? {
    title: `${product.name} | Agô Trancoso`,
    description: product.description,
  };

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: `/produtos/${product.id}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/produtos/${product.id}`,
      siteName: 'Agô Trancoso',
      locale: 'pt_BR',
      type: 'website',
      images: metadataImage(product.name, product.images),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: product.images?.length ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const images = product.images?.length ? product.images : ['/images/placeholder.svg'];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const waMessage = `Olá! Vim pelo site da Agô Trancoso e tenho interesse em ${product.name}.`;
  const internationalMessage = `Olá! Gostaria de consultar o envio internacional de ${product.name}.`;
  const freeShippingAtProductQuantity = shouldOfferFreeShipping(price);
  const isIgrejinhaProduct = IGREJINHA_PRODUCT_IDS.has(product.id);
  const productUrl = `${SITE_DOMAIN}/produtos/${product.id}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: product.name,
        description: product.description,
        image: images.map((image) => `${SITE_DOMAIN}${image}`),
        sku: product.id,
        url: productUrl,
        mainEntityOfPage: productUrl,
        brand: { '@type': 'Brand', name: 'Agô Trancoso' },
        seller: { '@id': `${SITE_DOMAIN}#organization` },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'BRL',
          price: price.toFixed(2),
          availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${SITE_DOMAIN}#organization` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${productUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN },
          { '@type': 'ListItem', position: 2, name: 'Coleção', item: `${SITE_DOMAIN}/produtos` },
          ...(isIgrejinhaProduct
            ? [{ '@type': 'ListItem', position: 3, name: 'Igrejinha de Trancoso', item: `${SITE_DOMAIN}/igrejinha-de-trancoso` }]
            : []),
          {
            '@type': 'ListItem',
            position: isIgrejinhaProduct ? 4 : 3,
            name: product.name,
            item: productUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProductViewTracker product={product} />

      <div className="site-container product-page-shell">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/produtos">Coleção</Link>
          <span aria-hidden="true">/</span>
          {isIgrejinhaProduct && (
            <>
              <Link href="/igrejinha-de-trancoso">Igrejinha de Trancoso</Link>
              <span aria-hidden="true">/</span>
            </>
          )}
          <span aria-current="page">{product.name}</span>
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
          <h2>{isIgrejinhaProduct ? 'Veja outras peças da Igrejinha de Trancoso.' : 'Há mais para descobrir.'}</h2>
          <Link href={isIgrejinhaProduct ? '/igrejinha-de-trancoso' : '/produtos'} className="text-link">
            {isIgrejinhaProduct ? 'Ver todas as igrejinhas' : 'Ver todas as peças'} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
