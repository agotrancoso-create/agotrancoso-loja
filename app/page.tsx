import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const featuredOrder = [
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igrejinha-luminaria-trancoso',
  'casinha-luminaria',
  'miniatura-quadrado-trancoso',
  'cruzeiro-do-quadrado',
];

const discovery = [
  { title: 'Para a casa', category: 'decoracao', image: '/produtos/casinha-luminaria.jpg' },
  { title: 'Para presentear', category: 'presentes', image: '/produtos/colar-igreja-quadrado.jpg' },
  { title: 'Trancoso', category: 'trancoso', image: '/produtos/miniatura-quadrado-trancoso.jpg' },
  { title: 'Fé & devoção', category: 'fe-devocao', image: '/produtos/nossa-senhora-grande.jpg' },
];

export default function HomePage() {
  const available = getAvailableProducts();
  const byId = new Map(available.map((product) => [product.id, product]));
  const featured = featuredOrder
    .map((id) => byId.get(id) ?? getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  return (
    <div className="ago-home ago-premium-home">
      <section className="ago-premium-collection ago-premium-collection-first" aria-labelledby="featured-title">
        <div className="ago-container">
          <div className="ago-collection-intro-brand">
            <p className="eyebrow">Agô Trancoso · Bahia</p>
            <h1 id="featured-title">Peças para lembrar de um lugar.</h1>
            <p>Feitas à mão, uma a uma, para levar beleza e memória para dentro de casa.</p>
            <Link href="/produtos" className="ago-premium-text-link">Ver a coleção <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-product-grid ago-premium-product-grid-featured">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>

          <div className="ago-collection-after-grid">
            <span>Talvez a sua esteja aqui.</span>
            <Link href="/produtos" className="ago-premium-dark-cta">Descobrir a coleção</Link>
          </div>
        </div>
      </section>

      <Benefits />

      <div className="ago-premium-trust" aria-label="Informações da Agô">
        <div className="ago-container ago-premium-trust-inner">
          <span>Feitas à mão</span>
          <i aria-hidden="true" />
          <span>Envio para todo o Brasil</span>
          <i aria-hidden="true" />
          <span>Pagamento seguro</span>
        </div>
      </div>

      <section className="ago-premium-hero ago-home-hero" aria-labelledby="hero-title">
        <Image
          src="/hero.jpg"
          alt="Peças de cerâmica da Agô Trancoso"
          fill
          sizes="100vw"
          className="ago-premium-hero-image"
          priority
        />
        <div className="ago-premium-hero-overlay" aria-hidden="true" />
        <div className="ago-container ago-premium-hero-content">
          <p className="eyebrow">Um jeito de viver</p>
          <h2 id="hero-title">A beleza da Bahia<br />em pequenos detalhes.</h2>
          <p>Peças feitas à mão para a casa, para presentear e para guardar.</p>
          <Link href="/produtos" className="ago-premium-hero-cta">Ver as peças</Link>
        </div>
      </section>

      <section className="ago-premium-editorial ago-home-story" aria-labelledby="story-title">
        <div className="ago-container ago-premium-split">
          <div className="ago-premium-image">
            <Image
              src="/nossa-essencia.jpg"
              alt="Peças de cerâmica da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
              quality={92}
              className="ago-complementary-photo"
            />
          </div>
          <div className="ago-premium-copy">
            <p className="eyebrow">A história da Agô</p>
            <h2 id="story-title">Tudo começa com um encontro.</h2>
            <p>Toda noite, a Agô ganha vida no Quadrado. Entre luzes, conversas e histórias, cada escolha leva consigo uma lembrança de Trancoso.</p>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Nossa história <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-discovery" aria-labelledby="discover-title">
        <div className="ago-container">
          <div className="ago-premium-section-head">
            <div>
              <p className="eyebrow">Escolha por perto</p>
              <h2 id="discover-title">O que combina com a sua história?</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver tudo <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={'/produtos?categoria=' + item.category} className="ago-premium-discovery-card">
                <div className="ago-premium-discovery-image">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 767px) 50vw, 25vw" />
                </div>
                <div className="ago-premium-discovery-copy">
                  <span>{item.title}</span>
                  <strong>Escolher <span aria-hidden="true">↗</span></strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="como-comprar" className="ago-premium-how" aria-labelledby="how-title">
        <div className="ago-container">
          <div className="ago-premium-section-head ago-premium-how-head">
            <div>
              <p className="eyebrow">Como comprar</p>
              <h2 id="how-title">Escolher pode ser simples.</h2>
            </div>
          </div>

          <div className="ago-premium-how-grid">
            <article>
              <span>01</span>
              <h3>Escolha</h3>
              <p>Olhe com calma e escolha a peça que combina com você.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Peça</h3>
              <p>Adicione ao carrinho e confira tudo antes de finalizar.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Receba</h3>
              <p>A gente prepara tudo com cuidado e envia para o endereço informado.</p>
            </article>
          </div>

          <Link href="/produtos" className="ago-premium-dark-cta">Escolher uma peça</Link>
        </div>
      </section>

      <section className="ago-premium-visit" aria-labelledby="visit-title">
        <div className="ago-container ago-premium-visit-grid">
          <div>
            <p className="eyebrow">Passe pelo Quadrado</p>
            <h2 id="visit-title">Quando estiver em Trancoso,<br />venha ver de perto.</h2>
            <p>A Agô está no coração do Quadrado, entre as histórias, as luzes e o movimento da noite.</p>
            <div className="ago-premium-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Google Maps <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="ago-premium-visit-mark">
            <span>Trancoso</span>
            <strong>Bahia</strong>
            <span>Brasil</span>
          </div>
        </div>
      </section>
    </div>
  );
}

