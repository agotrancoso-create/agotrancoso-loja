import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getEffectivePrice, getProductById } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

const productIds = [
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
];

const churchProductIds = new Set([
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
]);

const preferredImage = '/produtos/igreja-quadrado-p.jpg';
const preferredImageAlt = 'Igrejinha do Quadrado de Trancoso em cerâmica disponível na Agô Trancoso';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const metadata: Metadata = {
  title: { absolute: 'Comprar Igrejinha de Trancoso em Cerâmica | Agô Trancoso' },
  description: 'Compre Igrejinha de Trancoso em cerâmica na Agô, no Quadrado de Trancoso. Miniaturas da Igreja de São João Batista, compra online e envio para todo o Brasil.',
  alternates: { canonical: '/igrejinha-de-trancoso' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Comprar Igrejinha de Trancoso em Cerâmica | Agô Trancoso',
    description: 'Igrejinhas do Quadrado em cerâmica, disponíveis para compra online e na Agô Trancoso, no Quadrado.',
    url: '/igrejinha-de-trancoso',
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: preferredImage, alt: preferredImageAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comprar Igrejinha de Trancoso em Cerâmica | Agô Trancoso',
    description: 'Miniaturas e peças em cerâmica inspiradas na Igreja do Quadrado, com compra online e envio para todo o Brasil.',
    images: [preferredImage],
  },
};

export default function IgrejinhaDeTrancosoPage() {
  const products = productIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  const churchProducts = products.filter((product) => churchProductIds.has(product.id));
  const startingPrice = churchProducts.length
    ? Math.min(...churchProducts.map((product) => getEffectivePrice(product)))
    : null;

  const pageUrl = `${SITE_DOMAIN}/igrejinha-de-trancoso`;
  const preferredImageUrl = `${SITE_DOMAIN}${preferredImage}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: 'Comprar Igrejinha de Trancoso em Cerâmica',
        alternateName: [
          'Igrejinha de Trancoso',
          'Igrejinha do Quadrado de Trancoso',
          'Igreja do Quadrado em cerâmica',
          'Miniatura da Igreja do Quadrado',
        ],
        description: 'Página da Agô Trancoso para comprar online miniaturas e peças em cerâmica inspiradas na Igreja de São João Batista, no Quadrado de Trancoso, Bahia.',
        isPartOf: { '@id': `${SITE_DOMAIN}#website` },
        publisher: { '@id': `${SITE_DOMAIN}#organization` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          contentUrl: preferredImageUrl,
          url: preferredImageUrl,
          caption: preferredImageAlt,
        },
        about: {
          '@type': 'Thing',
          name: 'Igreja de São João Batista de Trancoso',
          alternateName: ['Igrejinha de Trancoso', 'Igreja do Quadrado', 'Igrejinha do Quadrado'],
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_DOMAIN}/produtos/${product.id}`,
            name: product.name,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN },
          { '@type': 'ListItem', position: 2, name: 'Comprar Igrejinha de Trancoso', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="catalog-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="site-container catalog-shell">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Igrejinha de Trancoso</span>
        </nav>

        <header className="catalog-intro commerce-catalog-intro">
          <div>
            <p className="eyebrow">Quadrado de Trancoso</p>
            <h1>Igrejinha de Trancoso em cerâmica</h1>
          </div>
          <p>
            Escolha entre diferentes versões da Igrejinha do Quadrado, compre online e receba em qualquer lugar do Brasil.
          </p>
        </header>

        <div id="modelos-igrejinha" className="product-grid catalog-grid commerce-first-grid" aria-label="Igrejinhas de Trancoso e peças inspiradas na Igreja do Quadrado">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>

        <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="onde-comprar-igrejinha">
          <div>
            <p className="eyebrow">Compra online e no Quadrado</p>
            <h2 id="onde-comprar-igrejinha">Onde comprar uma Igrejinha de Trancoso?</h2>
          </div>
          <div className="catalog-buying-answer-copy">
            <p>
              A Agô Trancoso vende as igrejinhas em cerâmica online neste site e presencialmente no Quadrado de Trancoso, em Porto Seguro, Bahia. A loja está em Trancoso desde 2016.
            </p>
            <p>
              Há versões P, M e GG, além da Igrejinha Luminária. {startingPrice !== null ? `As igrejinhas em cerâmica disponíveis começam em ${formatBRL(startingPrice)}.` : ''} Também enviamos para todo o Brasil e fazemos cotação internacional sob consulta.
            </p>
            <div className="home-hero-actions">
              <Link href="/produtos" className="text-link">Ver toda a coleção <span aria-hidden="true">↗</span></Link>
              <Link href="/contato" className="text-link">Visitar a Agô no Quadrado <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>
      </div>

      <section className="product-aftercare" aria-labelledby="igreja-quadrado-contexto">
        <div className="site-container product-aftercare-inner">
          <p className="eyebrow">Um símbolo do Quadrado</p>
          <h2 id="igreja-quadrado-contexto">A Igreja de São João Batista como inspiração.</h2>
          <p className="product-description">
            A Igreja de São João Batista, conhecida como Igreja do Quadrado ou Igrejinha de Trancoso, é um dos marcos mais reconhecidos do centro histórico de Trancoso. As peças reunidas aqui levam essa fachada para miniaturas, luminária, ímã e colar de cerâmica.
          </p>
          <p className="product-description">
            Para quem procura uma lembrança de Trancoso, um presente ou uma peça de decoração, a compra pode ser feita diretamente pelo site. Quem estiver na vila também pode ver as peças presencialmente na Agô, no Quadrado de Trancoso.
          </p>
          <div className="home-hero-actions">
            <Link href="/contato" className="text-link">Como visitar a Agô <span aria-hidden="true">↗</span></Link>
            <Link href="/produtos" className="text-link">Ver toda a coleção <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
