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

const moreOrder = [
  'colar-igreja-quadrado',
  'esfera-decorativa',
  'terco-em-ceramica',
  'presepio-em-ceramica',
];

const discovery = [
  {
    title: 'Trancoso',
    subtitle: 'Nosso maior repertório',
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
    subtitle: 'Para alguém que veio à cabeça',
    category: 'presentes',
    image: '/produtos/colar-igreja-quadrado.jpg',
  },
];

export default function HomePage() {
  const available = getAvailableProducts();
  const byId = new Map(available.map((product) => [product.id, product]));
  const pick = (ids: string[]) => ids
    .map((id) => byId.get(id) ?? getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  const featured = pick(featuredOrder);
  const moreProducts = pick(moreOrder);

  return (
    <div className="home-page attention-home">
      <section className="home-featured home-featured-first section-space" aria-labelledby="featured-title">
        <div className="site-container">
          <div className="section-heading section-heading-wide">
            <div>
              <p className="eyebrow">Escolhas da Agô</p>
              <h1 id="featured-title" className="display-title">As que puxam o olhar.</h1>
            </div>
            <div className="section-heading-aside">
              <p>Se alguma fez você parar, comece por ela.</p>
              <Link href="/produtos" className="text-link">Ver todas <span aria-hidden="true">↗</span></Link>
            </div>
          </div>

          <div className="product-grid product-grid-featured">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-hero" aria-labelledby="home-hero-title">
        <Image
          src="/hero.jpg"
          alt="Peças da Agô Trancoso"
          fill
          sizes="100vw"
          className="home-hero-image"
          quality={90}
        />
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="site-container home-hero-inner">
          <div className="home-hero-copy">
            <p className="eyebrow eyebrow-light">Objetos brasileiros · desde 2016</p>
            <h2 id="home-hero-title">
              <span>Você olha.</span>
              <span>Depois olha de novo.</span>
            </h2>
            <p className="home-hero-lead">
              A Agô nasce no Quadrado e vai além dele: formas para casa, fé, presente e pequenos achados com o Brasil sempre por perto.
            </p>
            <div className="home-hero-actions">
              <Link href="/produtos" className="button button-light">Ver as peças</Link>
              <Link href="/produtos?categoria=trancoso" className="text-link text-link-light">Ir direto a Trancoso <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="home-hero-signature" aria-label="Características da Agô Trancoso">
            <span>Quadrado · Bahia</span>
            <span>mão e matéria</span>
            <span>envios pelo Brasil</span>
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
          <span>Exterior sob consulta</span>
        </div>
      </div>

      <section className="home-discovery section-space" aria-labelledby="discovery-title">
        <div className="site-container">
          <div className="section-heading section-heading-wide">
            <div>
              <p className="eyebrow">Quatro caminhos</p>
              <h2 id="discovery-title" className="display-title">Por onde você quer entrar?</h2>
            </div>
            <div className="section-heading-aside">
              <p>O Quadrado é nosso maior repertório. O resto da coleção abre outras portas.</p>
              <Link href="/produtos" className="text-link">Explorar tudo <span aria-hidden="true">↗</span></Link>
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
                  {item.primary && <span className="attention-primary-label">Comece aqui</span>}
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

      <section className="home-more-products section-space" aria-labelledby="more-products-title">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Continue olhando</p>
              <h2 id="more-products-title" className="display-title">Tem mais por aqui.</h2>
            </div>
            <Link href="/produtos" className="text-link">Abrir a coleção <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="product-grid home-more-products-grid">
            {moreProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
              alt="Universo visual da Agô"
              fill
              sizes="(max-width: 900px) 100vw, 52vw"
              className="home-story-image"
              quality={88}
            />
            <span className="home-story-caption">Quadrado · Bahia</span>
          </div>
          <div className="home-story-copy">
            <p className="eyebrow">De onde vem</p>
            <h2 id="story-title" className="display-title">Começou no Quadrado.</h2>
            <p>
              O Quadrado é nosso endereço e também nosso maior repertório. Igrejas, fachadas, cores e símbolos aparecem muito — mas não sozinhos. A coleção também passa por fé, casa, presentes e outras referências brasileiras.
            </p>
            <Link href="/nossa-essencia" className="text-link">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="home-statement" aria-label="Manifesto da Agô Trancoso">
        <div className="site-container home-statement-inner">
          <p className="eyebrow eyebrow-light">Casa é escolha</p>
          <blockquote>“Uma casa fica mais nossa aos poucos.”</blockquote>
          <p>Às vezes começa por um objeto.</p>
        </div>
      </section>

      <section className="home-global" aria-labelledby="global-title">
        <div className="site-container home-global-grid">
          <div>
            <p className="eyebrow">Outros destinos</p>
            <h2 id="global-title">Vai mais longe também.</h2>
          </div>
          <div>
            <p>Para fora do Brasil, calculamos cada envio de acordo com o destino e a escolha. Sem peso e medidas confirmados, a cotação é feita manualmente para não prometer um valor errado.</p>
            <a href={internationalWhatsappUrl} target="_blank" rel="noreferrer" className="button button-dark">Consultar envio</a>
          </div>
        </div>
      </section>

      <section className="home-visit" aria-labelledby="visit-title">
        <div className="site-container home-visit-grid">
          <div className="home-visit-copy">
            <p className="eyebrow eyebrow-light">Se estiver por perto</p>
            <h2 id="visit-title">Passe no Quadrado.</h2>
            <p>Veja de perto, sinta as texturas e escolha sem pressa.</p>
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
