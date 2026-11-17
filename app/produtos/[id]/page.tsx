import ProductShare from '@/components/ProductShare';
import '../../product-decision-clarity.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, getAvailableProducts, getEffectivePrice, getProductById } from '@/lib/products';
import { getAttentionOrderedImages, getRelatedProductIds, sortProductsByAttention } from '@/lib/merchandising';
import { SITE_DOMAIN, whatsappLink } from '@/lib/config';
import { getShippingPrice } from '@/lib/shipping';
import AddToCart from './AddToCart';
import ProductGallery from '@/components/ProductGallery';
import ProductViewTracker from '@/components/ProductViewTracker';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import WhaleProductExperience from './WhaleProductExperience';
import FamilyProductExperience from './FamilyProductExperience';

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const IGREJINHA_PRODUCT_IDS = new Set([
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
]);

const PRODUCT_SEO: Record<string, { title: string; description: string }> = {
  'igreja-quadrado-p': {
    title: 'Igrejinha do Quadrado de Trancoso P em Cerâmica Artesanal | Agô',
    description: 'Miniatura em cerâmica da Igrejinha do Quadrado de Trancoso, a Igreja de São João Batista. Peça artesanal disponível na Agô Trancoso, no Quadrado.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha do Quadrado de Trancoso M em Cerâmica Artesanal | Agô',
    description: 'Igrejinha do Quadrado de Trancoso em cerâmica tamanho M, inspirada na Igreja de São João Batista. Disponível na Agô Trancoso, no Quadrado.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado de Trancoso GG — Escultura Luminária em Cerâmica | Agô',
    description: 'Escultura artesanal da Igreja do Quadrado de Trancoso na versão GG, que também funciona como luminária. Disponível na Agô Trancoso.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha do Quadrado de Trancoso — Luminária de Cerâmica | Agô',
    description: 'Luminária de cerâmica inspirada na Igrejinha do Quadrado de Trancoso, disponível na Agô Trancoso. Criada para receber vela LED ou vela pequena.',
  },
  'miniatura-quadrado-trancoso': {
    title: 'Miniatura do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Miniatura artesanal em cerâmica inspirada no Quadrado de Trancoso. Pode ser pendurada na parede ou apoiada sobre móveis e superfícies na decoração.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha do Quadrado de Trancoso | Agô',
    description: 'Ímã artesanal em cerâmica inspirado na Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Disponível na Agô Trancoso.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igrejinha do Quadrado de Trancoso | Agô',
    description: 'Colar em cerâmica inspirado na Igreja do Quadrado de Trancoso, com a fachada da Igrejinha de São João Batista. Disponível na Agô Trancoso.',
  },
};

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};

  const images = getAttentionOrderedImages(product);
  const shareImage = images.find(image => /\.(jpe?g|png)$/i.test(image)) || images[0];
  const seo = PRODUCT_SEO[product.id] ?? {
    title: `${product.name} | Agô Trancoso`,
    description: product.description,
  };

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: `/produtos/${product.id}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/produtos/${product.id}`,
      siteName: 'Agô Trancoso',
      locale: 'pt_BR',
      type: 'website',
      images: shareImage ? [{url: shareImage, alt: `${product.name} disponível na Agô Trancoso`, width: 960, height: 960}] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const orderedImages = getAttentionOrderedImages(product);
  const images = orderedImages.length ? orderedImages : ['/images/placeholder.svg'];
  const hasPromo = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const price = getEffectivePrice(product);
  const consultation = product.displayOnly && !product.available && price <= 0;
  const hasKnownPricePendingStock = product.displayOnly && !product.available && price > 0;
  const nationalShippingPrice = getShippingPrice(price);
  const isIgrejinhaProduct = IGREJINHA_PRODUCT_IDS.has(product.id);
  const isDecorativeMiniature = product.id === 'miniatura-quadrado-trancoso';
  const isHangingSagradaFamilia = product.id === 'sagrada-familia';
  const productUrl = `${SITE_DOMAIN}/produtos/${product.id}`;
  const attentionProducts = sortProductsByAttention(getAvailableProducts());

  const relatedIds = getRelatedProductIds(product.id);
  const availableById = new Map(attentionProducts.map((candidate) => [candidate.id, candidate]));
  const relatedFromMap = relatedIds
    .map((relatedId) => availableById.get(relatedId))
    .filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate && candidate.id !== product.id));
  const relatedSeen = new Set(relatedFromMap.map((candidate) => candidate.id));
  const related = [
    ...relatedFromMap,
    ...attentionProducts.filter((candidate) => candidate.id !== product.id && !relatedSeen.has(candidate.id)),
  ].slice(0, 3);

  const additionalProperty = [
    ...(product.dimensions ? [{ '@type': 'PropertyValue', name: 'Medidas', value: product.dimensions }] : []),
    ...(isDecorativeMiniature ? [{ '@type': 'PropertyValue', name: 'Uso', value: 'Pode ser pendurada na parede ou apoiada sobre móveis e superfícies' }] : []),
    ...(isHangingSagradaFamilia ? [{ '@type': 'PropertyValue', name: 'Uso', value: 'Versão colorida: alça na parte posterior para pendurar na parede; também pode ser apoiada' }] : []),
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: product.name,
        ...(isIgrejinhaProduct ? { alternateName: 'Igrejinha do Quadrado de Trancoso em cerâmica' } : {}),
        description: product.description,
        image: images.map((image) => `${SITE_DOMAIN}${image}`),
        sku: product.id,
        material: 'Cerâmica',
        brand: { '@type': 'Brand', name: 'Agô Trancoso' },
        category: isIgrejinhaProduct ? 'Igrejinhas do Quadrado de Trancoso' : product.category,
        url: productUrl,
        mainEntityOfPage: productUrl,
        seller: { '@id': `${SITE_DOMAIN}#organization` },
        ...(additionalProperty.length ? { additionalProperty } : {}),
        offers: product.variants?.length ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: Math.min(...product.variants.map(v => v.price)).toFixed(2),
          highPrice: Math.max(...product.variants.map(v => v.price)).toFixed(2),
          offerCount: product.variants.length,
          availability: 'https://schema.org/InStock',
          url: productUrl,
        } : {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'BRL',
          price: price.toFixed(2),
          availability: product.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${SITE_DOMAIN}#organization` },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BR' },
            shippingRate: { '@type': 'MonetaryAmount', value: nationalShippingPrice.toFixed(2), currency: 'BRL' },
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${productUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_DOMAIN },
          { '@type': 'ListItem', position: 2, name: 'Coleção', item: `${SITE_DOMAIN}/produtos` },
          ...(isIgrejinhaProduct ? [{ '@type': 'ListItem', position: 3, name: 'Igrejinha de Trancoso', item: `${SITE_DOMAIN}/igrejinha-de-trancoso` }] : []),
          { '@type': 'ListItem', position: isIgrejinhaProduct ? 4 : 3, name: product.name, item: productUrl },
        ],
      },
    ],
  };

  return (
    <div className="product-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ProductViewTracker product={product} />

      <div className="site-container product-page-shell">
        <nav className="product-breadcrumb" aria-label="Navegação estrutural">
          <Link href="/produtos">Coleção</Link>
          <span aria-hidden="true">/</span>
          {isIgrejinhaProduct && <><Link href="/igrejinha-de-trancoso">Igrejinha de Trancoso</Link><span aria-hidden="true">/</span></>}
          <span aria-current="page">{product.name}</span>
        </nav>

        {product.id === 'rabo-de-baleia' ? <WhaleProductExperience product={product} images={images} productUrl={productUrl} /> : product.id === 'sagrada-familia' ? <FamilyProductExperience product={product} images={images} productUrl={productUrl} /> : (
        <div className="product-page-grid">
          <div className="product-gallery-column"><ProductGallery productId={product.id} name={product.name} images={images} /></div>

          <div className="product-info-column">
            <div className="product-buybox">
              <p className="eyebrow">{isIgrejinhaProduct ? 'Igrejinha de Trancoso · Cerâmica artesanal' : 'Cerâmica artesanal'}</p>
              <h1 className="product-detail-title">{product.name}</h1>

              {consultation ? <p className="product-current-price">Preço sob consulta</p> : hasPromo ? (
                <div className="price-detail-row"><span className="product-old-price">{formatBRL(product.price)}</span><span className="product-current-price">{formatBRL(price)}</span></div>
              ) : <p className="product-current-price">{formatBRL(price)}</p>}

              <p className="product-description">{product.description}</p>
              {product.variants?.length ? <section aria-label="Tamanhos disponíveis" style={{marginTop:"1rem"}}><strong>Escolha o tamanho</strong><div style={{display:"flex",gap:".6rem",flexWrap:"wrap",marginTop:".6rem"}}>{product.variants.map(v => <a key={v.name} href={whatsappLink(`Olá! Gostaria de saber o valor do Rabo de Baleia tamanho ${v.name}.`)} target="_blank" rel="noopener noreferrer" style={{border:"1px solid #b9a99b",borderRadius:"10px",padding:".65rem .9rem",textDecoration:"none"}}><strong>{v.name}</strong><small style={{display:"block"}}>{v.dimensions}</small></a>)}</div><small>Valores por tamanho sob consulta.</small></section> : null}

              <section className="product-decision-details" aria-labelledby="product-details-title">
                <h2 id="product-details-title" className="product-detail-facts-title">Detalhes da peça</h2>
                <dl className="product-premium-facts" aria-label="Informações da peça">
                  <div><dt>Medidas da peça</dt><dd>{product.dimensions || 'Medidas em atualização'}</dd></div>
                  {isDecorativeMiniature && <div><dt>Uso</dt><dd>Para pendurar ou apoiar na decoração</dd></div>}
                  {isHangingSagradaFamilia && <div><dt>Como usar</dt><dd>Possui alça na parte de trás para pendurar na parede. Também pode ser apoiada.</dd></div>}
                </dl>
              </section>

              <div className="product-purchase">
                {hasKnownPricePendingStock ? <a href={whatsappLink(`Olá! Gostaria de comprar ${product.name}, anunciado por ${formatBRL(price)}. Pode confirmar a disponibilidade?`)} target="_blank" rel="noopener noreferrer" className="product-primary-cta ago-bag-primary">Consultar disponibilidade</a> : consultation ? <a href={whatsappLink(`Olá! Gostaria de saber o preço de ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="product-primary-cta ago-bag-primary">Consultar pelo WhatsApp</a> : <AddToCart product={product} />}
                <ProductShare name={product.name} url={productUrl} />
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="product-related-selection" aria-labelledby="related-products-title">
          <div className="site-container">
            <div className="ago-premium-section-head">
              <div><p className="eyebrow">Outras peças</p><h2 id="related-products-title">Para acompanhar sua escolha.</h2></div>
              <Link href="/produtos" className="ago-premium-text-link">Ver coleção completa <span aria-hidden="true"><svg className="ago-link-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12" /></svg></span></Link>
            </div>
            <div className="ago-premium-product-grid product-related-grid">
              {related.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={relatedProduct} listName="Produtos relacionados" />)}
            </div>
          </div>
        </section>
      )}
      <RecentlyViewed products={attentionProducts} currentProductId={product.id} />
    </div>
  );
}
