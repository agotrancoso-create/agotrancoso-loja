import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProductById } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

const productIds = [
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
];

export const metadata: Metadata = {
  title: { absolute: 'Igrejinha de Trancoso em Cerâmica | Agô Trancoso' },
  description: 'Miniaturas e peças em cerâmica inspiradas na Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Conheça a coleção da Agô.',
  alternates: { canonical: '/igrejinha-de-trancoso' },
  openGraph: {
    title: 'Igrejinha de Trancoso em Cerâmica | Agô Trancoso',
    description: 'Miniaturas e peças em cerâmica inspiradas na Igreja do Quadrado de Trancoso, Bahia.',
    url: '/igrejinha-de-trancoso',
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Igrejinha de Trancoso em Cerâmica | Agô Trancoso',
    description: 'Peças inspiradas na Igreja do Quadrado, feitas pela Agô em Trancoso, Bahia.',
  },
};

export default function IgrejinhaDeTrancosoPage() {
  const products = productIds
    .map((id) => getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  const pageUrl = `${SITE_DOMAIN}/igrejinha-de-trancoso`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        url: pageUrl,
        name: 'Igrejinha de Trancoso em Cerâmica',
        description: 'Coleção de miniaturas e peças em cerâmica inspiradas na Igreja de São João Batista, conhecida como Igrejinha do Quadrado de Trancoso.',
        isPartOf: { '@id': `${SITE_DOMAIN}#website` },
        about: {
          '@type': 'Thing',
          name: 'Igreja de São João Batista de Trancoso',
          alternateName: ['Igrejinha de Trancoso', 'Igreja do Quadrado', 'Igrejinha do Quadrado'],
        },
        mainEntity: {
          '@type': 'ItemList',
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
          { '@type': 'ListItem', position: 2, name: 'Igrejinha de Trancoso', item: pageUrl },
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

        <header className="catalog-intro">
          <div>
            <p className="eyebrow">Quadrado de Trancoso</p>
            <h1>Igrejinha de Trancoso em cerâmica</h1>
          </div>
          <p>
            Miniaturas e peças inspiradas na Igreja de São João Batista, conhecida como Igreja do Quadrado ou Igrejinha de Trancoso. A coleção reúne diferentes formas de levar esse símbolo de Trancoso para casa.
          </p>
        </header>

        <div className="product-grid catalog-grid" aria-label="Peças inspiradas na Igrejinha de Trancoso">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 3} />
          ))}
        </div>
      </div>

      <section className="product-aftercare" aria-labelledby="igreja-quadrado-contexto">
        <div className="site-container product-aftercare-inner">
          <p className="eyebrow">Um símbolo do Quadrado</p>
          <h2 id="igreja-quadrado-contexto">A Igreja do Quadrado como inspiração.</h2>
          <p className="product-description">
            A Igreja de São João Batista é um dos marcos mais reconhecidos do Quadrado de Trancoso, na Bahia. Na Agô, sua fachada aparece em miniaturas, luminária, ímã e colar de cerâmica, sempre preservando a linguagem artesanal da marca.
          </p>
          <Link href="/produtos" className="text-link">Ver toda a coleção <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
