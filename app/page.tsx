import Link from 'next/link';
import Image from 'next/image';
import Benefits from '@/components/Benefits';
import HomeInteractiveCollection from '@/components/HomeInteractiveCollection';
import { getAvailableProducts } from '@/lib/products';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const homeOrder = [
  'divino-espirito-santo',
  'terco-em-ceramica',
  'esfera-decorativa',
  'nossa-senhora-aparecida',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
  'casal-pretos-velhos',
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'cruzeiro-do-quadrado',
  'estatueta-iemanja',
  'igrejinha-luminaria-trancoso',
  'casinha-luminaria',
  'presepio-em-ceramica',
  'miniatura-quadrado-trancoso',
  'mobile-trancoso',
  'nossa-senhora-grande',
  'rosario-trancoso',
];

const categories = [
  {
    title: 'Trancoso',
    subtitle: 'O começo de tudo',
    href: '/produtos?categoria=trancoso',
    image: '/produtos/miniatura-quadrado-trancoso.jpg',
  },
  {
    title: 'Casa',
    subtitle: 'Objetos para conviver',
    href: '/produtos?categoria=decoracao',
    image: '/produtos/casinha-luminaria.jpg',
  },
  {
    title: 'Fé',
    subtitle: 'Símbolos que acompanham',
    href: '/produtos?categoria=fe-devocao',
    image: '/produtos/nossa-senhora-aparecida.jpg',
  },
  {
    title: 'Presentes',
    subtitle: 'Para levar de Trancoso',
    href: '/produtos?categoria=presentes',
    image: '/produtos/colar-igreja-quadrado.jpg',
  },
];

export default function HomePage() {
  const available = getAvailableProducts();
  const order = new Map(homeOrder.map((id, index) => [id, index]));
  const products = [...available].sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));

  return (
    <div className="ago-home ago-immersive-home">
      <HomeInteractiveCollection products={products} />

      <div className="ago-real-trust" aria-label="Condições da loja">
        <div className="ago-container ago-real-trust-inner">
          <span>3% OFF na primeira compra</span>
          <i aria-hidden="true" />
          <span>Frete grátis acima de R$ 500</span>
          <i aria-hidden="true" />
          <span>Envio para todo o Brasil</span>
          <i aria-hidden="true" />
          <span>Exterior sob consulta</span>
        </div>
      </div>

      <section className="ago-immersive-hero" aria-labelledby="home-hero-title">
        <div className="ago-immersive-hero-media">
          <Image
            src="/hero.jpg"
            alt="Atmosfera de Trancoso e peças da Agô"
            fill
            sizes="(max-width: 900px) 100vw, 68vw"
            quality={92}
          />
        </div>
        <div className="ago-immersive-hero-copy">
          <p className="eyebrow">Trancoso em cada detalhe</p>
          <h2 id="home-hero-title">Tem lugar que continua com a gente.</h2>
          <p>Nas fachadas, nas cores, na fé e nos objetos que escolhemos manter por perto.</p>
          <Link href="/produtos?categoria=trancoso" className="ago-hero-link">
            Ver peças de Trancoso <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className="ago-home-categories" aria-labelledby="home-categories-title">
        <div className="ago-container">
          <div className="ago-home-section-head">
            <div>
              <p className="eyebrow">Explore a coleção</p>
              <h2 id="home-categories-title">Por onde você quer começar?</h2>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver toda a coleção <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-home-category-grid">
            {categories.map((category) => (
              <Link key={category.title} href={category.href} className="ago-home-category-card">
                <Image src={category.image} alt="" fill sizes="(max-width: 700px) 50vw, 25vw" />
                <div className="ago-home-category-copy">
                  <div>
                    <small>{category.subtitle}</small>
                    <strong>{category.title}</strong>
                  </div>
                  <span aria-hidden="true">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Benefits />

      <section className="ago-home-story-refined" aria-labelledby="home-story-title">
        <div className="ago-container ago-home-story-grid">
          <div className="ago-home-story-image">
            <Image
              src="/nossa-essencia.jpg"
              alt="Universo visual da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
              quality={92}
            />
          </div>
          <div className="ago-home-story-copy">
            <p className="eyebrow">A Agô</p>
            <h2 id="home-story-title">Começou no Quadrado.</h2>
            <p>Trancoso guia boa parte do nosso olhar. A partir dali, a coleção também percorre a casa, a fé, os presentes e outros símbolos brasileiros.</p>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-home-visit-refined" aria-labelledby="home-visit-title">
        <div className="ago-container ago-home-visit-grid">
          <div>
            <p className="eyebrow">No Quadrado</p>
            <h2 id="home-visit-title">Veja as peças de perto.</h2>
            <p>Se estiver em Trancoso, passe na nossa banca no Quadrado.</p>
            <div className="ago-home-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Como chegar ↗</a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp ↗</a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>
            </div>
          </div>
          <div className="ago-home-place-mark" aria-hidden="true">
            <span>Trancoso</span>
            <strong>Bahia</strong>
            <span>Brasil</span>
          </div>
        </div>
      </section>
    </div>
  );
}
