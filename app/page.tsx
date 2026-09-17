import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';
const featuredOrder = [
  'igreja-quadrado-p', 'igreja-quadrado-m', 'igreja-quadrado-gg', 'igrejinha-luminaria-trancoso',
  'casinha-luminaria', 'miniatura-quadrado-trancoso', 'cruzeiro-do-quadrado', 'mobile-trancoso',
];

export default function HomePage() {
  const available = getAvailableProducts();
  const featured = featuredOrder.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p?.available));
  const products = [...featured, ...available.filter((p) => !featured.some((item) => item.id === p.id))].slice(0, 12);
  const firstProducts = products.slice(0, 8);
  const remainingProducts = products.slice(8);

  return (
    <div className="ago-home" data-design-audit="2026-09-17">
      <section id="colecao" className="collection-showcase home-collection">
        <div className="home-collection-grid">
          <div className="collection-intro">
            <p className="eyebrow">Peças em destaque</p>
            <h2 className="section-title">Trancoso em forma de cerâmica.</h2>
            <p className="section-intro">Peças feitas à mão para decorar, presentear e guardar.</p>
            <Link href="/produtos" className="collection-link collection-link-large">Ver coleção <span>↗</span></Link>
          </div>
          <div className="featured-products-grid">
            {firstProducts.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
          </div>
          <div className="collection-after"><p>Peças artesanais para decorar, presentear e guardar memórias.</p><Link href="/produtos" className="collection-link">Conheça todas as peças <span>↗</span></Link></div>
        </div>
      </section>

      <section className="category-row home-categories" aria-label="Categorias">
        <Link href="#colecao" className="category-pill active">Todos</Link>
        <Link href="/produtos?categoria=trancoso" className="category-pill">Trancoso</Link>
        <Link href="/produtos?categoria=igrejinhas" className="category-pill">Igrejinhas</Link>
        <Link href="/produtos?categoria=decoracao" className="category-pill">Decoração</Link>
        <Link href="/produtos?categoria=fe-devocao" className="category-pill">Fé e devoção</Link>
        <Link href="/produtos?categoria=presentes" className="category-pill">Presentes</Link>
      </section>

      <section className="hero-section relative flex items-end overflow-hidden bg-marrom text-areia">
        <Image src="/hero.jpg" alt="Peças de cerâmica da Agô Trancoso" fill priority sizes="100vw" className="object-cover hero-image" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 w-full ago-container hero-content">
          <p className="eyebrow mb-4 text-areia">Agô Trancoso · cerâmica e memória</p>
          <h1>FEITO À MÃO.<br />FEITO PARA DURAR.</h1>
          <p className="hero-copy">Cerâmicas, decoração e peças artesanais inspiradas na arquitetura, nas formas e na identidade de Trancoso.</p>
          <div className="hero-actions"><Link href="#colecao" className="hero-primary">Ver produtos</Link><Link href="/nossa-essencia" className="hero-secondary">Conheça a Agô</Link></div>
        </div>
      </section>

      <Benefits />

      {remainingProducts.length > 0 && <section className="collection-more"><div className="ago-container collection-more-inner">
        <div className="section-heading"><div><p className="eyebrow">Mais da coleção</p><h2 className="section-title">Peças para decorar, presentear e guardar.</h2></div><Link href="/produtos" className="collection-link">Conheça todas as peças <span>↗</span></Link></div>
        <div className="remaining-products-grid">{remainingProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div></section>}

      <section className="editorial-section"><div className="ago-container editorial-grid">
        <div className="editorial-image"><img src="/nossa-essencia.jpg" alt="Cerâmica da Agô Trancoso" loading="lazy" /></div>
        <div className="editorial-copy-column"><p className="eyebrow">A Agô</p><h2 className="section-title">O encanto de Trancoso</h2>
          <p className="editorial-copy">Peças feitas à mão que traduzem referências de Trancoso em objetos para decorar, presentear e guardar.</p>
          <p className="editorial-copy">Cada peça nasce de formas, símbolos e detalhes que fazem parte desse universo e ganham nova presença dentro de casa.</p>
          <Link href="/nossa-essencia" className="editorial-link">Conheça a Agô →</Link>
        </div>
      </div></section>

      <section className="home-house"><div className="ago-container house-grid">
        <div className="house-copy"><p className="eyebrow">Para a casa</p><h2 className="section-title">Um pouco da essência de Trancoso para dentro de casa.</h2><p className="editorial-copy">Objetos artesanais para criar ambientes com calor, memória e personalidade.</p><Link href="/produtos" className="dark-button">Escolher uma peça</Link></div>
        <div className="editorial-image house-image"><img src="/complementar.jpg" alt="Duas igrejas em cerâmica da Agô Trancoso" loading="lazy" /></div>
      </div></section>

      <section className="how-section"><div className="ago-container how-grid">
        <div><p className="eyebrow">Como comprar</p><h2 className="section-title">Escolha sua peça,<br />com calma.</h2></div>
        <div className="steps-grid"><div><strong>Escolha</strong><p>Conheça a coleção e escolha a peça que deseja.</p></div><div><strong>Carrinho</strong><p>Adicione ao carrinho e informe seus dados de entrega.</p></div><div><strong>Pagamento</strong><p>Confira o pedido e siga para o pagamento seguro.</p></div></div>
      </div></section>

      <section className="visit-section text-areia"><div className="ago-container visit-grid">
        <div><p className="eyebrow">Visite a Agô</p><h2>Como chegar até a Agô</h2><p className="visit-copy">Nossa banca fica no Quadrado de Trancoso. Para localização e atendimento, fale conosco pelo WhatsApp.</p><div className="visit-actions"><a href={mapsUrl} target="_blank" rel="noreferrer">Abrir no Google Maps</a><a href={whatsappUrl} target="_blank" rel="noreferrer">Falar no WhatsApp</a><a href={instagramUrl} target="_blank" rel="noreferrer">Falar pelo Instagram</a></div></div>
        <div><p className="eyebrow">Informações úteis</p><div className="info-list"><div><strong>Banca</strong><span>Quadrado de Trancoso</span></div><div><strong>Atendimento</strong><span>WhatsApp, Instagram e presencialmente no Quadrado</span></div><div><strong>Envios</strong><span>Frete fixo de R$ 39,90; grátis acima de R$ 500.</span></div></div></div>
      </div></section>
    </div>
  );
}
