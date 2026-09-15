import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

const mapsUrl =
  'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5894988,-39.0957282,21z';

const whatsappUrl =
  'https://wa.me/557398558124?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso%20e%20gostaria%20de%20consultar%20as%20pe%C3%A7as.';

const featuredOrder = [
  'igreja-quadrado-p', 'igreja-quadrado-m', 'igrejinha-luminaria-trancoso', 'casinha-luminaria',
  'miniatura-quadrado-trancoso', 'cruzeiro-do-quadrado', 'estatueta-iemanja', 'presepio-em-ceramica',
  'nossa-senhora-grande', 'mobile-trancoso', 'terco-em-ceramica', 'rosario-trancoso',
];

export default function HomePage() {
  const available = getAvailableProducts();
  const featured = featuredOrder.map((id) => getProductById(id)).filter((product): product is NonNullable<typeof product> => Boolean(product?.available));
  const products = [...featured, ...available.filter((product) => !featured.some((item) => item.id === product.id))].slice(0, 12);

  return (
    <div className="bg-areia">
      <section id="colecao" className="max-w-content mx-auto px-5 md:px-10 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="section-heading"><div><p className="eyebrow mb-3">A coleção</p><h2 className="section-title">Peças que contam uma história.</h2><p className="section-intro">Escolhas especiais para trazer um pouco de Trancoso para dentro de casa.</p></div><Link href="/produtos" className="collection-link">Ver coleção completa <span>↗</span></Link></div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-9 scrollbar-none"><Link href="#colecao" className="category-pill active">Todos</Link><Link href="/produtos?categoria=trancoso" className="category-pill">Trancoso</Link><Link href="/produtos?categoria=igrejinhas" className="category-pill">Igrejinhas</Link><Link href="/produtos?categoria=decoracao" className="category-pill">Decoração</Link><Link href="/produtos?categoria=fe-devocao" className="category-pill">Fé e devoção</Link><Link href="/produtos?categoria=presentes" className="category-pill">Presentes</Link></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 md:gap-x-8 gap-y-12 md:gap-y-16">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        <div className="catalog-cta"><p>Mais peças, formas e histórias para descobrir.</p><Link href="/produtos">Explorar toda a coleção</Link></div>
      </section>

      <section className="hero-section relative flex items-end overflow-hidden bg-marrom text-areia">
        <Image src="/hero.jpg" alt="Peças de cerâmica da Agô Trancoso" fill priority sizes="100vw" className="object-cover hero-image" unoptimized />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 w-full max-w-content mx-auto px-5 md:px-10 pb-10 md:pb-12">
          <p className="eyebrow text-areia/75 mb-4">Agô Trancoso · cerâmica e memória</p>
          <h1 className="font-serif text-[3rem] sm:text-6xl md:text-[6.5rem] leading-[.84] tracking-[-.035em]">FEITO À MÃO.<br />FEITO PARA DURAR.</h1>
          <p className="mt-5 text-base md:text-xl text-areia/90 max-w-xl leading-relaxed">Cerâmicas e decoração com alma brasileira.</p>
          <p className="mt-2 text-sm md:text-base text-areia/70 max-w-lg leading-7">Peças artesanais inspiradas no charme de Trancoso, feitas para decorar, presentear e guardar na memória.</p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Link href="#colecao" className="inline-flex items-center justify-center bg-areia text-marrom px-8 py-4 text-[10px] font-bold tracking-[.2em] uppercase">Ver produtos</Link>
            <Link href="/nossa-essencia" className="inline-flex items-center justify-center border border-areia/60 text-areia px-8 py-4 text-[10px] font-bold tracking-[.2em] uppercase">Conheça a Agô</Link>
          </div>
        </div>
      </section>

      <div className="trust-strip"><span>Feito à mão</span><i /><span>Envio para todo o Brasil</span><i /><strong>Frete grátis acima de R$ 500</strong><i /><span>Pagamento seguro</span></div>
      <Benefits />
      <section className="editorial-section bg-areia2"><div className="max-w-content mx-auto px-5 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="editorial-image"><img src="/nossa-essencia.jpg" alt="Cerâmica da Agô Trancoso" loading="lazy" /></div><div className="max-w-xl"><p className="eyebrow mb-4">Nossa essência</p><h2 className="section-title editorial-title mb-7">O encanto de Trancoso, em cada detalhe.</h2><p className="editorial-copy">Cada peça é feita à mão, inspirada nas formas, histórias e elementos que fazem parte de Trancoso.</p><p className="editorial-copy mt-4">São objetos para viver a casa, presentear alguém especial e guardar uma memória boa.</p><Link href="/nossa-essencia" className="editorial-link">Conheça nossa história <span>→</span></Link></div></div></section>
      <section className="bg-areia"><div className="max-w-content mx-auto px-5 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="max-w-lg"><p className="eyebrow mb-4">Para a casa</p><h2 className="section-title mb-6">Um pouco de Trancoso para dentro de casa.</h2><p className="editorial-copy">Detalhes que mudam o ambiente e carregam consigo a beleza de uma história brasileira.</p><Link href="/produtos" className="inline-flex mt-8 bg-marrom text-areia px-7 py-4 text-[10px] font-bold uppercase tracking-[.18em]">Escolher uma peça</Link></div><div className="editorial-image"><img src="/complementar.jpg" alt="Igrejinhas luminárias em cerâmica" loading="lazy" /></div></div></section>
      <section className="how-section bg-areia2 text-marrom"><div className="max-w-content mx-auto px-5 md:px-10 py-16 md:py-20 grid md:grid-cols-[.7fr_1.3fr] gap-10 md:gap-20"><div><p className="eyebrow mb-4">Como comprar</p><h2 className="font-serif text-4xl md:text-5xl leading-[.98]">Escolha sua peça,<br />com calma.</h2></div><div className="grid sm:grid-cols-3 gap-8 text-sm text-marrom/70 leading-7"><div><span className="step-number">01</span><strong>Escolha</strong>Conheça a coleção e escolha a peça que deseja.</div><div><span className="step-number">02</span><strong>Carrinho</strong>Adicione ao carrinho e informe seus dados de entrega.</div><div><span className="step-number">03</span><strong>Pagamento</strong>Confira o pedido e siga para o pagamento seguro.</div></div></div></section>
      <section className="visit-section bg-marrom text-areia"><div className="max-w-content mx-auto px-5 md:px-10 py-16 md:py-20 grid md:grid-cols-2 gap-10 md:gap-20"><div><p className="eyebrow text-areia/60 mb-4">Visite a Agô</p><h2 className="font-serif text-4xl md:text-5xl leading-none mb-6">O Quadrado de Trancoso também é a nossa casa.</h2><p className="text-areia/70 leading-7">Nossa banca fica no Quadrado de Trancoso. Para localização e atendimento, fale conosco pelo WhatsApp.</p><div className="flex flex-wrap gap-3 mt-8"><a href={mapsUrl} target="_blank" rel="noreferrer" className="border border-areia/30 px-6 py-4 text-[10px] font-bold uppercase tracking-[.16em]">Abrir no Google Maps</a><a href={whatsappUrl} target="_blank" rel="noreferrer" className="bg-terracota text-areia px-6 py-4 text-[10px] font-bold uppercase tracking-[.16em]">Falar no WhatsApp</a></div></div><div className="border-t border-areia/15 pt-5"><p className="eyebrow text-areia/60 mb-4">Informações úteis</p><div className="divide-y divide-areia/10"><div className="py-4"><strong>Banca</strong><span>Quadrado de Trancoso</span></div><div className="py-4"><strong>Atendimento</strong><span>WhatsApp e presencialmente no Quadrado</span></div><div className="py-4"><strong>Envios</strong><span>R$ 39,90 para pedidos até R$ 500 · grátis acima de R$ 500</span></div></div></div></div></section>
    </div>
  );
}
