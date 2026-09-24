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
  { title: 'Para a casa', subtitle: 'Formas para conviver', category: 'decoracao', image: '/produtos/casinha-luminaria.jpg' },
  { title: 'Para presentear', subtitle: 'Afeto que ganha forma', category: 'presentes', image: '/produtos/colar-igreja-quadrado.jpg' },
  { title: 'Trancoso', subtitle: 'O Quadrado por perto', category: 'trancoso', image: '/produtos/miniatura-quadrado-trancoso.jpg' },
  { title: 'Fé & devoção', subtitle: 'Símbolos que acompanham', category: 'fe-devocao', image: '/produtos/nossa-senhora-grande.jpg' },
];

export default function HomePage() {
  const available = getAvailableProducts();
  const byId = new Map(available.map((product) => [product.id, product]));
  const featured = featuredOrder
    .map((id) => byId.get(id) ?? getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <Image
          src="/hero.jpg"
          alt="Peças de cerâmica da Agô Trancoso"
          fill
          sizes="100vw"
          className="home-hero-image"
          priority
          quality={90}
        />
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="site-container home-hero-inner">
          <div className="home-hero-copy">
            <p className="eyebrow eyebrow-light">Trancoso · Bahia · desde 2016</p>
            <h1 id="home-hero-title">Peças que guardam um lugar.</h1>
            <p className="home-hero-lead">Cerâmicas feitas à mão para levar um pouco da Bahia para a casa, para o presente e para a memória.</p>
            <div className="home-hero-actions">
              <Link href="/produtos" className="button button-light">Conhecer a coleção</Link>
              <Link href="/nossa-essencia" className="text-link text-link-light">A história da Agô <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="home-hero-signature" aria-label="Características da Agô Trancoso">
            <span>feito à mão</span>
            <span>Trancoso, Bahia</span>
            <span>cerâmica brasileira</span>
          </div>
        </div>
      </section>

      <div className="home-trust-ribbon" aria-label="Condições da loja">
        <div className="site-container home-trust-ribbon-inner">
          <span>3% OFF na primeira compra</span>
          <i aria-hidden="true" />
          <span>Frete grátis acima de R$ 500</span>
          <i aria-hidden="true" />
          <span>Pagamento seguro</span>
          <i aria-hidden="true" />
          <span>Envio internacional sob consulta</span>
        </div>
      </div>

      <section className="home-featured section-space" aria-labelledby="featured-title">
        <div className="site-container">
          <div className="section-heading section-heading-wide">
            <div>
              <p className="eyebrow">Seleção Agô</p>
              <h2 id="featured-title" className="display-title">Um pedaço de Trancoso, sem pressa.</h2>
            </div>
            <div className="section-heading-aside">
              <p>Escolhas feitas para morar com você por muito tempo.</p>
              <Link href="/produtos" className="text-link">Ver coleção completa <span aria-hidden="true">↗</span></Link>
            </div>
          </div>

          <div className="product-grid product-grid-featured">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 3} />
            ))}
          </div>
        </div>
      </section>

      <Benefits />

      <section className="home-story section-space" aria-labelledby="story-title">
        <div className="site-container home-story-grid">
          <div className="home-story-image-wrap">
            <Image
              src="/nossa-essencia.jpg"
              alt="Cerâmicas da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
              className="home-story-image"
              quality={88}
            />
            <span className="home-story-caption">Trancoso · Bahia</span>
          </div>
          <div className="home-story-copy">
            <p className="eyebrow">A Agô</p>
            <h2 id="story-title" className="display-title">O que vemos por aqui ganha outra forma.</h2>
            <p>A arquitetura, a fé, as cores, o barro e as lembranças de Trancoso atravessam a coleção. Cada peça nasce desse encontro entre lugar, mão e memória.</p>
            <Link href="/nossa-essencia" className="text-link">Conhecer nossa história <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="home-statement" aria-label="Manifesto da Agô Trancoso">
        <div className="site-container home-statement-inner">
          <p className="eyebrow eyebrow-light">Para guardar perto</p>
          <blockquote>“O que você viveu pode morar com você.”</blockquote>
          <p>Objetos que transformam viagem, afeto e descoberta em presença.</p>
        </div>
      </section>

      <section className="home-discovery section-space" aria-labelledby="discovery-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Encontre pela intenção</p>
              <h2 id="discovery-title" className="display-title">Qual é a sua?</h2>
            </div>
            <Link href="/produtos" className="text-link">Ver tudo <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={`/produtos?categoria=${item.category}`} className="discovery-card">
                <div className="discovery-image-wrap">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 50vw, 25vw" className="discovery-image" />
                </div>
                <div className="discovery-copy">
                  <span>{item.subtitle}</span>
                  <h3>{item.title}</h3>
                  <strong>Explorar <span aria-hidden="true">↗</span></strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-global" aria-labelledby="global-title">
        <div className="site-container home-global-grid">
          <div>
            <p className="eyebrow">Do Quadrado para o mundo</p>
            <h2 id="global-title">Viu de longe e se apaixonou?</h2>
          </div>
          <div>
            <p>Fazemos cotações de envio internacional conforme o destino e as peças escolhidas. Como cada envio de cerâmica exige cuidado, o frete é confirmado individualmente.</p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="button button-dark">Consultar envio internacional</a>
          </div>
        </div>
      </section>

      <section id="como-comprar" className="home-how section-space" aria-labelledby="how-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sem complicação</p>
              <h2 id="how-title" className="display-title">Da escolha até a sua casa.</h2>
            </div>
          </div>
          <div className="home-how-grid">
            <article><span>01</span><h3>Escolha</h3><p>Descubra a peça que chamou seu olhar.</p></article>
            <article><span>02</span><h3>Finalize</h3><p>Adicione ao carrinho e conclua seus dados com segurança.</p></article>
            <article><span>03</span><h3>Receba</h3><p>Seu pedido segue preparado com cuidado para chegar até você.</p></article>
          </div>
        </div>
      </section>

      <section className="home-visit" aria-labelledby="visit-title">
        <div className="site-container home-visit-grid">
          <div className="home-visit-copy">
            <p className="eyebrow eyebrow-light">Em Trancoso</p>
            <h2 id="visit-title">A Agô está no Quadrado.</h2>
            <p>Passe para ver as peças de perto, sentir as texturas e escolher com calma.</p>
            <div className="home-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Como chegar <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="home-visit-mark" aria-hidden="true">
            <span>Trancoso</span>
            <strong>BA</strong>
            <span>Brasil</span>
          </div>
        </div>
      </section>
    </div>
  );
}
