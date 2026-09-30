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
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_DOMAIN}/#page`,
    url: SITE_DOMAIN,
    name: 'Agô Trancoso — Igrejinhas do Quadrado e cerâmica artesanal',
    isPartOf: { '@id': `${SITE_DOMAIN}#website` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_DOMAIN}/hero.jpg`,
      contentUrl: `${SITE_DOMAIN}/hero.jpg`,
      caption: 'Cerâmica artesanal da Agô no Quadrado de Trancoso',
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: featured.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: `${SITE_DOMAIN}/produtos/${product.id}`,
      })),
    },
  };

  return (
    <div className="ago-home ago-premium-home ago-home-calm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />

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
        <div className="ago-container ago-storytelling-layout">
          <div className="ago-storytelling-images" aria-label="Agô no Quadrado de Trancoso">
            <div className="ago-storytelling-image ago-storytelling-image-primary">
              <Image src="/nossa-essencia.jpg" alt="Peças de cerâmica da Agô no Quadrado de Trancoso" fill sizes="(max-width: 900px) 100vw, 42vw" quality={100} className="ago-storytelling-photo" />
            </div>
            <div className="ago-storytelling-image ago-storytelling-image-secondary">
              <Image src="/complementar.jpg" alt="Detalhes da banca e das peças de cerâmica da Agô em Trancoso" fill sizes="(max-width: 900px) 54vw, 22vw" quality={100} className="ago-storytelling-photo" />
            </div>
          </div>

          <div className="ago-premium-copy ago-storytelling-copy">
            <p className="eyebrow">No Quadrado</p>
            <h2 id="story-title">Desde 2016, em Trancoso.</h2>
            <p>Peças feitas à mão, inspiradas nas formas, cores e símbolos que fazem parte do lugar.</p>
            <div className="ago-storytelling-links">
              <Link href="/nossa-essencia" className="ago-premium-text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
              <Link href="/produtos" className="ago-premium-text-link ago-premium-text-link-secondary">Ver coleção <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ago-premium-discovery ago-immersive-reveal" aria-labelledby="discover-title">
        <div className="ago-container">
          <div className="ago-premium-section-head">
            <div>
              <p className="eyebrow">A coleção</p>
              <h2 id="discover-title">Escolha por categoria.</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver todas as peças <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={item.href ?? `/produtos?categoria=${item.category}`} className="ago-premium-discovery-card">
                <div className="ago-premium-discovery-image">
                  <Image src={item.image} alt="" fill quality={100} sizes="(max-width: 767px) 50vw, 25vw" className="ago-parallax-photo" />
                  <span className="ago-discovery-veil" aria-hidden="true" />
                </div>
                <div className="ago-premium-discovery-copy"><span>{item.title}</span><i aria-hidden="true">↗</i></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ago-visit-editorial ago-immersive-reveal" aria-labelledby="visit-title">
        <div className="ago-container ago-visit-editorial-grid">
          <div className="ago-visit-editorial-media">
            <Image src="/complementar.jpg" alt="Banca da Agô no Quadrado de Trancoso" fill sizes="(max-width: 900px) 100vw, 52vw" quality={100} className="ago-visit-editorial-photo" />
          </div>

          <div className="ago-visit-editorial-copy">
            <p className="eyebrow">Trancoso · Bahia</p>
            <h2 id="visit-title">A gente está no Quadrado.</h2>
            <p>Passe para ver as peças de perto.</p>
            <div className="ago-visit-editorial-links">
              <a className="ago-visit-primary" href={mapsUrl} target="_blank" rel="noreferrer">Como chegar <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
            <p className="ago-visit-address">Quadrado de Trancoso · Porto Seguro · Bahia</p>
          </div>
        </div>
      </section>
    </div>
  );
}
