import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

const path = '/luminarias-em-ceramica';
const title = 'Luminárias em Cerâmica: Casinhas e Igrejinhas | Agô Trancoso';
const description = 'Descubra luminárias de cerâmica em formato de casinha e igreja do Quadrado de Trancoso. Fotos reais, preços e compra online na Agô Trancoso.';
const cover = '/produtos/casinha-luminaria.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    title, description, url: path, type: 'website',
    images: [{ url: cover, alt: 'Casinha luminária em cerâmica disponível na Agô Trancoso' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [cover] },
};

const ids = ['casinha-luminaria', 'igrejinha-luminaria-trancoso', 'igreja-quadrado-gg'];

export default function LuminariasEmCeramicaPage() {
  const all = getAvailableProducts();
  const products = ids.flatMap(id => all.filter(product => product.id === id));
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: title, description, url: SITE_DOMAIN + path, inLanguage: 'pt-BR',
        isPartOf: { '@id': SITE_DOMAIN + '#website' },
        mainEntity: {
          '@type': 'ItemList', numberOfItems: products.length,
          itemListElement: products.map((product, index) => ({
            '@type': 'ListItem', position: index + 1,
            name: product.name, url: SITE_DOMAIN + '/produtos/' + product.id,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN },
          { '@type': 'ListItem', position: 2, name: 'Decoração em cerâmica', item: SITE_DOMAIN + '/decoracao-em-ceramica' },
          { '@type': 'ListItem', position: 3, name: 'Luminárias em cerâmica', item: SITE_DOMAIN + path },
        ],
      },
    ],
  };

  return (
    <div className="catalog-page">
      <div className="site-container catalog-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span aria-hidden="true">/</span>
          <Link href="/decoracao-em-ceramica">Decoração</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Luminárias em cerâmica</span>
        </nav>

        <header className="catalog-intro commerce-catalog-intro">
          <div>
            <p className="eyebrow">Decoração em cerâmica</p>
            <h1>Luminárias de cerâmica: casinhas e igrejinhas.</h1>
          </div>
          <p>Descubra peças com recortes de portas e janelas que valorizam a luz na decoração. A coleção reúne casinhas e representações da Igreja do Quadrado de Trancoso, em formatos para diferentes ambientes.</p>
        </header>

        <div className="product-grid catalog-grid commerce-first-grid" aria-label="Luminárias de cerâmica da Agô">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} listName="Luminárias em cerâmica" />
          ))}
        </div>

        <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="escolher-luminaria">
          <div>
            <p className="eyebrow">Antes de escolher</p>
            <h2 id="escolher-luminaria">Qual luminária combina com seu espaço?</h2>
          </div>
          <div className="catalog-buying-answer-copy">
            <p>A casinha luminária faz referência ao casario de Trancoso. A igrejinha luminária pequena destaca a fachada da Igreja de São João Batista. A Igreja do Quadrado GG é uma opção de maior presença na decoração.</p>
            <p>Veja fotografias, medidas e orientações específicas na página de cada peça. Antes de usar qualquer fonte de luz, confira o tipo de iluminação indicado para o modelo.</p>
            <Link href="/igrejinha-de-trancoso" className="text-link">Conheça também as igrejinhas do Quadrado ↗</Link>
          </div>
        </section>

        <section className="catalog-buying-answer" aria-labelledby="comprar-luminarias">
          <div><p className="eyebrow">Compre na Agô</p><h2 id="comprar-luminarias">Encontre no Quadrado ou receba em casa.</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>A Agô Trancoso seleciona cerâmicas e peças decorativas para venda na banca do Quadrado e no site. Consulte as fotos reais, os preços e as informações de envio antes de escolher.</p>
            <div className="home-hero-actions">
              <Link href="/produtos" className="text-link">Explorar toda a coleção ↗</Link>
              <Link href="/contato" className="text-link">Dúvidas e atendimento ↗</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
