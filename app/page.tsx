import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu&g_ep=EgoyMDI2MDkxMy4wIKXMDSoASAFQAw%3D%3D';
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
    <div className="ago-home" data-design-audit="2026-09-17-editorial-aligned">
      <section id="colecao" className="collection-showcase home-collection">
        <div className="home-collection-grid">
          <div className="collection-intro">
            <p className="eyebrow">A coleção</p>
            <h2 className="section-title">Peças para levar a Bahia para dentro de casa.</h2>
            <p className="section-intro">Cerâmicas e objetos inspirados nas formas, na arquitetura, na fé e nas memórias que fazem parte da nossa paisagem brasileira.</p>
            <Link href="/produtos" className="collection-link collection-link-large">Ver coleção</Link>
          </div>

          <div className="featured-products-grid">
            {firstProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>

          <div className="collection-after">
            <p>Escolha pela peça. Leve para casa o que fez você parar para olhar.</p>
            <Link href="/produtos" className="collection-link">Ver todas as peças</Link>
          </div>
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

      <section className="brasilidade-ribbon" aria-label="Identidade da Agô">
        <div className="ago-container brasilidade-ribbon-inner">
          <span>Bahia</span><span>Trancoso</span><span>Barro</span><span>Sol</span><span>Memória</span><span>Brasil</span>
        </div>
      </section>

      <section className="hero-section relative flex items-end overflow-hidden bg-marrom text-areia">
        <Image src="/hero.jpg" alt="Peças de cerâmica da Agô Trancoso" fill sizes="100vw" className="object-cover hero-image" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 w-full ago-container hero-content">
          <p className="eyebrow mb-4 text-areia">Feitas à mão.</p>
          <h1>FEITO À MÃO.<br />FEITO PARA DURAR.</h1>
          <p className="hero-copy">Peças para levar a Bahia para dentro de casa.<br />Um jeito brasileiro de morar.</p>
          <div className="hero-actions">
            <Link href="#colecao" className="hero-primary">Ver coleção</Link>
            <Link href="/nossa-essencia" className="hero-secondary">Conheça a Agô</Link>
          </div>
        </div>
      </section>

      <Benefits />

      {remainingProducts.length > 0 && (
        <section className="collection-more">
          <div className="ago-container collection-more-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Mais para olhar</p>
                <h2 className="section-title">Uma peça boa não precisa disputar espaço.</h2>
              </div>
              <Link href="/produtos" className="collection-link">Ver coleção completa</Link>
            </div>
            <div className="remaining-products-grid">
              {remainingProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="home-house">
        <div className="ago-container house-grid">
          <div className="house-copy">
            <p className="eyebrow">A casa</p>
            <h2 className="section-title">Da Bahia para sua casa.</h2>
            <p className="editorial-copy">Objetos com presença, feitos à mão e pensados para viver junto com você.</p>
            <Link href="/produtos" className="dark-button">Escolher uma peça</Link>
          </div>
          <div className="editorial-image house-image">
            <img src="/complementar.jpg" alt="Duas igrejas em cerâmica da Agô Trancoso" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="ago-container how-grid">
          <div>
            <p className="eyebrow">Como comprar</p>
            <h2 className="section-title">Gostou? O próximo passo é simples.</h2>
          </div>
          <div className="steps-grid">
            <div><strong>Escolha</strong><p>Conheça a coleção, veja os detalhes e encontre a peça que procura.</p></div>
            <div><strong>Seu pedido</strong><p>Adicione ao carrinho e informe os dados para receber em casa.</p></div>
            <div><strong>Pagamento</strong><p>Confira tudo com atenção e finalize pelo pagamento seguro.</p></div>
          </div>
        </div>
      </section>

      <section className="visit-section text-areia">
        <div className="ago-container visit-grid">
          <div>
            <p className="eyebrow">Visite a Agô</p>
            <h3 className="visit-section-title">Chegou ao Quadrado?<br className="visit-title-break" /> Procure a Agô.</h3>
            <p className="visit-copy">Nossa banca fica no Quadrado de Trancoso. Para localizar a Agô ou conversar sobre uma peça, fale com a gente pelo WhatsApp ou Instagram.</p>
            <div className="visit-actions">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Abrir no Google Maps</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Falar pelo Instagram</a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Informações úteis</p>
            <div className="info-list">
              <div><strong>Banca</strong><span>Quadrado de Trancoso</span></div>
              <div><strong>Atendimento</strong><span>WhatsApp, Instagram e presencialmente no Quadrado</span></div>
              <div><strong>Envios</strong><span>Frete fixo de R$ 39,90; grátis acima de R$ 500.</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
