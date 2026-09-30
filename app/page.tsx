import type { Metadata } from 'next';
import Link from 'next/link';
import Image from '@/components/ProductImage';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';
import ResumeCart from '@/components/ResumeCart';
import Benefits from '@/components/Benefits';

export const metadata: Metadata = {
  title: { absolute: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso' },
  description: 'Igrejinhas de Trancoso em cerâmica, peças inspiradas na Igreja do Quadrado e uma seleção de artesanato em cerâmica disponível na Agô, no Quadrado de Trancoso, Bahia.',
  alternates: { canonical: '/' },
};

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const discovery = [
  { title: 'Trancoso', category: 'trancoso', href: '/artesanato-em-trancoso', image: '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg' },
  { title: 'Casa & decoração', category: 'decoracao', image: '/produtos/casinha-luminaria.jpg' },
  { title: 'Fé & devoção', category: 'fe-devocao', image: '/produtos/catalogo/nossa-senhora-grande-2.jpg' },
  { title: 'Presentes', category: 'presentes', href: '/lembrancas-de-trancoso', image: '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg' },
];

export default function HomePage() {
  const allProducts = sortProductsByAttention(getAvailableProducts());
  const featured = allProducts.slice(0, 6);

  const structuredData = {
    '@context': 'https://schema.org', '@type': 'CollectionPage',
    '@id': `${SITE_DOMAIN}/#page`, url: SITE_DOMAIN,
    name: 'Agô Trancoso — Igrejinhas do Quadrado e cerâmica artesanal',
    isPartOf: { '@id': `${SITE_DOMAIN}#website` },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE_DOMAIN}/produtos/igreja-quadrado-p.jpg`, contentUrl: `${SITE_DOMAIN}/produtos/igreja-quadrado-p.jpg`, width: 960, height: 960, caption: 'Igrejinha do Quadrado de Trancoso em cerâmica' },
    mainEntity: { '@type': 'ItemList', itemListElement: featured.map((product, index) => ({ '@type': 'ListItem', position: index + 1, name: product.name, url: `${SITE_DOMAIN}/produtos/${product.id}` })) },
  };

  return (
    <div className="ago-home ago-premium-home ago-home-calm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="ago-cinematic-commerce" aria-labelledby="featured-title">
        <div className="ago-cinematic-media" aria-hidden="true">
          <Image src="/hero.jpg" alt="" fill priority unoptimized sizes="100vw" className="ago-cinematic-image" quality={100} />
          <div className="ago-cinematic-overlay" />
        </div>

        <div className="ago-container ago-cinematic-copy">
          <p className="eyebrow">Quadrado de Trancoso · Bahia</p>
          <h1 id="featured-title">Trancoso em cerâmica.</h1>
          <p>Cerâmica artesanal inspirada em Trancoso, desde 2016 no Quadrado.</p>
          <div className="home-hero-actions">
            <a href="#pecas-em-destaque" className="ago-premium-hero-cta">Ver peças</a>
            <Link href="/igrejinha-de-trancoso" className="ago-cinematic-secondary">Igrejinhas de Trancoso <span aria-hidden="true">↗</span></Link>
          </div>
        </div>

        <div id="pecas-em-destaque" className="ago-container ago-cinematic-products ago-immersive-reveal">
          <div className="ago-cinematic-products-head">
            <div>
              <p className="eyebrow">Em destaque</p>
              <h2>Destaques da coleção.</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver coleção completa <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-product-grid ago-premium-product-grid-featured commerce-first-grid">
            {featured.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 2} />)}
          </div>
        </div>

        <Benefits />
      </section>

      <ResumeCart />

      <section className="ago-premium-editorial ago-home-story ago-immersive-reveal" aria-labelledby="story-title">
        <div className="ago-container ago-premium-split">
          <div className="ago-premium-image ago-story-image">
            <Image src="/nossa-essencia.jpg" alt="Igrejinhas e peças de cerâmica da Agô no Quadrado de Trancoso" width={1800} height={1800} sizes="(max-width: 900px) 100vw, 56vw" quality={100} className="ago-complementary-photo ago-story-static-photo" />
          </div>
          <div className="ago-premium-copy">
            <svg className="ago-sertao-sun" viewBox="0 0 100 52" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false">
              <path d="M6 44h88M29 44a21 21 0 0 1 42 0M50 4v9M22 14l6 7M78 14l-6 7M7 30l9 3M93 30l-9 3" />
            </svg>
            <p className="eyebrow">No Quadrado</p>
            <h2 id="story-title">Desde 2016, em Trancoso.</h2>
            <p>Cerâmica inspirada nas formas, cores e símbolos do lugar.</p>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-discovery ago-immersive-reveal" aria-labelledby="discover-title">
        <div className="ago-container">
          <div className="ago-premium-section-head">
            <div>
              <p className="eyebrow">A coleção</p>
              <h2 id="discover-title">Escolha por onde entrar.</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver todas as peças <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={item.href ?? `/produtos?categoria=${item.category}`} className="ago-premium-discovery-card">
                <div className="ago-premium-discovery-image">
                  <Image src={item.image} alt="" fill quality={100} sizes="(max-width: 767px) 50vw, 25vw" className="ago-parallax-photo" />
                </div>
                <div className="ago-premium-discovery-copy"><span>{item.title}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ago-shipping-chapter ago-immersive-reveal" aria-labelledby="shipping-title">
        <div className="ago-container ago-shipping-chapter-inner">
          <div>
            <p className="eyebrow">Compra online</p>
            <h2 id="shipping-title">Da Bahia para sua casa.</h2>
          </div>
          <div className="ago-shipping-facts">
            <span>Pagamento seguro</span>
            <span>Frete grátis a partir de R$ 500 em produtos</span>
            <span>Envio para todo o Brasil</span>
          </div>
        </div>
      </section>

      <section className="ago-bahia-visit ago-immersive-reveal py-[clamp(72px,9vw,142px)]" aria-labelledby="visit-title">
        <div className="ago-container grid items-center gap-16 md:grid-cols-[1.35fr_0.65fr] md:gap-20 lg:gap-28">
          <div className="max-w-[680px]">
            <p className="eyebrow mb-4 text-[0.72rem] font-extrabold uppercase tracking-[0.24em]">Se estiver por perto</p>
            <h2 id="visit-title" className="max-w-[640px] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.08] tracking-[-0.03em] text-[#fff8ed]">A gente está no Quadrado.</h2>
            <p className="mt-5 max-w-[420px] text-[clamp(0.92rem,1.2vw,1.05rem)] leading-7 text-[#f1dfce]">Passe para ver as peças de perto.</p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.05em] text-[#fff8ed] transition-opacity hover:opacity-70">Como chegar <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.05em] text-[#fff8ed] transition-opacity hover:opacity-70">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.05em] text-[#fff8ed] transition-opacity hover:opacity-70">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="ago-bahia-wordmark justify-self-start text-center md:justify-self-end" aria-label="Trancoso, Bahia, Brasil">
            <span className="block text-[0.62rem] font-bold uppercase tracking-[0.28em]">Trancoso</span>
            <strong className="my-1 block text-[clamp(3rem,5.8vw,5.4rem)] leading-[0.95] tracking-[-0.035em]">Bahia</strong>
            <span className="block text-[0.6rem] font-bold uppercase tracking-[0.3em]">Brasil</span>
          </div>
        </div>
      </section>
    </div>
  );
}
