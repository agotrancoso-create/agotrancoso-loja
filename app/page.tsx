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
  {
    title: 'Para a casa',
    text: 'Peças para estante, mesa, aparador e cantos que pedem alguma coisa especial.',
    category: 'decoracao',
    image: '/produtos/casinha-luminaria.jpg',
  },
  {
    title: 'Para presentear',
    text: 'Lembranças de Trancoso para levar, oferecer e guardar.',
    category: 'presentes',
    image: '/produtos/colar-igreja-quadrado.jpg',
  },
  {
    title: 'Trancoso',
    text: 'Igrejinhas, o Quadrado e outras formas que fazem parte desse lugar.',
    category: 'trancoso',
    image: '/produtos/miniatura-quadrado-trancoso.jpg',
  },
  {
    title: 'Fé & devoção',
    text: 'Peças ligadas à fé e às imagens que atravessam a nossa coleção.',
    category: 'fe-devocao',
    image: '/produtos/nossa-senhora-grande.jpg',
  },
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
          <div className="ago-premium-section-head">
            <div>
              <p className="eyebrow">A coleção · Trancoso · Bahia · Brasil</p>
              <h1 id="featured-title">Peças para olhar de perto.</h1>
              <p>Uma seleção da Agô para começar por aqui. Feitas à mão, inspiradas no que a gente vê, vive e guarda de Trancoso.</p>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver toda a coleção <span aria-hidden="true">↗</span></Link>
          </div>

          <nav className="ago-collection-quicknav" aria-label="Explorar a coleção por categoria">
            <span>Explorar por</span>
            <Link href="/produtos?categoria=trancoso">Trancoso</Link>
            <Link href="/produtos?categoria=igrejinhas">Igrejinhas</Link>
            <Link href="/produtos?categoria=decoracao">Decoração</Link>
            <Link href="/produtos?categoria=fe-devocao">Fé & devoção</Link>
            <Link href="/produtos?categoria=presentes">Presentes</Link>
          </nav>

          <div className="ago-premium-product-grid ago-premium-product-grid-featured">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>

          <div className="ago-premium-collection-bottom">
            <span>{available.length} peças na coleção</span>
            <Link href="/produtos">Explorar tudo <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <div className="ago-premium-trust" aria-label="Informações da Agô">
        <div className="ago-container ago-premium-trust-inner">
          <span>Feitas à mão</span>
          <i aria-hidden="true" />
          <span>Envio para todo o Brasil</span>
          <i aria-hidden="true" />
          <span>Pagamento pela InfinitePay</span>
        </div>
      </div>

      <section className="ago-premium-hero" aria-labelledby="hero-title">
        <Image
          src="/hero.jpg"
          alt="Peças de cerâmica da Agô Trancoso"
          fill
          sizes="100vw"
          className="ago-premium-hero-image"
          priority
        />
        <div className="ago-premium-hero-overlay" aria-hidden="true" />
        <div className="ago-container ago-premium-hero-content">
          <p className="eyebrow">Agô Trancoso · Bahia · Brasil</p>
          <h2 id="hero-title">Feito à mão.<br />Feito para ficar.</h2>
          <p>Peças que levam um pouco de Trancoso para dentro de casa.</p>
          <Link href="/produtos" className="ago-premium-hero-cta">Ver a coleção</Link>
        </div>
      </section>

      <Benefits />

      <section className="ago-premium-editorial ago-premium-editorial-one" aria-labelledby="edit-title">
        <div className="ago-container ago-premium-split">
          <div className="ago-premium-image">
            <Image
              src="/complementar.jpg"
              alt="Igrejinhas de cerâmica da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
              quality={92}
              className="ago-complementary-photo"
            />
          </div>
          <div className="ago-premium-copy">
            <p className="eyebrow">Da Bahia para sua casa</p>
            <h2 id="edit-title">Uma peça pode mudar o lugar onde você olha.</h2>
            <p>Igrejinhas, imagens e formas que a gente gosta de ter por perto — para decorar, presentear ou guardar.</p>
            <Link href="/produtos" className="ago-premium-text-link">Escolher uma peça <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-essence" aria-labelledby="essence-title">
        <div className="ago-container ago-premium-split ago-premium-split-reverse">
          <div className="ago-premium-image">
            <Image
              src="/nossa-essencia.jpg"
              alt="Peças de cerâmica da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="ago-premium-copy">
            <p className="eyebrow">A Agô</p>
            <h2 id="essence-title">O encanto de Trancoso.</h2>
            <p>A arquitetura, o barro, a fé e as lembranças desse lugar aparecem nas formas e nos detalhes de cada peça.</p>
            <Link href="/nossa-essencia" className="ago-premium-text-link">Conheça a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-premium-discovery" aria-labelledby="discover-title">
        <div className="ago-container">
          <div className="ago-premium-section-head">
            <div>
              <p className="eyebrow">Explore a coleção</p>
              <h2 id="discover-title">Encontre o que combina com você.</h2>
              <p>Comece pela ocasião, pelo lugar ou pelo jeito que você quer levar a Agô para casa.</p>
            </div>
            <Link href="/produtos" className="ago-premium-text-link">Ver tudo <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="ago-premium-discovery-grid">
            {discovery.map((item) => (
              <Link key={item.category} href={'/produtos?categoria=' + item.category} className="ago-premium-discovery-card">
                <div className="ago-premium-discovery-image">
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 767px) 50vw, 25vw" />
                </div>
                <div className="ago-premium-discovery-copy">
                  <span>{item.title}</span>
                  <p>{item.text}</p>
                  <strong>Explorar <span aria-hidden="true">↗</span></strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="como-comprar" className="ago-premium-how" aria-labelledby="how-title">
        <div className="ago-container">
          <div className="ago-premium-section-head ago-premium-how-head">
            <div>
              <p className="eyebrow">Como comprar</p>
              <h2 id="how-title">Escolha com calma.<br />A gente cuida do resto.</h2>
            </div>
          </div>

          <div className="ago-premium-how-grid">
            <article>
              <span>01</span>
              <h3>Escolha sua peça</h3>
              <p>Veja as fotos, conheça os detalhes e encontre a peça que combina com você.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Adicione ao carrinho</h3>
              <p>Revise seu pedido e preencha os dados de entrega de forma simples.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Receba em casa</h3>
              <p>Pagamento pela InfinitePay e envio da sua peça com todo o cuidado.</p>
            </article>
          </div>

          <Link href="/produtos" className="ago-premium-dark-cta">Explorar a coleção</Link>
        </div>
      </section>

      <section className="ago-premium-visit" aria-labelledby="visit-title">
        <div className="ago-container ago-premium-visit-grid">
          <div>
            <p className="eyebrow">Visite a Agô</p>
            <h2 id="visit-title">Chegou ao Quadrado?<br />Procure a Agô.</h2>
            <p>Nossa banca fica no Quadrado de Trancoso. Para ver uma peça de perto ou falar com a gente, é só chamar.</p>
            <div className="ago-premium-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Google Maps <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="ago-premium-visit-mark">
            <span>Trancoso</span>
            <strong>Bahia</strong>
            <span>Brasil</span>
          </div>
        </div>
      </section>
    </div>
  );
}
