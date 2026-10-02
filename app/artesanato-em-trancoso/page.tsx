import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';

const title = 'Artesanato em Trancoso: cerâmica do Quadrado';
const description = 'Conheça a cerâmica artesanal disponível na Agô, no Quadrado de Trancoso, Bahia. Igrejinhas, miniaturas, luminárias e decoração com compra online para todo o Brasil.';
const path = '/artesanato-em-trancoso';
export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [{ url: '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg', alt: 'Miniatura artesanal do Quadrado de Trancoso em cerâmica' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg'] },
};

export default function ArtesanatoPage() {
  const products = sortProductsByAttention(getAvailableProducts().filter(product => ['igrejinhas', 'trancoso', 'decoracao'].includes(product.category)));
  const structuredData = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', name: title, description, url: `${SITE_DOMAIN}${path}`, inLanguage: 'pt-BR', isPartOf: { '@id': `${SITE_DOMAIN}#website` }, mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, name: product.name, url: `${SITE_DOMAIN}/produtos/${product.id}` })) } },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN }, { '@type': 'ListItem', position: 2, name: 'Artesanato em Trancoso', item: `${SITE_DOMAIN}${path}` }] },
  ] };
  return <div className="catalog-page"><div className="site-container catalog-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <nav className="product-breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Artesanato em Trancoso</span></nav>
    <header className="catalog-intro commerce-catalog-intro"><div><p className="eyebrow">Agô · Quadrado de Trancoso · Bahia</p><h1>Artesanato em Trancoso, feito de cerâmica e memória.</h1></div><p>As formas da igreja, as cores das casinhas e a vida no Quadrado inspiram peças para a casa. Conheça a seleção de cerâmica artesanal disponível na Agô.</p></header>
    <div className="product-grid catalog-grid commerce-first-grid" aria-label="Cerâmica artesanal e decoração de Trancoso">{products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} listName="Artesanato em Trancoso" />)}</div>
    <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="ceramica-quadrado"><div><p className="eyebrow">Arquitetura em miniatura</p><h2 id="ceramica-quadrado">Do Quadrado de Trancoso para a decoração.</h2></div><div className="catalog-buying-answer-copy"><p>A Igreja de São João Batista, conhecida como Igreja do Quadrado ou Igrejinha de Trancoso, aparece em diferentes tamanhos de cerâmica. As miniaturas das casinhas trazem outra referência do centro histórico da vila.</p><p>Para decorar, escolha pela proporção do espaço: uma pequena igrejinha sobre a estante, uma miniatura do Quadrado na parede ou uma casinha luminária em um canto da casa. Cada página apresenta as fotos, o valor e as informações disponíveis de cada peça.</p><Link href="/igrejinha-de-trancoso" className="text-link">Ver tamanhos das igrejinhas ↗</Link></div></section>
    <section className="catalog-buying-answer" aria-labelledby="visitar-artesanato"><div><p className="eyebrow">Encontre a Agô</p><h2 id="visitar-artesanato">Onde encontrar artesanato no Quadrado?</h2></div><div className="catalog-buying-answer-copy"><p>Nossa banca fica no Quadrado de Trancoso, em Porto Seguro, no sul da Bahia. Passe para conhecer a cerâmica de perto. Se estiver longe, a coleção também está disponível para compra online, com envio para todo o Brasil.</p><p>Para escolher um souvenir da viagem ou um presente menor, veja nossa seleção de lembranças de Trancoso, com ímãs, colares e miniaturas.</p><div className="home-hero-actions"><Link href="/contato" className="text-link">Ver localização e contato ↗</Link><Link href="/lembrancas-de-trancoso" className="text-link">Escolher uma lembrança de Trancoso ↗</Link></div></div></section>
  </div></div>;
}
