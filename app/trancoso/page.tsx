import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';

const pageUrl = `${SITE_DOMAIN}/trancoso`;

export const metadata: Metadata = {
  title: { absolute: 'Trancoso, Bahia | Cerâmica do Quadrado e Agô Trancoso' },
  description: 'Descubra Trancoso através da cerâmica da Agô, no Quadrado: miniaturas do Quadrado, igrejinhas de Trancoso, luminárias e peças artesanais com compra online.',
  alternates: { canonical: '/trancoso' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    title: 'Trancoso, Bahia | Agô Trancoso',
    description: 'Cerâmica inspirada no Quadrado de Trancoso, disponível online e na Agô, no centro histórico da vila.',
    url: '/trancoso',
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
    images: [
      { url: '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg', alt: 'Miniatura em cerâmica do Quadrado de Trancoso' },
      { url: '/produtos/catalogo/miniatura-quadrado-trancoso-6.webp', alt: 'Miniaturas coloridas do Quadrado de Trancoso em cerâmica' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trancoso, Bahia | Agô Trancoso',
    description: 'Peças em cerâmica inspiradas no Quadrado e na Igrejinha de Trancoso.',
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
        name: 'Trancoso, Bahia — cerâmica inspirada no Quadrado',
        description: 'Uma seleção de cerâmica da Agô inspirada em Trancoso, no Quadrado e na Igreja de São João Batista.',
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_DOMAIN}#website` },
        publisher: { '@id': `${SITE_DOMAIN}#organization` },
        about: [
          { '@type': 'Place', name: 'Trancoso', address: { '@type': 'PostalAddress', addressLocality: 'Trancoso', addressRegion: 'BA', addressCountry: 'BR' } },
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
    <main className="catalog-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="site-container catalog-shell">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Trancoso</span>
        </nav>

        <header className="catalog-intro commerce-catalog-intro">
          <div>
            <p className="eyebrow">Trancoso · Bahia · Brasil</p>
            <h1>Um pedaço do Quadrado para levar com você.</h1>
          </div>
          <p>A Agô está no Quadrado de Trancoso desde 2016. A coleção reúne cerâmicas inspiradas nas cores, na arquitetura e nos símbolos que fazem parte da vila.</p>
        </header>

        <section aria-labelledby="trancoso-pieces-title">
          <div className="ago-premium-section-head">
            <div><p className="eyebrow">Seleção de Trancoso</p><h2 id="trancoso-pieces-title">Peças que começam pelo lugar.</h2></div>
            <Link href="/produtos" className="ago-premium-text-link">Ver coleção completa <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="product-grid catalog-grid commerce-first-grid">
            {products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} listName="Trancoso" />)}
          </div>
        </section>

        <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="trancoso-quadrado-title">
          <div><p className="eyebrow">No coração da vila</p><h2 id="trancoso-quadrado-title">O Quadrado como inspiração.</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>Entre as referências da coleção estão o Quadrado de Trancoso e a Igreja de São João Batista, também conhecida como Igrejinha de Trancoso ou Igreja do Quadrado. Elas aparecem em miniaturas, luminárias e outras peças em cerâmica.</p>
            <p>Quem estiver em Trancoso pode conhecer as peças presencialmente no Quadrado. No Brasil, a compra também pode ser feita online pelo site.</p>
            <div className="home-hero-actions">
              <Link href="/igrejinha-de-trancoso" className="text-link">Ver Igrejinhas de Trancoso <span aria-hidden="true">↗</span></Link>
              <Link href="/contato" className="text-link">Visitar a Agô <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </section>

        <section className="catalog-buying-answer" aria-labelledby="visit-trancoso-international">
          <div><p className="eyebrow">For international visitors</p><h2 id="visit-trancoso-international">Visiting Trancoso?</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>Agô Trancoso is located at the historic Quadrado. Our ceramic collection is inspired by Trancoso, its colorful houses and the Church of São João Batista.</p>
            <p>International shipping can be quoted individually according to destination and packaging needs.</p>
            <Link href="/contato" className="text-link">Find Agô in Trancoso <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
