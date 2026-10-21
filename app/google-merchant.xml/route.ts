import { getAllProducts, getEffectivePrice } from '@/lib/products';
import { getAttentionOrderedImages } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';
import { getShippingPrice } from '@/lib/shipping';

export const dynamic = 'force-static';
export const revalidate = 3600;

const SHOPPING_COPY: Record<string, { title: string; description: string }> = {
  'igreja-quadrado-p': {
    title: 'Igrejinha do Quadrado de Trancoso P em Cerâmica Artesanal | Agô',
    description: 'Igrejinha do Quadrado de Trancoso tamanho P, feita em cerâmica e pintada à mão. Miniatura da Igreja de São João Batista, com 3,5 cm de altura e 4 cm de largura. Peça decorativa artesanal para guardar uma lembrança do Quadrado de Trancoso, Bahia.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha do Quadrado de Trancoso M em Cerâmica Artesanal | Agô',
    description: 'Igrejinha do Quadrado de Trancoso tamanho M em cerâmica artesanal. Miniatura inspirada na fachada da Igreja de São João Batista, com 4,5 cm de altura e 5 cm de largura. Uma peça decorativa feita à mão na Agô Trancoso, no Quadrado de Trancoso, Bahia.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado de Trancoso GG — Escultura Luminária em Cerâmica | Agô',
    description: 'Igreja do Quadrado de Trancoso na versão GG: escultura artesanal em cerâmica inspirada na Igreja de São João Batista. Mede 16 cm de altura e 23 cm de largura e também funciona como luminária. Peça de decoração de destaque feita à mão pela Agô Trancoso.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha do Quadrado de Trancoso — Luminária de Cerâmica | Agô',
    description: 'Igrejinha Luminária do Quadrado de Trancoso feita à mão em cerâmica, inspirada na Igreja de São João Batista. Com 6,5 cm de altura e 7,5 cm de largura, pode receber uma vela LED ou vela pequena em seu interior para iluminar a decoração.',
  },
  'miniatura-quadrado-trancoso': {
    title: 'Miniatura do Quadrado de Trancoso para Pendurar | Agô',
    description: 'Miniatura artesanal em cerâmica inspirada no Quadrado de Trancoso, Bahia. Peça colorida feita para pendurar na parede e levar uma referência do Quadrado para a decoração.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Ímã artesanal em cerâmica inspirado na Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Peça pintada à mão e disponível na Agô Trancoso como lembrança da vila.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Colar artesanal em cerâmica inspirado na fachada da Igreja de São João Batista do Quadrado de Trancoso. Peça modelada à mão e disponível na Agô Trancoso para usar ou presentear.',
  },
};

const SHOPPING_SHORT_TITLES: Record<string, string> = {
  'igreja-quadrado-p': 'Igrejinha do Quadrado de Trancoso P',
  'igreja-quadrado-m': 'Igrejinha do Quadrado de Trancoso M',
  'igreja-quadrado-gg': 'Igreja do Quadrado de Trancoso GG',
  'igrejinha-luminaria-trancoso': 'Igrejinha Luminária do Quadrado de Trancoso',
  'miniatura-quadrado-trancoso': 'Miniatura Quadrado de Trancoso',
  'ima-igrejinha-trancoso': 'Ímã Igrejinha de Trancoso',
  'colar-igreja-quadrado': 'Colar Igreja do Quadrado',
};

const SHOPPING_HIGHLIGHTS: Record<string, string[]> = {
  'igreja-quadrado-p': [
    'Miniatura P modelada e pintada à mão, com 3,5 cm de altura.',
    'Fachada inspirada na Igreja de São João Batista de Trancoso.',
  ],
  'igreja-quadrado-m': [
    'Miniatura M feita à mão, com 4,5 cm de altura.',
    'Fachada inspirada na Igreja de São João Batista de Trancoso.',
  ],
  'igreja-quadrado-gg': [
    'Escultura GG em cerâmica com 16 cm de altura e 23 cm de largura.',
    'Também funciona como luminária, além de escultura decorativa.',
  ],
  'igrejinha-luminaria-trancoso': [
    'Luminária artesanal em cerâmica com 6,5 cm de altura.',
    'Pode receber vela LED ou vela pequena no interior.',
  ],
  'miniatura-quadrado-trancoso': [
    'Peça de cerâmica inspirada no Quadrado de Trancoso.',
    'Criada para pendurar na parede.',
  ],
  'ima-igrejinha-trancoso': [
    'Ímã artesanal de cerâmica pintado à mão.',
    'Inspirado na fachada da Igreja de São João Batista de Trancoso.',
  ],
  'colar-igreja-quadrado': [
    'Pingente de cerâmica modelado à mão.',
    'Inspirado na fachada da Igreja do Quadrado de Trancoso.',
  ],
};

// IDs oficiais da taxonomia Google Product Category. Mantemos as classes
// específicas apenas quando a natureza da peça é inequívoca; nas demais,
// usamos uma classe de decoração/religiosa ampla em vez de adivinhar atributos.
const GOOGLE_PRODUCT_CATEGORY_BY_ID: Record<string, number> = {
  'colar-igreja-quadrado': 196, // Joias > Colares
  'ima-igrejinha-trancoso': 5876, // Casa e jardim > Decoração > Ímãs de geladeira
  'igrejinha-luminaria-trancoso': 4636, // Casa e jardim > Iluminação > Luminárias
  'casinha-luminaria': 4636,
  'presepio-em-ceramica': 6531, // Casa e jardim > Decoração de Natal > Presépios
  'rosario-trancoso': 3923, // Material para cerimônias e eventos religiosos > Itens religiosos > Rosários
  'terco-em-ceramica': 3923,
  'mobile-trancoso': 696, // Casa e jardim > Decoração
  'esfera-decorativa': 696,
};

