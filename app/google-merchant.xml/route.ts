import { getAllProducts, getEffectivePrice } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';
import { getShippingPrice } from '@/lib/shipping';

export const dynamic = 'force-static';
export const revalidate = 3600;

const SHOPPING_COPY: Record<string, { title: string; description: string }> = {
  'igreja-quadrado-p': {
    title: 'Igrejinha do Quadrado de Trancoso em Cerâmica P | Agô',
    description: 'Miniatura artesanal em cerâmica inspirada na Igreja de São João Batista, a famosa Igrejinha do Quadrado de Trancoso, Bahia. Pintada à mão pela Agô Trancoso para decorar, presentear ou guardar como lembrança da vila.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha do Quadrado de Trancoso em Cerâmica M | Agô',
    description: 'Igrejinha do Quadrado de Trancoso em cerâmica tamanho M, inspirada na Igreja de São João Batista. Peça artesanal feita à mão pela Agô Trancoso, com a fachada e os elementos que remetem a um dos símbolos mais conhecidos da vila.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado de Trancoso em Cerâmica GG | Agô',
    description: 'Escultura artesanal em cerâmica inspirada na Igreja de São João Batista, no Quadrado de Trancoso. Versão GG modelada à mão pela Agô Trancoso, pensada como peça de destaque para decoração e coleção.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha do Quadrado de Trancoso Luminária em Cerâmica | Agô',
    description: 'Luminária artesanal em cerâmica inspirada na Igrejinha do Quadrado de Trancoso. Modelada à mão pela Agô Trancoso e criada para receber vela LED ou vela pequena, trazendo a fachada da igreja para a decoração.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Ímã artesanal em cerâmica inspirado na Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Uma lembrança pintada à mão pela Agô Trancoso para levar um símbolo da vila para o dia a dia.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Colar artesanal em cerâmica inspirado na fachada da Igreja de São João Batista do Quadrado de Trancoso. Uma peça discreta, modelada à mão pela Agô Trancoso, para usar ou presentear.',
  },
};

const SHOPPING_SHORT_TITLES: Record<string, string> = {
  'igreja-quadrado-p': 'Igrejinha do Quadrado P',
  'igreja-quadrado-m': 'Igrejinha do Quadrado M',
  'igreja-quadrado-gg': 'Igreja do Quadrado GG',
  'igrejinha-luminaria-trancoso': 'Igrejinha Luminária Trancoso',
  'ima-igrejinha-trancoso': 'Ímã Igrejinha de Trancoso',
  'colar-igreja-quadrado': 'Colar Igreja do Quadrado',
};

const SHOPPING_HIGHLIGHTS: Record<string, string[]> = {
  'igreja-quadrado-p': [
    'Miniatura em cerâmica modelada e pintada à mão.',
    'Fachada inspirada na Igreja de São João Batista de Trancoso.',
  ],
  'igreja-quadrado-m': [
    'Peça de cerâmica feita à mão em tamanho M.',
    'Fachada inspirada na Igreja de São João Batista de Trancoso.',
  ],
  'igreja-quadrado-gg': [
    'Escultura de cerâmica modelada à mão em versão GG.',
    'Inspirada na Igreja de São João Batista do Quadrado de Trancoso.',
  ],
  'igrejinha-luminaria-trancoso': [
    'Luminária de cerâmica modelada à mão.',
    'Pode receber vela LED ou vela pequena no interior.',
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

const IGREJA_VARIANTS: Record<string, { size: string; itemGroupId: string }> = {
  'igreja-quadrado-p': { size: 'P', itemGroupId: 'igreja-quadrado-trancoso' },
  'igreja-quadrado-m': { size: 'M', itemGroupId: 'igreja-quadrado-trancoso' },
  'igreja-quadrado-gg': { size: 'GG', itemGroupId: 'igreja-quadrado-trancoso' },
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

export async function GET() {
  const items = getAllProducts()
    .filter((product) => product.available)
    .map((product) => {
      const hasSale = product.promotionalPrice != null && product.promotionalPrice < product.price;
      const effectivePrice = getEffectivePrice(product);
      const shippingPrice = getShippingPrice(effectivePrice);
      const mainImage = product.images?.[0] ? absoluteUrl(product.images[0]) : `${SITE_DOMAIN}/images/placeholder.svg`;
      const additionalImages = (product.images ?? []).slice(1, 10);
      const shoppingCopy = SHOPPING_COPY[product.id];
      const shortTitle = SHOPPING_SHORT_TITLES[product.id];
      const highlights = SHOPPING_HIGHLIGHTS[product.id] ?? [];
      const title = shoppingCopy?.title ?? product.name;
      const description = shoppingCopy?.description ?? product.description;
      const variant = IGREJA_VARIANTS[product.id];
      const isIgrejinha = IGREJINHA_IDS.has(product.id);

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
          <g:availability>in_stock</g:availability>
          <g:condition>new</g:condition>
          <g:price>${product.price.toFixed(2)} BRL</g:price>
          ${hasSale ? `<g:sale_price>${product.promotionalPrice!.toFixed(2)} BRL</g:sale_price>` : ''}
          <g:brand>Agô Trancoso</g:brand>
          <g:mpn>${escapeXml(`AGO-${product.id.toUpperCase()}`)}</g:mpn>
          <g:material>Cerâmica</g:material>
          <g:product_type>${escapeXml(productType(product.category))}</g:product_type>
          ${variant ? `<g:item_group_id>${escapeXml(variant.itemGroupId)}</g:item_group_id>\n          <g:size>${escapeXml(variant.size)}</g:size>` : ''}
          ${isIgrejinha ? '<g:custom_label_0>Igrejinha do Quadrado de Trancoso</g:custom_label_0>' : ''}
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
    <description>Cerâmica artesanal, Igrejinhas do Quadrado e lembranças de Trancoso feitas à mão.</description>
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
