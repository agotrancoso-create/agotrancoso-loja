import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const whatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20Ag%C3%B4%20Trancoso.';
const internationalWhatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20um%20envio%20internacional%20da%20Ag%C3%B4%20Trancoso.';
const instagramUrl = 'https://www.instagram.com/agotrancoso';

const featuredOrder = [
  'igreja-quadrado-p',
  'miniatura-quadrado-trancoso',
  'casinha-luminaria',
  'cruzeiro-do-quadrado',
  'estatueta-iemanja',
  'nossa-senhora-aparecida',
];

const discovery = [
  {
    title: 'Trancoso',
    subtitle: 'Nossa principal inspiração',
    category: 'trancoso',
    image: '/produtos/miniatura-quadrado-trancoso.jpg',
    primary: true,
  },
  {
    title: 'Casa & decoração',
    subtitle: 'Objetos para conviver',
    category: 'decoracao',
    image: '/produtos/casinha-luminaria.jpg',
  },
  {
    title: 'Fé & devoção',
    subtitle: 'Símbolos que acompanham',
    category: 'fe-devocao',
    image: '/produtos/nossa-senhora-grande.jpg',
  },
  {
    title: 'Presentes',
    subtitle: 'Afeto que ganha forma',
    category: 'presentes',
    image: '/produtos/colar-igreja-quadrado.jpg',
  },
];

export default function HomePage() {
  const available = getAvailableProducts();
  const byId = new Map(available.map((product) => [product.id, product]));
  const featured = featuredOrder
    .map((id) => byId.get(id) ?? getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  return (
    <div className="home-page attention-home">
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
            <p className="eyebrow eyebrow-light">Cerâmica brasileira · Trancoso, Bahia · desde 2016</p>
            <h1 id="home-hero-title">
              <span>Tem peça que chama o olhar.</span>
              <span>Tem peça que fica.</span>
            </h1>
            <p className="home-hero-lead">
              Trancoso é a principal origem da Agô — sua arquitetura, fé, cor e memória. A coleção também percorre a casa, a devoção, os presentes e outros símbolos brasileiros.
            </p>
            <div className="home-hero-actions">
              <Link href="/produtos" className="button button-light">Descobrir a coleção</Link>
              <Link href="/produtos?categoria=trancoso" className="text-link text-link-light">Começar por Trancoso <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="home-hero-signature" aria-label="Características da Agô Trancoso">
            <span>Trancoso como origem</span>
            <span>feito à mão</span>
            <span>Brasil em cerâmica</span>
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

      <section className="home-discovery home-discovery-first section-space" aria-labelledby="discovery-title">
        <div className="site-container">
          <div className="section-heading section-heading-wide">
            <div>
              <p className="eyebrow">Comece pelo que faz sentido</p>
              <h2 id="discovery-title" className="display-title">O que chamou você primeiro?</h2>
            </div>
            <div className="section-heading-aside">
              <p>Trancoso ocupa o centro da Agô, mas não precisa ser o único caminho para encontrar uma peça sua.</p>
              <Link href="/produtos" className="text-link">Ver toda a coleção <span aria-hidden="true">↗</span></Link>
            </div>
          </div>

          <div className="discovery-grid attention-discovery-grid">
            {discovery.map((item) => (
              <Link
                key={item.category}
                href={`/produtos?categoria=${item.category}`}
                className={`discovery-card${item.primary ? ' is-primary' : ''}`}
              >
                <div className="discovery-image-wrap">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 700px) 50vw, 25vw"
                    className="discovery-image"
                  />
                  {item.primary && <span className="attention-primary-label">Principal inspiração</span>}
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

      <section className="home-featured section-space" aria-labelledby="featured-title">
        <div className="site-container">
          <div className="section-heading section-heading-wide">
            <div>
              <p className="eyebrow">Seleção Agô</p>
              <h2 id="featured-title" className="display-title">Peças que definem a nossa linguagem.</h2>
            </div>
            <div className="section-heading-aside">
              <p>Uma curadoria curta para deixar cada peça respirar — e tornar a escolha mais simples.</p>
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
            <p className="eyebrow">A identidade da Agô</p>
            <h2 id="story-title" className="display-title">Trancoso é origem. Não é limite.</h2>
            <p>
              É de Trancoso que vem a maior parte do nosso repertório visual: o Quadrado, a igreja, as casas, as cores e a fé. A partir daí, a Agô também percorre outros símbolos brasileiros, objetos para casa, devoção e presentes. O fio que une tudo é o mesmo: mão, memória e presença.
            </p>
            <Link href="/nossa-essencia" className="text-link">Entender a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="home-statement" aria-label="Manifesto da Agô Trancoso">
        <div className="site-container home-statement-inner">
          <p className="eyebrow eyebrow-light">Para ficar na memória</p>
          <blockquote>“Algumas coisas passam. Outras encontram um lugar na casa.”</blockquote>
          <p>A peça certa não precisa gritar. Ela chama, aproxima e continua ali.</p>
        </div>
      </section>

      <section className="home-global" aria-labelledby="global-title">
        <div className="site-container home-global-grid">
          <div>
            <p className="eyebrow">Da Bahia para o mundo</p>
            <h2 id="global-title">Viu de longe e quis trazer para perto?</h2>
          </div>
          <div>
            <p>Fazemos cotações de envio internacional conforme o destino e as peças escolhidas. Como cada envio de cerâmica exige cuidado, o frete é confirmado individualmente.</p>
            <a href={internationalWhatsappUrl} target="_blank" rel="noreferrer" className="button button-dark">Consultar envio internacional</a>
          </div>
        </div>
      </section>

      <section id="como-comprar" className="home-how section-space" aria-labelledby="how-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Sem excesso de etapas</p>
              <h2 id="how-title" className="display-title">Escolher deve ser simples.</h2>
            </div>
          </div>
          <div className="home-how-grid">
            <article><span>01</span><h3>Descubra</h3><p>Comece pela categoria ou pela peça que chamou seu olhar.</p></article>
            <article><span>02</span><h3>Escolha</h3><p>Veja detalhes, adicione à sacola e conclua seus dados com segurança.</p></article>
            <article><span>03</span><h3>Receba</h3><p>Seu pedido segue preparado com cuidado para chegar até você.</p></article>
          </div>
        </div>
      </section>

      <section className="home-visit" aria-labelledby="visit-title">
        <div className="site-container home-visit-grid">
          <div className="home-visit-copy">
            <p className="eyebrow eyebrow-light">Nossa casa em Trancoso</p>
            <h2 id="visit-title">A Agô está no Quadrado.</h2>
            <p>É aqui que nossa principal inspiração encontra as pessoas de perto. Passe para ver as peças, sentir as texturas e escolher com calma.</p>
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
