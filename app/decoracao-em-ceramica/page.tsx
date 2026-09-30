import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';

const title = 'Decoração em cerâmica de Trancoso | Agô';
const description = 'Luminárias, igrejinhas e objetos em cerâmica para decorar a casa. Conheça as peças da Agô no Quadrado de Trancoso e compre online.';
const path = '/decoracao-em-ceramica';
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website', images: [{url:'/produtos/casinha-luminaria.jpg', alt:'Casinha luminária em cerâmica da Agô Trancoso'}] },
  twitter: {card:'summary_large_image', title, description, images:['/produtos/casinha-luminaria.jpg']},
};
export default function DecoracaoPage() {
  const products = sortProductsByAttention(getAvailableProducts().filter(product => ['decoracao','igrejinhas','trancoso'].includes(product.category)));
  const schema = {'@context':'https://schema.org','@type':'CollectionPage',name:title,description,url:SITE_DOMAIN+path,mainEntity:{'@type':'ItemList',numberOfItems:products.length,itemListElement:products.map((product,index)=>({'@type':'ListItem',position:index+1,name:product.name,url:`${SITE_DOMAIN}/produtos/${product.id}`}))}};
  return <div className="catalog-page"><div className="site-container catalog-shell">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}} />
    <nav className="product-breadcrumb" aria-label="Navegação estrutural"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Decoração em cerâmica</span></nav>
    <header className="catalog-intro commerce-catalog-intro"><div><p className="eyebrow">Trancoso para a sua casa</p><h1>Decoração em cerâmica, com a memória da Bahia.</h1></div><p>Igrejinhas, casinhas luminárias e objetos para compor estantes, aparadores e paredes. Escolha uma peça pela forma, pela proporção e pela história que ela leva para o seu espaço.</p></header>
    <div className="product-grid catalog-grid commerce-first-grid" aria-label="Peças para decorar a casa">{products.map((product,index)=><ProductCard key={product.id} product={product} priority={index<2} listName="Decoração em cerâmica" />)}</div>
    <section className="catalog-buying-answer" aria-labelledby="escolher-decoracao"><div><p className="eyebrow">Antes de escolher</p><h2 id="escolher-decoracao">Encontre a proporção para o seu ambiente.</h2></div><div className="catalog-buying-answer-copy"><p>Meça a largura e a profundidade da estante ou do aparador e confira as dimensões na página da peça. Deixe espaço ao redor para que a forma e a pintura possam ser vistas.</p><p>Para uma parede, a miniatura do Quadrado pode ser pendurada. Para um canto de leitura ou um aparador, explore as casinhas e igrejinhas luminárias. Consulte as características de cada modelo antes da compra.</p><Link href="/produtos" className="text-link">Comparar peças e filtrar por preço ↗</Link></div></section>
    <section className="catalog-buying-answer" aria-labelledby="visitar-decoracao"><div><p className="eyebrow">Vai visitar Trancoso?</p><h2 id="visitar-decoracao">Veja as peças de perto no Quadrado.</h2></div><div className="catalog-buying-answer-copy"><p>A Agô está no Quadrado de Trancoso desde 2016. Passe na nossa banca para conhecer as cores e as proporções ao vivo. Consulte o contato para combinar sua visita.</p><p>Depois da viagem, você também pode escolher pelo site e receber em casa. As páginas dos produtos mostram preços, fotos e condições de envio.</p><div className="home-hero-actions"><Link href="/contato" className="text-link">Localização e contato ↗</Link><Link href="/lembrancas-de-trancoso" className="text-link">Lembranças da viagem ↗</Link></div></div></section>
  </div></div>;
}
