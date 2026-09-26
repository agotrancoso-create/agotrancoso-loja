import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';

export const metadata: Metadata = {
  title: { absolute: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso' },
  description: 'Igrejinhas de Trancoso em cerâmica, peças inspiradas na Igreja do Quadrado e uma seleção de artesanato em cerâmica disponível na Agô, no Quadrado de Trancoso, Bahia.',
  alternates: { canonical: '/' },
};

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const discovery = [
  { title: 'Trancoso', subtitle: 'Igrejinhas e memórias do lugar', category: 'trancoso', image: '/produtos/miniatura-quadrado-trancoso.jpg' },
  { title: 'Casa & decoração', subtitle: 'Peças para viver com você', category: 'decoracao', image: '/produtos/esfera-decorativa.jpg' },
  { title: 'Fé & devoção', subtitle: 'Símbolos para acompanhar', category: 'fe-devocao', image: '/produtos/catalogo/nossa-senhora-grande-1.jpg' },
  { title: 'Presentes', subtitle: 'Escolhas para presentear', category: 'presentes', image: '/produtos/colar-igreja-quadrado.jpg' },
];

export default function HomePage() {
  const featured = sortProductsByAttention(getAvailableProducts()).slice(0, 6);

  return (
    <div className="ago-home ago-premium-home">
      <section className="ago-cinematic-commerce" aria-labelledby="featured-title">
        <div className="ago-cinematic-media" aria-hidden="true">
          <Image src="/hero.jpg" alt="" fill priority sizes="100vw" className="ago-cinematic-image" quality={92} />
          <div className="ago-cinematic-overlay" />
        </div>

        <div className="ago-container ago-cinematic-copy ago-reveal is-visible">
          <p className="eyebrow">Quadrado de Trancoso · Bahia</p>
          <h1 id="featured-title">Escolha uma peça para levar Trancoso com você.</h1>
          <p>Uma seleção de cerâmicas que parte do Quadrado e chega à sua casa. As peças vêm primeiro, porque é por elas que a história começa.</p>
          <div className="home-hero-actions">
            <a href="#pecas-em-destaque" className="ago-premium-hero-cta">Ver peças</a>
            <Link href="/igrejinha-de-trancoso" className="ago-cinematic-secondary">Igrejinhas de Trancoso <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div id="pecas-em-destaque" className="ago-container ago-cinematic-products ago-reveal">
          <div className="ago-cinematic-products-head">
            <div>
              <p className="eyebrow">Seleção Agô</p>
              <h2>Peças que chamam o olhar primeiro.</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver coleção completa <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-product-grid ago-premium-product-grid-featured commerce-first-grid">
            {featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
          </div>

          <div className="ago-collection-after-grid ago-conversion-after-grid">
            <span>Envio para todo o Brasil · frete grátis acima de R$ 500</span>
            <Link href="/produtos" className="ago-premium-dark-cta">Continuar escolhendo</Link>
          </div>
        </div>
      </section>

      <section className="ago-journey-chapter ago-reveal" aria-labelledby="feito-mao-title">
        <div className="ago-container ago-journey-heading">
          <span className="ago-journey-index">02</span>
          <div>
            <p className="eyebrow">De perto</p>
            <h2 id="feito-mao-title">O detalhe feito à mão muda tudo.</h2>
            <p>Formas, pintura e pequenas diferenças fazem cada peça ter presença própria.</p>
          </div>
        </div>
        <Benefits />
      </section>

      <section className="ago-premium-editorial ago-home-story ago-reveal" aria-labelledby="story-title">
        <div className="ago-container ago-premium-split">
          <div className="ago-premium-image ago-story-image">
            <Image src="/nossa-essencia.jpg" alt="Universo visual da Agô Trancoso" fill sizes="(max-width: 900px) 100vw, 56vw" quality={92} className="ago-complementary-photo" />
          </div>
          <div className="ago-premium-copy">
            <span className="ago-journey-index">03</span>
            <p className="eyebrow">No Quadrado</p>
            <h2 id="story-title">A seleção acontece onde Trancoso pulsa.</h2>
            <p>A Agô está em Trancoso desde 2016. A igreja, as fachadas, as cores e o ritmo do Quadrado fazem parte do olhar com que escolhemos cada peça.</p>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-discovery ago-reveal" aria-labelledby="discover-title">
        <div className="ago-container">
          <div className="ago-premium-section-head">
            <div>
              <span className="ago-journey-index">04</span>
              <p className="eyebrow">Sua escolha</p>
              <h2 id="discover-title">Entre pelo que mais combina com você.</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver todas as peças <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={`/produtos?categoria=${item.category}`} className="ago-premium-discovery-card">
                <div className="ago-premium-discovery-image"><Image src={item.image} alt={item.title} fill quality={88} sizes="(max-width: 767px) 50vw, 25vw" /></div>
                <div className="ago-premium-discovery-copy"><small>{item.subtitle}</small><span>{item.title}</span><strong>Ver peças <span aria-hidden="true">↗</span></strong></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ago-shipping-chapter ago-reveal" aria-labelledby="shipping-title">
        <div className="ago-container ago-shipping-chapter-inner">
          <div>
            <span className="ago-journey-index">05</span>
            <p className="eyebrow">Da Bahia para sua casa</p>
            <h2 id="shipping-title">Você escolhe aqui. A gente cuida do caminho.</h2>
          </div>
          <div className="ago-shipping-facts">
            <span>Compra online</span>
            <span>Pagamento seguro</span>
            <span>Frete grátis acima de R$ 500</span>
            <span>Envio para todo o Brasil</span>
            <span>Envio internacional sob consulta</span>
          </div>
        </div>
      </section>

      <section className="ago-premium-visit ago-reveal" aria-labelledby="visit-title">
        <div className="ago-container ago-premium-visit-grid">
          <div>
            <p className="eyebrow">Se estiver por perto</p>
            <h2 id="visit-title">A gente está no Quadrado.</h2>
            <p>Passe para ver as peças de perto e sentir a escala, a textura e a pintura de cada uma.</p>
            <div className="ago-premium-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Como chegar <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="ago-premium-visit-mark" aria-hidden="true"><span>Trancoso</span><strong>Bahia</strong><span>Brasil</span></div>
        </div>
      </section>
    </div>
  );
}
