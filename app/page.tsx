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
    <div className="bg-areia">
      <section id="colecao" className="collection-showcase max-w-content mx-auto px-5 md:px-10">
        <div className="collection-intro">
          <p className="eyebrow mb-4">Peças em destaque</p>
          <h2 className="section-title">Trancoso em forma de cerâmica.</h2>
          <p className="section-intro">Peças feitas à mão para decorar, presentear e guardar.</p>
          <Link href="/produtos" className="collection-link collection-link-large">Ver coleção <span>↗</span></Link>
        </div>
        <div className="featured-products-grid">{firstProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <div className="mt-10 text-center"><Link href="/produtos" className="collection-link">Conheça todas as peças <span>↗</span></Link></div>
      </section>

      <section className="category-row max-w-content mx-auto px-5 md:px-10" aria-label="Categorias">
        <div>
          <Link href="#colecao" className="category-pill active">Todos</Link>
          <Link href="/produtos?categoria=trancoso" className="category-pill">Trancoso</Link>
          <Link href="/produtos?categoria=igrejinhas" className="category-pill">Igrejinhas</Link>
          <Link href="/produtos?categoria=decoracao" className="category-pill">Decoração</Link>
          <Link href="/produtos?categoria=fe-devocao" className="category-pill">Fé e devoção</Link>
          <Link href="/produtos?categoria=presentes" className="category-pill">Presentes</Link>
        </div>
      </section>

      <section className="hero-section relative flex items-end overflow-hidden bg-marrom text-areia">
        <Image src="/hero.jpg" alt="Peças de cerâmica da Agô Trancoso" fill priority sizes="100vw" className="object-cover hero-image" unoptimized />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 w-full max-w-content mx-auto px-5 md:px-10">
          <p className="eyebrow mb-4 text-areia">Agô Trancoso · cerâmica e memória</p>
          <h1>FEITO À MÃO.<br />FEITO PARA DURAR.</h1>
          <p className="mt-5 text-base md:text-xl max-w-xl leading-relaxed">Cerâmicas e peças artesanais inspiradas na arquitetura, nas formas e na identidade de Trancoso.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="#colecao" className="inline-flex items-center justify-center bg-areia text-marrom px-8 py-4 font-bold tracking-[.16em] uppercase rounded-sm">Ver produtos</Link>
            <Link href="/nossa-essencia" className="inline-flex items-center justify-center border border-areia/60 text-areia px-8 py-4 font-bold tracking-[.16em] uppercase rounded-sm">Conheça a Agô</Link>
          </div>
        </div>
      </section>

      <Benefits />

      {remainingProducts.length > 0 && <section className="collection-more"><div className="max-w-content mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="section-heading"><div><p className="eyebrow mb-3">Mais da coleção</p><h2 className="section-title">Peças para decorar, presentear e guardar.</h2></div><Link href="/produtos" className="collection-link">Conheça todas as peças <span>↗</span></Link></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 md:gap-x-8 gap-y-12 md:gap-y-16">{remainingProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </div></section>}

      <section className="editorial-section"><div className="max-w-content mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-24">
        <div className="editorial-image"><img src="/nossa-essencia.jpg" alt="Cerâmica da Agô Trancoso" loading="lazy" /></div>
        <div className="max-w-xl"><p className="eyebrow mb-4">A Agô</p><h2 className="section-title editorial-title mb-7">O encanto de Trancoso</h2>
          <p className="editorial-copy">Peças feitas à mão que traduzem referências de Trancoso em objetos para decorar, presentear e guardar.</p>
          <p className="editorial-copy mt-4">Cada peça nasce de formas, símbolos e detalhes que fazem parte desse universo e ganham nova presença dentro de casa.</p>
          <Link href="/nossa-essencia" className="editorial-link">Conheça a Agô <span>→</span></Link>
        </div>
      </div></section>

      <section className="bg-areia"><div className="max-w-content mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center py-16 md:py-24">
        <div className="max-w-lg"><p className="eyebrow mb-4">Para a casa</p><h2 className="section-title mb-6">Um pouco da essência de Trancoso para dentro de casa.</h2><p className="editorial-copy">Objetos artesanais para criar ambientes com calor, memória e personalidade.</p><Link href="/produtos" className="inline-flex mt-8 bg-marrom text-areia px-7 py-4 font-bold uppercase tracking-[.16em] rounded-sm">Escolher uma peça</Link></div>
        <div className="editorial-image"><img src="/complementar.jpg" alt="Igrejinhas luminárias em cerâmica" loading="lazy" /></div>
      </div></section>

      <section className="how-section text-marrom"><div className="max-w-content mx-auto px-5 md:px-10 grid md:grid-cols-[.8fr_1.2fr] gap-12 md:gap-20 items-start py-16 md:py-24">
        <div><p className="eyebrow mb-4">Como comprar</p><h2 className="section-title">Escolha sua peça,<br />com calma.</h2></div>
        <div className="grid sm:grid-cols-3 gap-8"><div><span className="step-number">01</span><strong>Escolha</strong>Conheça a coleção e escolha a peça que deseja.</div><div><span className="step-number">02</span><strong>Carrinho</strong>Adicione ao carrinho e informe seus dados de entrega.</div><div><span className="step-number">03</span><strong>Pagamento</strong>Confira o pedido e siga para o pagamento seguro.</div></div>
      </div></section>

      <section className="visit-section text-areia"><div className="max-w-content mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-12 md:gap-20 items-start py-16 md:py-24">
        <div><p className="eyebrow mb-4">Visite a Agô</p><h2>Como chegar até a Agô</h2><p className="mt-6 max-w-xl text-areia/70 leading-7">Nossa banca fica no Quadrado de Trancoso, em um dos pontos mais marcantes da cidade.</p>
          <div className="flex flex-wrap gap-3 mt-8"><a href={mapsUrl} target="_blank" rel="noreferrer" className="border border-areia/30 px-6 py-4 font-bold uppercase tracking-[.14em]">Abrir no Google Maps</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="bg-terracota text-areia px-6 py-4 font-bold uppercase tracking-[.14em]">Falar no WhatsApp</a><a href={instagramUrl} target="_blank" rel="noreferrer" className="border border-areia/30 px-6 py-4 font-bold uppercase tracking-[.14em]">Falar pelo Instagram</a></div>
        </div>
        <div><p className="eyebrow mb-4">Informações úteis</p><div className="divide-y divide-areia/10"><div className="py-4"><strong>Banca</strong><span>Quadrado de Trancoso</span></div><div className="py-4"><strong>Atendimento</strong><span>WhatsApp, Instagram e presencialmente no Quadrado</span></div><div className="py-4"><strong>Envios</strong><span>Frete fixo de R$ 39,90; grátis acima de R$ 500.</span></div></div></div>
      </div></section>
    </div>
  );
}
