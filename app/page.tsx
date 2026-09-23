import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAllCategories, getAvailableProducts, getProductById } from '@/lib/products';

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

export default function HomePage() {
  const available = getAvailableProducts();
  const categories = getAllCategories();
  const featured = featuredOrder
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.available));

  return (
    <div className="ago-home ago-neuro-home">
      <section id="colecao" className="ago-neuro-collection" aria-labelledby="collection-title">
        <div className="ago-container ago-neuro-container">
          <div className="ago-neuro-kicker">
            <p className="eyebrow">A coleção</p>
            <span>Trancoso · Bahia · Brasil</span>
          </div>

          <div className="ago-neuro-collection-head">
            <div>
              <h1 id="collection-title">Peças para levar a Bahia para dentro de casa.</h1>
              <p>Feitas à mão, inspiradas no que a gente vê, vive e guarda de Trancoso.</p>
            </div>
            <Link href="/produtos" className="ago-neuro-inline-link">
              Ver todas as peças <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="ago-neuro-product-grid">
            {featured.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>

          <div className="ago-neuro-collection-foot">
            <span>{available.length} peças na coleção</span>
            <Link href="/produtos">Explorar a coleção completa <span aria-hidden="true">↗</span></Link>
          </div>

          <nav className="ago-neuro-category-nav" aria-label="Escolher por categoria">
            <span>Escolher por categoria</span>
            <div>
              {categories.map((category) => (
                <Link key={category.id} href={`/produtos?categoria=${category.id}`}>
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <div className="ago-neuro-trust" aria-label="Informações de compra">
        <div className="ago-neuro-trust-inner">
          <span>Feitas à mão</span>
          <i aria-hidden="true" />
          <span>Envio para todo o Brasil</span>
          <i aria-hidden="true" />
          <span>Pagamento pela InfinitePay</span>
        </div>
      </div>

      <section className="ago-neuro-hero" aria-labelledby="hero-title">
        <Image
          src="/hero.jpg"
          alt="Peças de cerâmica da Agô Trancoso"
          fill
          sizes="100vw"
          className="ago-neuro-hero-image"
          priority
        />
        <div className="ago-neuro-hero-overlay" />
        <div className="ago-container ago-neuro-hero-content">
          <p className="eyebrow">Agô Trancoso</p>
          <h2 id="hero-title">FEITO À MÃO.<br />FEITO PARA DURAR.</h2>
          <p>Peças para levar a Bahia para dentro de casa.</p>
          <Link href="/produtos" className="ago-neuro-primary-button">Ver coleção</Link>
        </div>
      </section>

      <section className="ago-neuro-edit" aria-labelledby="edit-title">
        <div className="ago-container ago-neuro-split">
          <div className="ago-neuro-image">
            <Image
              src="/complementar.jpg"
              alt="Igrejinhas de cerâmica da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 56vw"
              quality={92}
              className="ago-complementary-photo"
            />
          </div>
          <div className="ago-neuro-copy">
            <p className="eyebrow">Da Bahia para sua casa</p>
            <h2 id="edit-title">Uma peça pode mudar o lugar onde você olha.</h2>
            <p>Igrejinhas, imagens e formas que a gente gosta de ter por perto — para decorar, presentear ou guardar.</p>
            <Link href="/produtos" className="ago-neuro-text-link">Escolher uma peça <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <Benefits />

      <section className="ago-neuro-essence" aria-labelledby="essence-title">
        <div className="ago-container ago-neuro-split ago-neuro-split-reverse">
          <div className="ago-neuro-image">
            <Image
              src="/nossa-essencia.jpg"
              alt="Peças de cerâmica da Agô Trancoso"
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>
          <div className="ago-neuro-copy">
            <p className="eyebrow">A Agô</p>
            <h2 id="essence-title">O encanto de Trancoso.</h2>
            <p>A arquitetura, o barro, a fé e as lembranças desse lugar aparecem nas formas e nos detalhes de cada peça.</p>
            <Link href="/nossa-essencia" className="ago-neuro-text-link">Conheça a Agô <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="ago-neuro-how" aria-labelledby="how-title">
        <div className="ago-container ago-neuro-how-inner">
          <div className="ago-neuro-section-head">
            <p className="eyebrow">Como comprar</p>
            <h2 id="how-title">Escolha com calma.<br />A gente cuida do resto.</h2>
          </div>

          <div className="ago-neuro-how-grid">
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

          <Link href="/produtos" className="ago-neuro-primary-button ago-neuro-how-button">Ver produtos</Link>
        </div>
      </section>

      <section className="ago-neuro-visit" aria-labelledby="visit-title">
        <div className="ago-container ago-neuro-visit-grid">
          <div>
            <p className="eyebrow">Visite a Agô</p>
            <h2 id="visit-title">Chegou ao Quadrado?<br />Procure a Agô.</h2>
            <p>Nossa banca fica no Quadrado de Trancoso. Para ver uma peça de perto ou falar com a gente, é só chamar pelo WhatsApp ou Instagram.</p>
            <div className="ago-neuro-visit-links">
              <a href={mapsUrl} target="_blank" rel="noreferrer">Google Maps <span aria-hidden="true">↗</span></a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div className="ago-neuro-delivery">
            <span>Entrega</span>
            <strong>Frete fixo de R$ 39,90</strong>
            <p>Grátis acima de R$ 500.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
