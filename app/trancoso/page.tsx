import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';

const pageUrl = `${SITE_DOMAIN}/trancoso`;

export const metadata: Metadata = {
  title: { absolute: 'Artesanato e Cerâmica em Trancoso, Bahia | Agô no Quadrado' },
  description: 'Conheça a Agô Trancoso no Quadrado: cerâmica artesanal, Igrejinhas de Trancoso, miniaturas, decoração e lembranças inspiradas na vila, com compra online.',
  alternates: { canonical: '/trancoso' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    title: 'Artesanato e Cerâmica em Trancoso, Bahia | Agô Trancoso',
    description: 'Cerâmica artesanal no Quadrado de Trancoso: peças inspiradas na vila, na Igrejinha e nas cores da Bahia.',
    url: '/trancoso',
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
    images: [
      { url: '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg', alt: 'Miniatura em cerâmica do Quadrado de Trancoso' },
      { url: '/produtos/catalogo/miniatura-quadrado-trancoso-6.webp', alt: 'Miniaturas coloridas do Quadrado de Trancoso em cerâmica artesanal' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artesanato e Cerâmica em Trancoso | Agô Trancoso',
    description: 'Peças em cerâmica artesanal inspiradas no Quadrado e na Igrejinha de Trancoso.',
    images: ['/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg'],
  },
};

export default function TrancosoPage() {
  const products = sortProductsByAttention(getAvailableProducts()).slice(0, 6);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: 'Artesanato e cerâmica em Trancoso, Bahia — Agô no Quadrado',
        description: 'Cerâmica artesanal da Agô em Trancoso, com peças inspiradas no Quadrado, na Igreja de São João Batista, na decoração e nas lembranças da vila.',
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_DOMAIN}#website` },
        publisher: { '@id': `${SITE_DOMAIN}#organization` },
        about: [
          { '@type': 'Place', name: 'Trancoso', address: { '@type': 'PostalAddress', addressLocality: 'Trancoso', addressRegion: 'BA', addressCountry: 'BR' } },
          { '@type': 'Thing', name: 'Artesanato em Trancoso' },
          { '@type': 'Thing', name: 'Cerâmica artesanal em Trancoso' },
          { '@type': 'Thing', name: 'Quadrado de Trancoso' },
          { '@type': 'Thing', name: 'Igreja de São João Batista de Trancoso', alternateName: ['Igrejinha de Trancoso', 'Igreja do Quadrado'] },
        ],
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: product.name,
            url: `${SITE_DOMAIN}/produtos/${product.id}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN },
          { '@type': 'ListItem', position: 2, name: 'Trancoso', item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="catalog-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="site-container catalog-shell">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Trancoso</span>
        </nav>

        <header className="catalog-intro commerce-catalog-intro">
          <div>
            <p className="eyebrow">Trancoso · Bahia · Brasil</p>
            <h1>Cerâmica artesanal no coração de Trancoso.</h1>
          </div>
          <p>A Agô está no Quadrado de Trancoso desde 2016. A coleção reúne artesanato em cerâmica inspirado nas cores, na arquitetura, na fé e nos símbolos que fazem parte da vila.</p>
        </header>

        <section aria-labelledby="trancoso-pieces-title">
          <div className="ago-premium-section-head">
            <div><p className="eyebrow">Artesanato em Trancoso</p><h2 id="trancoso-pieces-title">Peças que começam pelo lugar.</h2></div>
            <Link href="/produtos" className="ago-premium-text-link">Ver coleção completa <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="product-grid catalog-grid commerce-first-grid">
            {products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} listName="Trancoso" />)}
          </div>
        </section>

        <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="trancoso-quadrado-title">
          <div><p className="eyebrow">No coração da vila</p><h2 id="trancoso-quadrado-title">O Quadrado como inspiração.</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>Entre as referências da coleção estão o Quadrado de Trancoso e a Igreja de São João Batista, também conhecida como Igrejinha de Trancoso ou Igreja do Quadrado. Elas aparecem em miniaturas, luminárias, presentes e outras peças de cerâmica artesanal.</p>
            <p>Quem procura artesanato, decoração ou uma lembrança de Trancoso pode conhecer as peças presencialmente no Quadrado. Para outras cidades do Brasil, a coleção também está disponível para compra online.</p>
            <div className="home-hero-actions">
              <Link href="/igrejinha-de-trancoso" className="text-link">Ver Igrejinhas de Trancoso <span aria-hidden="true">↗</span></Link>
              <Link href="/artesanato-em-trancoso" className="text-link">Artesanato em Trancoso ↗</Link>
              <Link href="/lembrancas-de-trancoso" className="text-link">Presentes e lembranças ↗</Link>
              <Link href="/contato" className="text-link">Visitar a Agô <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className="catalog-buying-answer" aria-labelledby="visit-trancoso-international">
          <div><p className="eyebrow">For international visitors</p><h2 id="visit-trancoso-international">Visiting Trancoso?</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>Agô Trancoso is located at the historic Quadrado. Our handmade ceramic collection is inspired by Trancoso, its colorful houses and the Church of São João Batista.</p>
            <p>International shipping can be quoted individually according to destination and packaging needs.</p>
            <Link href="/contato" className="text-link">Find Agô in Trancoso <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
