import type { Metadata } from 'next';
import Link from 'next/link';
import Image from '@/components/ProductImage';
import ProductCard from '@/components/ProductCard';
import { getAvailableProducts } from '@/lib/products';
import { sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';
import ResumeCart from '@/components/ResumeCart';
import Benefits from '@/components/Benefits';
import buyStyles from './home-how-to-buy.module.css';

export const metadata: Metadata = {
  title: { absolute: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso' },
  description: 'Igrejinhas de Trancoso em cerâmica, peças inspiradas na Igreja do Quadrado e uma seleção de artesanato em cerâmica disponível na Agô, no Quadrado de Trancoso, Bahia.',
  alternates: { canonical: '/' },
  openGraph: {
    images: [{
      url: '/hero.jpg',
      alt: 'Peças de cerâmica da Agô no Quadrado de Trancoso',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/hero.jpg'],
  },
};

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const discovery = [
  { title: 'Trancoso', category: 'trancoso', href: '/artesanato-em-trancoso', image: '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg' },
  { title: 'Casa & decoração', category: 'decoracao', href: '/decoracao-em-ceramica', image: '/produtos/casinha-luminaria.jpg' },
  { title: 'Fé & devoção', category: 'fe-devocao', image: '/produtos/catalogo/nossa-senhora-grande-2.jpg' },
  { title: 'Presentes', category: 'presentes', href: '/lembrancas-de-trancoso', image: '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg' },
];

const reasons = [
  { label: 'Decorar', href: '/decoracao-em-ceramica' },
  { label: 'Presentear', href: '/lembrancas-de-trancoso' },
  { label: 'Guardar Trancoso', href: '/artesanato-em-trancoso' },
] as const;

const buyingSteps = [
  {
    title: 'Escolha a sua peça',
    copy: 'Veja fotos, preço, medidas e detalhes de cada peça antes de adicionar à sacola.',
  },
  {
    title: 'Finalize no site',
    copy: 'Revise a sacola e conclua o pagamento no checkout, sem depender do WhatsApp para comprar.',
  },
  {
    title: 'Receba em casa',
    copy: 'Enviamos para todo o Brasil. O frete fixo é R$ 39,90 e fica grátis a partir de R$ 500 em produtos.',
  },
] as const;

export default function HomePage() {
  const allProducts = sortProductsByAttention(getAvailableProducts());
  const featured = allProducts.slice(0, 6);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_DOMAIN}/#page`,
        url: SITE_DOMAIN,
        name: 'Agô Trancoso — Igrejinhas do Quadrado e cerâmica artesanal',
        isPartOf: { '@id': `${SITE_DOMAIN}#website` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${SITE_DOMAIN}/hero.jpg`,
          contentUrl: `${SITE_DOMAIN}/hero.jpg`,
          caption: 'Cerâmicas da Agô no Quadrado de Trancoso',
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
      },
    ],
  };

  return (
    <div className="ago-home ago-premium-home ago-home-calm">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />

      <section className="ago-cinematic-commerce ago-home-hero-2026" aria-labelledby="featured-title">
        <div className="ago-cinematic-media" aria-hidden="true">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="ago-cinematic-image ago-home-hero-photo-2026"
            quality={100}
          />
          <div className="ago-cinematic-overlay" />
        </div>

        <div className="ago-container ago-cinematic-copy">
          <p className="eyebrow">Quadrado de Trancoso · Bahia</p>
          <h1 id="featured-title">Trancoso em cerâmica.</h1>
          <p>Peças moldadas à mão, desde 2016 no Quadrado.</p>
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
            <Image
              src="/nossa-essencia.jpg"
              alt="Igrejinhas e peças de cerâmica da Agô no Quadrado de Trancoso"
              width={1800}
              height={1800}
              sizes="(max-width: 900px) 100vw, 56vw"
              quality={100}
              className="ago-complementary-photo ago-story-static-photo"
            />
          </div>
          <div className="ago-premium-copy">
            <svg className="ago-sertao-sun" viewBox="0 0 100 52" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" focusable="false">
              <path d="M6 44h88M29 44a21 21 0 0 1 42 0M50 4v9M22 14l6 7M78 14l-6 7M7 30l9 3M93 30l-9 3" />
            </svg>
            <p className="eyebrow">O encanto de Trancoso</p>
            <h2 id="story-title">Feito à mão, para ficar na memória.</h2>
            <p>Desde 2016, a Agô transforma formas, cores e símbolos de Trancoso em cerâmica para decorar, presentear e guardar uma lembrança do lugar.</p>
            <nav className="ago-story-reasons" aria-label="Escolher pela intenção">
              {reasons.map((reason) => <Link key={reason.label} href={reason.href}>{reason.label} <span aria-hidden="true">↗</span></Link>)}
            </nav>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
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
                  <Image src={item.image} alt={`${item.title} — coleção Agô Trancoso`} fill quality={100} sizes="(max-width: 767px) 50vw, 25vw" className="ago-parallax-photo" />
                </div>
                <div className="ago-premium-discovery-copy"><span>{item.title}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="como-comprar" className={`${buyStyles.section} ago-immersive-reveal`} aria-labelledby="como-comprar-title">
        <div className={`ago-container ${buyStyles.layout}`}>
          <div className={buyStyles.intro}>
            <p className="eyebrow">Compra simples</p>
            <h2 id="como-comprar-title">Como levar uma peça da Agô para casa.</h2>
            <p>Da escolha ao envio, o caminho fica claro sem tirar a atenção da peça.</p>
            <Link href="/produtos" className="ago-premium-text-link">Ver peças <span aria-hidden="true">↗</span></Link>
          </div>
          <ol className={buyStyles.steps}>
            {buyingSteps.map((step, index) => (
              <li key={step.title} className={buyStyles.step}>
                <span className={buyStyles.number}>{String(index + 1).padStart(2, '0')}</span>
                <div className={buyStyles.copy}>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="banca" className="ago-banca-visit ago-immersive-reveal" aria-labelledby="visit-title">
        <div className="ago-container ago-banca-visit-layout">
          <div className="ago-banca-visit-copy">
            <p className="eyebrow">Se estiver por perto</p>
            <h2 id="visit-title">A gente está no Quadrado.</h2>
            <p>Veja as peças de perto na nossa banca, no Quadrado de Trancoso. Para encontrar a Agô, abra a localização no mapa.</p>
            <div className="ago-banca-visit-address" aria-label="Localização da Agô">
              <span aria-hidden="true">⌖</span>
              <div><strong>Quadrado de Trancoso</strong><small>Porto Seguro · Bahia</small></div>
            </div>
            <div className="ago-banca-visit-actions">
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="ago-premium-light-cta">Como chegar</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="ago-premium-text-link">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="ago-premium-text-link">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="ago-banca-visit-gallery" aria-label="Fotografias reais da banca e das peças da Agô no Quadrado de Trancoso">
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="ago-banca-photo ago-banca-photo-wide" aria-label="Abrir a localização da banca no Google Maps">
              <Image
                src="/hero.jpg"
                alt="Peças da Agô expostas no Quadrado de Trancoso"
                fill
                quality={100}
                sizes="(max-width: 760px) 92vw, 40vw"
              />
              <span>Na banca, no Quadrado <b aria-hidden="true">↗</b></span>
            </a>
            <Link href="/igrejinha-de-trancoso" className="ago-banca-photo ago-banca-photo-tall">
              <Image
                src="/complementar.jpg"
                alt="Igrejinha luminária e peças em cerâmica na banca da Agô"
                fill
                quality={100}
                sizes="(max-width: 760px) 72vw, 25vw"
              />
              <span>Ver as igrejinhas <b aria-hidden="true">↗</b></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="ago-home-final-cta ago-immersive-reveal" aria-labelledby="home-final-title">
        <div className="ago-container">
          <div className="ago-home-final-card">
            <Image src="/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg" alt="" fill quality={100} sizes="(max-width: 900px) 92vw, 1180px" className="ago-home-final-photo" />
            <div className="ago-home-final-overlay" aria-hidden="true" />
            <div className="ago-home-final-copy">
              <p className="eyebrow">Da viagem para a casa</p>
              <h2 id="home-final-title">Leve um pouco de Trancoso com você.</h2>
              <p>Escolha uma peça para decorar, presentear ou guardar a memória do lugar.</p>
              <div className="home-hero-actions">
                <Link href="/produtos" className="ago-premium-hero-cta">Escolher minha peça</Link>
                <Link href="/lembrancas-de-trancoso" className="ago-cinematic-secondary">Ver lembranças <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
