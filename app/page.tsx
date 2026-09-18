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
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'casinha-luminaria',
  'miniatura-quadrado-trancoso',
  'cruzeiro-do-quadrado',
  'mobile-trancoso',
];

export default function HomePage() {
  const available = getAvailableProducts();
  const featured = featuredOrder
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.available));

  return (
    <div className="ago-home ago-clean-home">
      <section id="colecao" className="ago-clean-collection">
        <div className="ago-clean-container">
          <div className="ago-clean-collection-head">
            <div>
              <p className="eyebrow">A coleção</p>
              <h1>Peças que ficam.</h1>
            </div>
            <p>
              Cerâmicas feitas à mão, inspiradas na Bahia, em Trancoso e nas formas que
              fazem parte do nosso jeito brasileiro de viver.
            </p>
          </div>

          <div className="ago-clean-product-grid">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>

          <div className="ago-clean-collection-foot">
            <span>{available.length} peças na coleção</span>
            <Link href="/produtos">Ver coleção completa <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <nav className="ago-clean-category-nav" aria-label="Categorias da coleção">
        <div className="ago-clean-container ago-clean-category-inner">
          <span>Escolha por perto</span>
          <div>
            <Link href="/produtos?categoria=trancoso">Trancoso</Link>
            <Link href="/produtos?categoria=igrejinhas">Igrejinhas</Link>
            <Link href="/produtos?categoria=decoracao">Decoração</Link>
            <Link href="/produtos?categoria=fe-devocao">Fé e devoção</Link>
            <Link href="/produtos?categoria=presentes">Presentes</Link>
          </div>
        </div>
      </nav>

      <section className="ago-clean-hero">
        <Image src="/hero.jpg" alt="Peças de cerâmica da Agô Trancoso" fill sizes="100vw" className="ago-clean-hero-image" priority />
        <div className="ago-clean-hero-overlay" />
        <div className="ago-clean-container ago-clean-hero-content">
          <p className="eyebrow">Agô Trancoso</p>
          <h2>FEITO À MÃO.<br />FEITO PARA DURAR.</h2>
          <p>Peças para levar a Bahia para dentro de casa.<br />Um jeito brasileiro de morar.</p>
          <div className="ago-clean-actions">
            <Link href="/produtos" className="ago-clean-button ago-clean-button-light">Ver coleção</Link>
            <Link href="/nossa-essencia" className="ago-clean-text-link">Conheça a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-clean-edit">
        <div className="ago-clean-container ago-clean-edit-grid">
          <div className="ago-clean-edit-image">
            <Image src="/complementar.jpg" alt="Igrejinhas de cerâmica da Agô Trancoso" fill sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
          <div className="ago-clean-edit-copy">
            <p className="eyebrow">Da Bahia para sua casa</p>
            <h2>Uma peça pode mudar o lugar onde você olha.</h2>
            <p>
              Igrejinhas, imagens, pequenas arquiteturas e formas para decorar,
              presentear e guardar — escolhidas para ter presença sem excesso.
            </p>
            <Link href="/produtos" className="ago-clean-dark-link">Escolher uma peça <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <Benefits />

      <section className="ago-clean-visit">
        <div className="ago-clean-container ago-clean-visit-grid">
          <div>
            <p className="eyebrow">Visite a Agô</p>
            <h2>Chegou ao Quadrado?<br />Procure a Agô.</h2>
            <p>Nossa banca fica no Quadrado de Trancoso. Para localizar uma peça ou conversar com a gente, fale pelo WhatsApp ou Instagram.</p>
            <div className="ago-clean-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Google Maps <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="ago-clean-visit-note">
            <span>Entrega</span>
            <strong>Frete fixo de R$ 39,90</strong>
            <p>Grátis a partir de R$ 500.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
