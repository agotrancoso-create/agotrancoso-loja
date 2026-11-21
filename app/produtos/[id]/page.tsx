import ProductShare from '@/components/ProductShare';
import ArtisanVariationNote from '@/components/ArtisanVariationNote';
import { getPieceMeasurements, pieceSchema } from '@/lib/catalog-measurements';
import '../../product-decision-clarity.css';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCatalogPageIds, getAvailableProducts, getEffectivePrice, getProductById } from '@/lib/products';
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
import { englishProduct, englishProductCopy } from '@/lib/product-english';
import { isEnglishRequest } from '@/lib/server-locale';

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
    title: 'Igrejinha do Quadrado de Trancoso P em Cerâmica | Agô',
    description: 'Miniatura em cerâmica da Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Peça decorativa disponível na Agô, no Quadrado.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha do Quadrado de Trancoso M em Cerâmica | Agô',
    description: 'Igrejinha do Quadrado de Trancoso em cerâmica tamanho M, inspirada na Igreja de São João Batista. Disponível na Agô Trancoso.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado de Trancoso GG — Luminária em Cerâmica | Agô',
    description: 'Escultura em cerâmica da Igreja do Quadrado de Trancoso na versão GG, que também funciona como luminária. Disponível na Agô Trancoso.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha Luminária do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Luminária em cerâmica inspirada na Igrejinha do Quadrado de Trancoso. Pode receber vela LED ou vela pequena no interior.',
  },
  'casinha-luminaria': {
    title: 'Casinha Luminária em Cerâmica Inspirada em Trancoso | Agô',
    description: 'Casinha luminária em cerâmica inspirada no casario de Trancoso. A luz aparece pelas portas e janelas quando usada com vela LED ou rechaud.',
  },
  'miniatura-quadrado-trancoso': {
    title: 'Miniatura do Quadrado de Trancoso em Cerâmica para Pendurar | Agô',
    description: 'Miniatura do Quadrado de Trancoso em cerâmica, com casinhas coloridas e igrejinha. Pode ser pendurada na parede ou apoiada na decoração.',
  },
  'cruzeiro-do-quadrado': {
    title: 'Cruzeiro do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Miniatura em cerâmica do Cruzeiro do Quadrado de Trancoso, referência do conjunto histórico da vila. Disponível na Agô Trancoso.',
  },
  'mobile-trancoso': {
    title: 'Móbile de Casinhas de Trancoso em Cerâmica | Agô',
    description: 'Móbile em cerâmica com pequenas casinhas inspiradas no casario de Trancoso. Peça decorativa para pendurar, disponível na Agô.',
  },
  'estatueta-iemanja': {
    title: 'Estatueta de Iemanjá em Cerâmica | Agô Trancoso',
    description: 'Estatueta de Iemanjá em cerâmica para altar, prateleira ou espaço de fé e devoção. Conheça as fotos e compre online na Agô Trancoso.',
  },
  'nossa-senhora-grande': {
    title: 'Nossa Senhora Grande em Cerâmica | Agô Trancoso',
    description: 'Imagem grande de Nossa Senhora em cerâmica, com detalhes nas vestes. Peça para altar doméstico ou ambiente de devoção.',
  },
  'presepio-em-ceramica': {
    title: 'Presépio em Cerâmica com 5 Peças | Agô Trancoso',
    description: 'Presépio em cerâmica com Menino Jesus, Maria, José, anjo e Estrela de Belém. Conjunto para decoração de Natal, disponível na Agô.',
  },
  'casal-pretos-velhos': {
    title: 'Casal de Pretos-Velhos em Cerâmica | Agô Trancoso',
    description: 'Representação de um casal de Pretos-Velhos em cerâmica, ligada à tradição de fé, respeito e ancestralidade. Disponível na Agô.',
  },
  'nossa-senhora-aparecida': {
    title: 'Nossa Senhora Aparecida em Cerâmica | Agô Trancoso',
    description: 'Imagem de Nossa Senhora Aparecida em cerâmica, com manto azul e detalhes dourados. Para devoção, altar ou presente.',
  },
  'divino-espirito-santo': {
    title: 'Divino Espírito Santo de Parede em Cerâmica | Agô Trancoso',
    description: 'Peça circular em cerâmica com a pomba do Divino Espírito Santo em relevo, feita para pendurar em paredes internas.',
  },
  'terco-em-ceramica': {
    title: 'Terço em Cerâmica com Contas Brancas | Agô Trancoso',
    description: 'Terço com contas brancas de cerâmica e cruz na extremidade, para momentos de oração ou para compor um espaço de fé.',
  },
  'rosario-trancoso': {
    title: 'Rosário com Igreja do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Rosário de contas de cerâmica com medalhão da Igreja do Quadrado de Trancoso, unindo devoção e lembrança da vila.',
  },
  'esfera-decorativa': {
    title: 'Esfera Decorativa em Cerâmica Terracota | Agô Trancoso',
    description: 'Esfera decorativa de cerâmica em tom terroso com desenhos florais claros, para mesas, aparadores e estantes.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Colar com pingente em cerâmica inspirado na Igreja de São João Batista, no Quadrado de Trancoso. Uma lembrança para usar ou presentear.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Ímã em cerâmica com a fachada da Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Lembrança pequena para presentear.',
  },
  'rabo-de-baleia': {
    title: 'Rabo de Baleia Decorativo em Cerâmica P, M e G | Agô Trancoso',
    description: 'Escultura decorativa em cerâmica em forma de cauda de baleia, disponível nos tamanhos P, M e G, de 10 a 16 cm de altura.',
  },
  'sagrada-familia': {
    title: 'Sagrada Família em Cerâmica Colorida ou Dourada | Agô',
    description: 'Sagrada Família em cerâmica com José, Maria e Menino Jesus, disponível nos acabamentos colorido e dourado.',
  },
  'cachimbo': {
    title: 'Cachimbo Decorativo em Cerâmica Terracota | Agô Trancoso',
    description: 'Cachimbo decorativo em cerâmica terracota com flores claras pintadas e 10 cm de comprimento. Disponível na Agô Trancoso.',
  },
};

