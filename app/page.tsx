import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import Benefits from '@/components/Benefits';
import { getAvailableProducts, getProductById } from '@/lib/products';

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';
const internationalWhatsappUrl = 'https://wa.me/557398558124?text=Ol%C3%A1!%20Gostaria%20de%20consultar%20um%20envio%20internacional%20da%20Ag%C3%B4%20Trancoso.';

const openingOrder = [
  'igreja-quadrado-p',
  'miniatura-quadrado-trancoso',
  'casinha-luminaria',
  'colar-igreja-quadrado',
  'estatueta-iemanja',
  'cruzeiro-do-quadrado',
  'esfera-decorativa',
];

const moreOrder = [
  'igreja-quadrado-m',
  'nossa-senhora-aparecida',
  'terco-em-ceramica',
  'presepio-em-ceramica',
  'ima-igrejinha-trancoso',
  'divino-espirito-santo',
  'casal-pretos-velhos',
  'igrejinha-luminaria-trancoso',
];

const categories = [
  {
    title: 'Trancoso',
    eyebrow: 'O ponto de partida',
    href: '/produtos?categoria=trancoso',
    image: '/produtos/miniatura-quadrado-trancoso.jpg',
  },
  {
    title: 'Casa',
    eyebrow: 'Objetos para conviver',
    href: '/produtos?categoria=decoracao',
    image: '/produtos/casinha-luminaria.jpg',
  },
  {
    title: 'Fé',
    eyebrow: 'Símbolos que acompanham',
    href: '/produtos?categoria=fe-devocao',
    image: '/produtos/nossa-senhora-grande.jpg',
  },
  {
    title: 'Presentes',
    eyebrow: 'Para levar e dar',
    href: '/produtos?categoria=presentes',
    image: '/produtos/colar-igreja-quadrado.jpg',
  },
];

export default function HomePage() {
  const available = getAvailableProducts();
  const byId = new Map(available.map((product) => [product.id, product]));
  const pick = (ids: string[]) => ids
    .map((id) => byId.get(id) ?? getProductById(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product?.available));

  const opening = pick(openingOrder);
  const moreProducts = pick(moreOrder);

  return (
    <div className="atelier-home">
      <section className="atelier-opening" aria-labelledby="opening-title">
        <div className="site-container atelier-opening-head">
          <div>
            <p className="eyebrow">Agô · Trancoso, Bahia</p>
            <h1 id="opening-title">Peças para escolher com os olhos.</h1>
          </div>
          <Link href="/produtos" className="text-link">Ver a coleção inteira <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="site-container atelier-product-grid">
          {opening.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </section>

      <section className="atelier-hero" aria-labelledby="atelier-hero-title">
        <Image
          src="/hero.jpg"
          alt="Universo visual da Agô Trancoso"
          fill
          sizes="100vw"
          className="atelier-hero-image"
          quality={90}
        />
        <div className="site-container atelier-hero-copy">
          <p className="eyebrow eyebrow-light">Trancoso está aqui. O Brasil também.</p>
          <h2 id="atelier-hero-title">Tem coisa que a gente vê e já imagina em casa.</h2>
          <p>A Agô começa no Quadrado, mas não termina nele. A coleção passa por casa, fé, presente e outros símbolos brasileiros.</p>
          <Link href="/nossa-essencia" className="text-link text-link-light">Conhecer a Agô <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <div className="atelier-strip" aria-label="Condições da loja">
        <div className="site-container atelier-strip-inner">
          <span>3% OFF na primeira compra</span>
          <span>Frete grátis acima de R$ 500</span>
          <span>Pagamento seguro</span>
          <span>Exterior sob consulta</span>
        </div>
      </div>

      <section className="atelier-categories" aria-labelledby="categories-title">
        <div className="site-container">
          <div className="atelier-section-head">
            <div>
              <p className="eyebrow">Por universo</p>
              <h2 id="categories-title">Comece por onde der vontade.</h2>
            </div>
            <Link href="/produtos" className="text-link">Tudo por aqui <span aria-hidden="true">↗</span></Link>
          </div>

          <div className="atelier-category-grid">
            {categories.map((category) => (
              <Link key={category.href} href={category.href} className="atelier-category">
                <Image src={category.image} alt={category.title} fill sizes="(max-width: 900px) 50vw, 28vw" />
                <div className="atelier-category-copy">
                  <span>{category.eyebrow}</span>
                  <h3>{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="atelier-more" aria-labelledby="more-title">
        <div className="site-container">
          <div className="atelier-section-head">
            <div>
              <p className="eyebrow">Mais da coleção</p>
              <h2 id="more-title">Continue olhando.</h2>
            </div>
          </div>
          <div className="atelier-more-grid">
            {moreProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <Benefits />

      <section className="atelier-world" aria-labelledby="world-title">
        <div>
          <p className="eyebrow eyebrow-light">Da Bahia para outros lugares</p>
          <h2 id="world-title">A Agô vai junto.</h2>
          <p>Enviamos pelo Brasil. Para outros países, a cotação é feita conforme o destino e as peças escolhidas, sem inventar peso ou medida.</p>
          <a href={internationalWhatsappUrl} target="_blank" rel="noreferrer" className="text-link text-link-light">Consultar envio internacional <span aria-hidden="true">↗</span></a>
        </div>
        <div className="atelier-world-side">
          <p className="eyebrow eyebrow-light">Em Trancoso</p>
          <h2>Veja de perto.</h2>
          <p>Nossa banca fica no Quadrado. Se estiver por aqui, passe para escolher sem pressa.</p>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-link text-link-light">Abrir no mapa <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}