const IGREJA_VARIANTS: Record<string, { size: string; itemGroupId: string }> = {
  'igreja-quadrado-p': { size: 'P', itemGroupId: 'igreja-quadrado-trancoso' },
  'igreja-quadrado-m': { size: 'M', itemGroupId: 'igreja-quadrado-trancoso' },
  // A GG também funciona como luminária: não é apenas uma variação de tamanho
  // das miniaturas decorativas P/M. Mantê-la independente evita agrupamento indevido.
};

const IGREJINHA_IDS = new Set([
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
]);

function escapeXml(value: string | number | null | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_DOMAIN}${path.startsWith('/') ? path : `/${path}`}`;
}

function productType(category: string) {
  const labels: Record<string, string> = {
    igrejinhas: 'Artesanato > Cerâmica > Igrejinhas do Quadrado de Trancoso',
    trancoso: 'Artesanato > Cerâmica > Trancoso',
    decoracao: 'Casa e decoração > Cerâmica artesanal',
    'fe-devocao': 'Fé e devoção > Cerâmica artesanal',
    presentes: 'Presentes > Artesanato de Trancoso',
  };
  return labels[category] ?? 'Artesanato > Cerâmica artesanal';
}

function googleProductCategory(product: { id: string; category: string }) {
  const direct = GOOGLE_PRODUCT_CATEGORY_BY_ID[product.id];
  if (direct) return direct;
  if (product.category === 'fe-devocao') return 97; // Itens religiosos
  return 5609; // Casa e jardim > Decoração > Estatuetas
}

export async function GET() {
  const items = getAllProducts()
    .map((product) => {
      const hasSale = product.promotionalPrice != null && product.promotionalPrice < product.price;
      const effectivePrice = getEffectivePrice(product);
      const shippingPrice = getShippingPrice(effectivePrice);
      const curatedImages = getAttentionOrderedImages(product);
      const mainImage = curatedImages[0] ? absoluteUrl(curatedImages[0]) : `${SITE_DOMAIN}/images/placeholder.svg`;
      const additionalImages = curatedImages.slice(1, 10);
      const shoppingCopy = SHOPPING_COPY[product.id];
      const shortTitle = SHOPPING_SHORT_TITLES[product.id];
      const highlights = SHOPPING_HIGHLIGHTS[product.id] ?? [];
      const title = shoppingCopy?.title ?? product.name;
      const description = shoppingCopy?.description ?? product.description;
      const variant = IGREJA_VARIANTS[product.id];
      const isIgrejinha = IGREJINHA_IDS.has(product.id);
      const category = googleProductCategory(product);

      return `
        <item>
          <g:id>${escapeXml(product.id)}</g:id>
          <g:title>${escapeXml(title)}</g:title>
          ${shortTitle ? `<g:short_title>${escapeXml(shortTitle)}</g:short_title>` : ''}
          <g:description>${escapeXml(description)}</g:description>
          ${highlights.map((highlight) => `<g:product_highlight>${escapeXml(highlight)}</g:product_highlight>`).join('\n          ')}
          <g:link>${escapeXml(`${SITE_DOMAIN}/produtos/${product.id}`)}</g:link>
          <g:mobile_link>${escapeXml(`${SITE_DOMAIN}/produtos/${product.id}`)}</g:mobile_link>
          <g:image_link>${escapeXml(mainImage)}</g:image_link>
          ${additionalImages.map((image) => `<g:additional_image_link>${escapeXml(absoluteUrl(image))}</g:additional_image_link>`).join('\n          ')}
          <g:availability>${product.available ? 'in_stock' : 'out_of_stock'}</g:availability>
          <g:condition>new</g:condition>
          <g:price>${product.price.toFixed(2)} BRL</g:price>
          ${hasSale ? `<g:sale_price>${product.promotionalPrice!.toFixed(2)} BRL</g:sale_price>` : ''}
          <g:brand>Agô Trancoso</g:brand>
          <g:identifier_exists>no</g:identifier_exists>
          <g:material>Cerâmica</g:material>
          <g:google_product_category>${category}</g:google_product_category>
          <g:product_type>${escapeXml(productType(product.category))}</g:product_type>
          ${product.dimensions ? `<g:product_detail>
            <g:section_name>Características</g:section_name>
            <g:attribute_name>Medidas</g:attribute_name>
            <g:attribute_value>${escapeXml(product.dimensions)}</g:attribute_value>
          </g:product_detail>` : ''}
          ${variant ? `<g:item_group_id>${escapeXml(variant.itemGroupId)}</g:item_group_id>\n          <g:size>${escapeXml(variant.size)}</g:size>` : ''}
          ${isIgrejinha ? '<g:custom_label_0>Igrejinha do Quadrado de Trancoso</g:custom_label_0>' : ''}
          ${product.id === 'miniatura-quadrado-trancoso' ? '<g:custom_label_1>Decoração de parede</g:custom_label_1>' : ''}
          <g:shipping>
            <g:country>BR</g:country>
            <g:service>Entrega nacional</g:service>
            <g:price>${shippingPrice.toFixed(2)} BRL</g:price>
          </g:shipping>
        </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Agô Trancoso</title>
    <link>${escapeXml(SITE_DOMAIN)}</link>
    <description>Cerâmica artesanal, Igrejinhas do Quadrado e lembranças de Trancoso disponíveis na Agô Trancoso.</description>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
