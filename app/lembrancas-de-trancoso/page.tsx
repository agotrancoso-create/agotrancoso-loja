import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts, getEffectivePrice } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';
import { FIXED_SHIPPING_PRICE } from '@/lib/shipping';

const title = 'Lembranças de Trancoso: presentes e souvenirs em cerâmica';
const description = 'Escolha uma lembrança de Trancoso: ímãs, colares, igrejinhas e miniaturas do Quadrado em cerâmica. Compre na Agô e receba em todo o Brasil.';
const path = '/lembrancas-de-trancoso';
export const metadata: Metadata = {
  title, description, alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [{ url: '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg', alt: 'Ímã da Igrejinha de Trancoso em cerâmica' }] },
  twitter: { card: 'summary_large_image', title, description, images: ['/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg'] },
};
const ids = ['ima-igrejinha-trancoso', 'colar-igreja-quadrado', 'igreja-quadrado-p', 'igreja-quadrado-m', 'miniatura-quadrado-trancoso', 'igrejinha-luminaria-trancoso'];
const brl = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function LembrancasPage() {
  const available = getAvailableProducts();
  const products = ids.flatMap(id => available.filter(product => product.id === id));
  const startingPrice = products.length ? Math.min(...products.map(getEffectivePrice)) : null;
  const structuredData = {
    '@context': 'https://schema.org', '@graph': [
      { '@type': 'CollectionPage', name: title, description, url: `${SITE_DOMAIN}${path}`, inLanguage: 'pt-BR', isPartOf: { '@id': `${SITE_DOMAIN}#website` }, mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, name: product.name, url: `${SITE_DOMAIN}/produtos/${product.id}` })) } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN }, { '@type': 'ListItem', position: 2, name: 'Lembranças de Trancoso', item: `${SITE_DOMAIN}${path}` }] },
    ],
  };
  return <div className="catalog-page"><div className="site-container catalog-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
    <nav className="product-breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Lembranças de Trancoso</span></nav>
    <header className="catalog-intro commerce-catalog-intro"><div><p className="eyebrow">Para presentear e guardar</p><h1>Lembranças de Trancoso em cerâmica.</h1></div><p>O Quadrado, a igrejinha, as casinhas coloridas. Escolha um presente que leve um pouco de Trancoso para o dia a dia.{startingPrice !== null ? ` Peças nesta seleção a partir de ${brl(startingPrice)}.` : ''}</p></header>
    <div className="product-grid catalog-grid commerce-first-grid" aria-label="Presentes e souvenirs de Trancoso">{products.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} listName="Lembranças de Trancoso" />)}</div>
    <section className="catalog-buying-answer catalog-buying-answer-after-products" aria-labelledby="escolher-lembranca"><div><p className="eyebrow">Uma escolha com significado</p><h2 id="escolher-lembranca">Qual lembrança de Trancoso escolher?</h2></div><div className="catalog-buying-answer-copy"><p>O ímã e o colar da igrejinha são opções pequenas para presentear. Para a decoração, as igrejinhas P e M levam a fachada da Igreja de São João Batista para prateleiras e aparadores.</p><p>A miniatura do Quadrado reúne as casinhas e a igreja em uma composição que pode ser pendurada ou apoiada. Quem prefere uma peça de luz pode conhecer a Igrejinha Luminária. Veja as dimensões e as fotos na página de cada peça antes de escolher.</p><Link href="/igrejinha-de-trancoso" className="text-link">Comparar as igrejinhas de Trancoso ↗</Link></div></section>
    <section className="catalog-buying-answer" aria-labelledby="comprar-lembranca"><div><p className="eyebrow">Compra online</p><h2 id="comprar-lembranca">Escolha, coloque na sacola e receba.</h2></div><div className="catalog-buying-answer-copy"><p>Abra a peça, escolha a quantidade e adicione à sacola. Na finalização, informe seus dados e endereço, confira o total e siga para o pagamento pela InfinitePay.</p><p>Enviamos para todo o Brasil. O frete fixo é de {brl(FIXED_SHIPPING_PRICE)}; quando houver frete grátis para o pedido, o desconto aparece na sacola. Consulte o prazo disponível ao informar seu CEP.</p><p>Quer uma encomenda personalizada ou várias lembranças para presentear? <Link href="/contato" className="text-link">Fale com a Agô para combinar os detalhes.</Link></p></div></section>
    <section className="catalog-buying-answer" aria-labelledby="onde-lembranca"><div><p className="eyebrow">Desde 2016 no Quadrado</p><h2 id="onde-lembranca">Onde comprar lembranças em Trancoso?</h2></div><div className="catalog-buying-answer-copy"><p>Você encontra a Agô no Quadrado de Trancoso, em Porto Seguro, Bahia. Pode ver as peças na nossa banca durante a viagem ou comprar pelo site depois de voltar para casa.</p><div className="home-hero-actions"><Link href="/contato" className="text-link">Como chegar à Agô ↗</Link><Link href="/artesanato-em-trancoso" className="text-link">Conhecer o artesanato em cerâmica ↗</Link></div></div></section>
  </div></div>;
}
