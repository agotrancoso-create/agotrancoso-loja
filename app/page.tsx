import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

export const metadata: Metadata = {
  title: { absolute: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso' },
  description: 'Igrejinhas de Trancoso em cerâmica, peças inspiradas na Igreja do Quadrado e uma seleção de artesanato em cerâmica disponível na Agô, no Quadrado de Trancoso, Bahia.',
  alternates: { canonical: '/' },
};

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const featuredOrder = [
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
  'miniatura-quadrado-trancoso',
];

const discovery = [
  { title: 'Trancoso', subtitle: 'Igrejinhas e memórias do lugar', category: 'trancoso', image: '/produtos/miniatura-quadrado-trancoso.jpg' },
  { title: 'Casa & decoração', subtitle: 'Peças para viver com você', category: 'decoracao', image: '/produtos/esfera-decorativa.jpg' },
  { title: 'Fé & devoção', subtitle: 'Símbolos para acompanhar', category: 'fe-devocao', image: '/produtos/catalogo/nossa-senhora-grande-1.jpg' },
  { title: 'Presentes', subtitle: 'Escolhas para presentear', category: 'presentes', image: '/produtos/colar-igreja-quadrado.jpg' },
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
            <p className="eyebrow">Seleção Agô · Trancoso, Bahia</p>
            <h1 id="featured-title">Escolha sua peça de Trancoso.</h1>
            <p>Igrejinhas do Quadrado, objetos para casa, símbolos de fé e presentes disponíveis para comprar online. Comece pela seleção em destaque.</p>
            <div className="home-hero-actions">
              <Link href="/igrejinha-de-trancoso" className="ago-premium-text-link">Comprar Igrejinhas <span aria-hidden="true">↗</span></Link>
              <Link href="/produtos" className="ago-premium-text-link">Ver todas as peças <span aria-hidden="true">↗</span></Link>
            </div>
          </div>

          <div className="ago-premium-product-grid ago-premium-product-grid-featured commerce-first-grid">
            {featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 4} />)}
          </div>

          <div className="ago-collection-after-grid ago-conversion-after-grid">
            <span>Envio para todo o Brasil · frete grátis acima de R$ 500</span>
            <Link href="/produtos" className="ago-premium-dark-cta">Ver coleção completa</Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-discovery" aria-labelledby="discover-title">
        <div className="ago-container">
          <div className="ago-premium-section-head">
            <div><p className="eyebrow">A coleção</p><h2 id="discover-title">Continue escolhendo.</h2></div>
            <Link href="/produtos" className="ago-premium-text-link">Ver todas as peças <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={`/produtos?categoria=${item.category}`} className="ago-premium-discovery-card">
                <div className="ago-premium-discovery-image"><Image src={item.image} alt={item.title} fill quality={86} sizes="(max-width: 767px) 50vw, 25vw" /></div>
                <div className="ago-premium-discovery-copy"><small>{item.subtitle}</small><span>{item.title}</span><strong>Ver peças <span aria-hidden="true">↗</span></strong></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="ago-premium-trust" aria-label="Informações de compra da Agô">
        <div className="ago-container ago-premium-trust-inner">
          <span>Compra online</span><i aria-hidden="true" /><span>Frete grátis acima de R$ 500</span><i aria-hidden="true" /><span>Pagamento seguro</span><i aria-hidden="true" /><span>Envio para todo o Brasil</span>
        </div>
      </div>

      <Benefits />

      <section className="ago-premium-hero ago-home-hero" aria-labelledby="hero-title">
        <Image src="/hero.jpg" alt="Peças de cerâmica disponíveis na Agô Trancoso" fill priority sizes="100vw" className="ago-premium-hero-image" quality={90} />
        <div className="ago-premium-hero-overlay" aria-hidden="true" />
        <div className="ago-container ago-premium-hero-content">
          <p className="eyebrow">Do Quadrado para sua casa</p>
          <h2 id="hero-title">Trancoso pode continuar por perto.</h2>
          <p>Escolha uma peça que leve um pouco desse lugar com você.</p>
          <Link href="/produtos?categoria=trancoso" className="ago-premium-hero-cta">Ver peças de Trancoso</Link>
        </div>
      </section>

      <section className="ago-premium-editorial ago-home-story" aria-labelledby="story-title">
        <div className="ago-container ago-premium-split">
          <div className="ago-premium-image">
            <Image src="/nossa-essencia.jpg" alt="Universo visual da Agô Trancoso" fill sizes="(max-width: 900px) 100vw, 56vw" quality={92} className="ago-complementary-photo" />
          </div>
          <div className="ago-premium-copy">
            <p className="eyebrow">Nossa inspiração</p>
            <h2 id="story-title">Começou no Quadrado.</h2>
            <p>A Agô está em Trancoso desde 2016. A igreja, as fachadas e as cores do Quadrado convivem aqui com outras referências brasileiras.</p>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-visit" aria-labelledby="visit-title">
        <div className="ago-container ago-premium-visit-grid">
          <div>
            <p className="eyebrow">Se estiver por perto</p>
            <h2 id="visit-title">A gente está no Quadrado.</h2>
            <p>Passe para ver as peças de perto.</p>
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
