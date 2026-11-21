import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { SITE_DOMAIN, whatsappLink } from '@/lib/config';

const path = '/pedidos-em-quantidade';
const title = 'Lembranças para casamentos, pousadas e empresas | Agô Trancoso';
const description = 'Precisa de lembranças de Trancoso em quantidade para hóspedes, eventos ou presentes corporativos? Conheça as peças da Agô e solicite uma cotação de disponibilidade, valores e entrega.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    type: 'website',
    images: [{ url: '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg', alt: 'Ímã da Igrejinha de Trancoso em cerâmica' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg'] },
};

const featuredIds = [
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
  'igreja-quadrado-p',
  'miniatura-quadrado-trancoso',
];

const quoteUrl = whatsappLink(
  'Olá! Gostaria de solicitar uma cotação de peças da Agô Trancoso em quantidade. Vou informar as peças, a quantidade desejada, a cidade de entrega e a data em que preciso recebê-las.'
);

export default function PedidosEmQuantidadePage() {
  const available = getAvailableProducts();
  const products = featuredIds.flatMap(id => available.filter(product => product.id === id));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_DOMAIN}${path}#page`,
        url: `${SITE_DOMAIN}${path}`,
        name: title,
        description,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${SITE_DOMAIN}#website` },
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
          { '@type': 'ListItem', position: 2, name: 'Pedidos em quantidade', item: `${SITE_DOMAIN}${path}` },
        ],
      },
    ],
  };

  return (
    <div className="catalog-page">
      <div className="site-container catalog-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span aria-hidden="true">/</span>
          <Link href="/lembrancas-de-trancoso">Lembranças</Link><span aria-hidden="true">/</span>
          <span aria-current="page">Pedidos em quantidade</span>
        </nav>

        <header className="catalog-intro commerce-catalog-intro">
          <div>
            <p className="eyebrow">Presentes com referência a Trancoso</p>
            <h1>Lembranças para eventos, pousadas e empresas.</h1>
          </div>
          <p>Está organizando um casamento, preparando lembranças para hóspedes ou escolhendo presentes para uma equipe? A Agô seleciona cerâmicas e objetos de decoração disponíveis em sua coleção. Consulte as possibilidades para o seu pedido.</p>
          <a className="button" href={quoteUrl} target="_blank" rel="noopener noreferrer">
            Pedir cotação pelo WhatsApp
          </a>
        </header>

        <div className="product-grid catalog-grid commerce-first-grid" aria-label="Sugestões de lembranças para pedidos em quantidade">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} listName="Pedidos em quantidade" />
          ))}
        </div>

        <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="para-quem">
          <div>
            <p className="eyebrow">Ideias de uso</p>
            <h2 id="para-quem">Para presentear com significado.</h2>
          </div>
          <div className="catalog-buying-answer-copy">
            <p><strong>Casamentos e celebrações:</strong> lembranças para convidados, conforme quantidade e prazo disponíveis.</p>
            <p><strong>Pousadas e hospedagens:</strong> peças para presentes de boas-vindas, hóspedes e decoração.</p>
            <p><strong>Empresas e eventos:</strong> presentes em pequenas ou maiores quantidades, mediante cotação.</p>
            <p>As peças são selecionadas e comercializadas pela Agô. Não indicamos fabricação própria, fabricação na Bahia ou personalização como serviços garantidos.</p>
          </div>
        </section>

        <section className="catalog-buying-answer" aria-labelledby="como-cotar">
          <div>
            <p className="eyebrow">Cotação sem compromisso</p>
            <h2 id="como-cotar">O que informar para receber um orçamento?</h2>
          </div>
          <div className="catalog-buying-answer-copy">
            <p>Conte quais peças chamaram sua atenção, a quantidade aproximada, a cidade de entrega e a data em que precisa receber o pedido.</p>
            <p>Confirmamos disponibilidade, valores, condições de pagamento, embalagem, frete e prazo antes de você fechar o pedido. Quantidades, descontos e adaptações dependem de consulta; não são garantidos pelo catálogo.</p>
            <p>
              <a href={quoteUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                Solicitar cotação pelo WhatsApp ↗
              </a>
            </p>
            <p>Prefere comprar poucas unidades agora? <Link href="/lembrancas-de-trancoso" className="text-link">Ver lembranças disponíveis no site ↗</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
}
