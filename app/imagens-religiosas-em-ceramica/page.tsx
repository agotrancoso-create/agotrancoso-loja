import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

const path = '/imagens-religiosas-em-ceramica';
const title = 'Imagens Religiosas e Peças de Fé em Cerâmica | Agô Trancoso';
const description = 'Conheça imagens religiosas, Sagrada Família, Nossa Senhora, Iemanjá, Divino e outros objetos de devoção em cerâmica na Agô Trancoso.';
const cover = '/produtos/catalogo/nossa-senhora-grande-1.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    title, description, url: path, type: 'website',
    images: [{ url: cover, alt: 'Imagem de Nossa Senhora em cerâmica na coleção da Agô' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [cover] },
};

const ids = [
  'sagrada-familia',
  'nossa-senhora-aparecida',
  'divino-espirito-santo',
  'estatueta-iemanja',
  'casal-pretos-velhos',
  'presepio-em-ceramica',
  'terco-em-ceramica',
  'nossa-senhora-grande',
  'rosario-trancoso',
];

export default function ImagensReligiosasPage() {
  const all = getAllProducts();
  const products = ids.flatMap(id => all.filter(product =>
    product.id === id && (
      product.available ||
      Boolean(product.finishes?.some(option => (option.stock ?? 0) > 0))
    )
  ));
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
          { '@type': 'ListItem', position: 2, name: 'Imagens religiosas em cerâmica', item: SITE_DOMAIN + path },
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
          <span aria-current="page">Imagens religiosas em cerâmica</span>
        </nav>

        <header className="catalog-intro commerce-catalog-intro">
          <div>
            <p className="eyebrow">Fé e devoção</p>
            <h1>Imagens religiosas e objetos de fé em cerâmica.</h1>
          </div>
          <p>Uma seleção de peças com referências a diferentes tradições de fé e devoção: imagens, presépio, terços e rosários. Conheça cada peça pelas fotos e escolha para seu espaço ou para presentear.</p>
        </header>

        <div className="product-grid catalog-grid commerce-first-grid" aria-label="Imagens e peças religiosas em cerâmica">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} listName="Imagens religiosas em cerâmica" />
          ))}
        </div>

        <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="escolher-devocao">
          <div><p className="eyebrow">Conheça a coleção</p><h2 id="escolher-devocao">Peças para diferentes espaços de devoção.</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>Entre os itens da Agô, você encontra a Sagrada Família nos acabamentos colorido e dourado, imagens de Nossa Senhora e Iemanjá, o Divino Espírito Santo, o presépio e outras representações de fé.</p>
            <p>As páginas individuais apresentam as fotografias e informações de cada item. Compare tamanhos, acabamentos e formas de apresentação antes de comprar.</p>
            <Link href="/produtos?categoria=fe-devocao" className="text-link">Explorar a seleção de fé e devoção ↗</Link>
          </div>
        </section>

        <section className="catalog-buying-answer" aria-labelledby="atendimento-devocao">
          <div><p className="eyebrow">Agô Trancoso</p><h2 id="atendimento-devocao">Peças selecionadas para decorar e presentear.</h2></div>
          <div className="catalog-buying-answer-copy">
            <p>A Agô reúne objetos de cerâmica e decoração disponíveis em sua banca no Quadrado de Trancoso e no site, com envio para o Brasil. Se precisar de informações adicionais sobre uma peça, fale com a gente.</p>
            <div className="home-hero-actions">
              <Link href="/produtos" className="text-link">Ver todas as peças ↗</Link>
              <Link href="/contato" className="text-link">Falar com a Agô ↗</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