export function generateStaticParams() {
  return getCatalogPageIds().map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  const english = await isEnglishRequest();

  const images = getAttentionOrderedImages(product);
  const shareImage = images.find(image => /\.(jpe?g|png)$/i.test(image)) || images[0];
  const baseSeo = PRODUCT_SEO[product.id] ?? {
    title: `${product.name} | Agô Trancoso`,
    description: product.description,
  };
  const englishCopy = englishProductCopy(product.id, product.name, product.description);
  const seo = english ? { title: englishCopy.title ?? `${englishCopy.name} | Agô Trancoso`, description: englishCopy.description } : baseSeo;
  const canonicalPath = english ? `/en/produtos/${product.id}` : `/produtos/${product.id}`;

  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'pt-BR': `/produtos/${product.id}`,
        en: `/en/produtos/${product.id}`,
        'x-default': `/produtos/${product.id}`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalPath,
      siteName: 'Agô Trancoso',
      locale: english ? 'en_US' : 'pt_BR',
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
  const sourceProduct = getProductById(id);
  if (!sourceProduct) notFound();
  const english = await isEnglishRequest();
  const product = english ? englishProduct(sourceProduct) : sourceProduct;
  const t = (pt: string, en: string) => english ? en : pt;

  const measurements = getPieceMeasurements(id);
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
  const productUrl = `${SITE_DOMAIN}${english ? '/en' : ''}/produtos/${product.id}`;
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
        ...pieceSchema(product.id),
        category: isIgrejinhaProduct ? 'Igrejinhas do Quadrado de Trancoso' : product.category,
        url: productUrl,
        mainEntityOfPage: productUrl,
        seller: { '@id': `${SITE_DOMAIN}#organization` },
        ...(additionalProperty.length ? { additionalProperty } : {}),
        offers: product.variants?.length || product.finishes?.length ? {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: Math.min(...(product.variants?.map(v => v.price) ?? product.finishes?.map(v => v.price).filter((v): v is number => v !== null) ?? [price])).toFixed(2),
          highPrice: Math.max(...(product.variants?.map(v => v.price) ?? product.finishes?.map(v => v.price).filter((v): v is number => v !== null) ?? [price])).toFixed(2),
          offerCount: product.variants?.length ?? product.finishes?.length ?? 1,
          availability: (product.variants?.some(v => (v.stock ?? 0) > 0) || product.finishes?.some(v => (v.stock ?? 0) > 0)) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
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
        <nav className="product-breadcrumb" aria-label={t('Navegação estrutural', 'Breadcrumb')}>
          <Link href={english ? '/en/produtos' : '/produtos'}>{t('Coleção', 'Collection')}</Link>
          <span aria-hidden="true">/</span>
          {isIgrejinhaProduct && <><Link href={english ? '/en/igrejinha-de-trancoso' : '/igrejinha-de-trancoso'}>{t('Igrejinha de Trancoso', 'Trancoso Church')}</Link><span aria-hidden="true">/</span></>}
          <span aria-current="page">{product.name}</span>
        </nav>

        {product.id === 'rabo-de-baleia' ? <WhaleProductExperience product={product} images={images} productUrl={productUrl} /> : product.id === 'sagrada-familia' ? <FamilyProductExperience product={product} images={images} productUrl={productUrl} /> : (
        <div className="product-page-grid">
          <div className="product-gallery-column"><ProductGallery productId={product.id} name={product.name} images={images} /></div>

          <div className="product-info-column">
            <div className="product-buybox">
              <p className="eyebrow">{isIgrejinhaProduct ? t('Igrejinha de Trancoso · Cerâmica artesanal', 'Trancoso church · Ceramic piece') : t('Cerâmica artesanal', 'Ceramic piece')}</p>
              <h1 className="product-detail-title">{product.name}</h1>

              {consultation ? <p className="product-current-price">Preço sob consulta</p> : hasPromo ? (
                <div className="price-detail-row"><span className="product-old-price">{formatBRL(product.price)}</span><span className="product-current-price">{formatBRL(price)}</span></div>
              ) : <p className="product-current-price">{formatBRL(price)}</p>}

              <p className="product-description">{product.description}</p>
              {product.variants?.length ? <section aria-label="Tamanhos disponíveis" style={{marginTop:"1rem"}}><strong>Escolha o tamanho</strong><div style={{display:"flex",gap:".6rem",flexWrap:"wrap",marginTop:".6rem"}}>{product.variants.map(v => <a key={v.name} href={whatsappLink(`Olá! Gostaria de saber o valor do Rabo de Baleia tamanho ${v.name}.`)} target="_blank" rel="noopener noreferrer" style={{border:"1px solid #b9a99b",borderRadius:"10px",padding:".65rem .9rem",textDecoration:"none"}}><strong>{v.name}</strong><small style={{display:"block"}}>{v.dimensions}</small></a>)}</div><small>Valores por tamanho sob consulta.</small></section> : null}

              <div className="product-purchase">
                {hasKnownPricePendingStock ? <a href={whatsappLink(`Olá! Gostaria de comprar ${product.name}, anunciado por ${formatBRL(price)}. Pode confirmar a disponibilidade?`)} target="_blank" rel="noopener noreferrer" className="product-primary-cta ago-bag-primary">Consultar disponibilidade</a> : consultation ? <a href={whatsappLink(`Olá! Gostaria de saber o preço de ${product.name}.`)} target="_blank" rel="noopener noreferrer" className="product-primary-cta ago-bag-primary">Consultar pelo WhatsApp</a> : <AddToCart product={product} />}
              </div>

              <details className="ago-product-info-disclosure">
                <summary>{t('Medidas e informações da peça', 'Dimensions and product information')}</summary>
                <div className="ago-product-info-body">
              <section className="product-decision-details" aria-labelledby="product-details-title">
                <h2 id="product-details-title" className="product-detail-facts-title">{t('Detalhes da peça', 'Product details')}</h2>
                <dl className="product-premium-facts" aria-label="Informações da peça">
                  <div><dt>{t('Medidas da peça', 'Product dimensions')}</dt><dd>{product.dimensions || t('Medidas em atualização', 'Dimensions being updated')}</dd></div>
                  {measurements?.netWeightG != null && <div><dt>{t('Peso da peça sem embalagem', 'Product weight without packaging')}</dt><dd>{measurements.netWeightG} g</dd></div>}
                  {isDecorativeMiniature && <div><dt>Uso</dt><dd>Para pendurar ou apoiar na decoração</dd></div>}
                  {isHangingSagradaFamilia && <div><dt>Como usar</dt><dd>Possui alça na parte de trás para pendurar na parede. Também pode ser apoiada.</dd></div>}
                </dl>
              </section>
                  <ArtisanVariationNote />
                  <ProductShare name={product.name} url={productUrl} />
                </div>
              </details>
            </div>
          </div>
        </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="product-related-selection" aria-labelledby="related-products-title">
          <div className="site-container">
            <div className="ago-premium-section-head">
              <div><p className="eyebrow">{t('Outras peças', 'More pieces')}</p><h2 id="related-products-title">{t('Para acompanhar sua escolha.', 'You may also like.')}</h2></div>
              <Link href={english ? '/en/produtos' : '/produtos'} className="ago-premium-text-link">{t('Ver coleção completa', 'View full collection')} <span aria-hidden="true"><svg className="ago-link-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12" /></svg></span></Link>
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
