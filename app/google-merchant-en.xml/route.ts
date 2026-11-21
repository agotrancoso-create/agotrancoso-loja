import { getCatalogOffers, getEffectivePrice } from '@/lib/products';
import { getAttentionOrderedImages } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';
import { getPieceMeasurements, getParcelMeasurements } from '@/lib/catalog-measurements';
import { englishProductCopy, englishProductType } from '@/lib/product-english';

export const dynamic = 'force-static';
export const revalidate = 3600;

const GOOGLE_PRODUCT_CATEGORY_BY_ID: Record<string, number> = {
  'colar-igreja-quadrado': 196,
  'ima-igrejinha-trancoso': 5876,
  'igrejinha-luminaria-trancoso': 4636,
  'casinha-luminaria': 4636,
  'presepio-em-ceramica': 6531,
  'rosario-trancoso': 3923,
  'terco-em-ceramica': 3923,
  'mobile-trancoso': 696,
  'esfera-decorativa': 696,
};

const IGREJA_VARIANTS: Record<string, { size: string; itemGroupId: string }> = {
  'igreja-quadrado-p': { size: 'P', itemGroupId: 'igreja-quadrado-trancoso' },
  'igreja-quadrado-m': { size: 'M', itemGroupId: 'igreja-quadrado-trancoso' },
};

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

function googleProductCategory(product: { id: string; category: string }) {
  const direct = GOOGLE_PRODUCT_CATEGORY_BY_ID[product.id];
  if (direct) return direct;
  if (product.category === 'fe-devocao') return 97;
  return 5609;
}

function measurementTags(id: string) {
  const item = getPieceMeasurements(id);
  const box = getParcelMeasurements(id);
  const fields: [string, number | undefined, 'cm' | 'g'][] = [
    ['product_length', item?.lengthCm, 'cm'], ['product_width', item?.widthCm, 'cm'],
    ['product_height', item?.heightCm, 'cm'], ['product_weight', item?.netWeightG, 'g'],
    ['shipping_length', box?.lengthCm, 'cm'], ['shipping_width', box?.widthCm, 'cm'],
    ['shipping_height', box?.heightCm, 'cm'], ['shipping_weight', box?.grossWeightG, 'g'],
  ];
  return fields.filter(([, value]) => value != null)
    .map(([tag, value, unit]) => `<g:${tag}>${value} ${unit}</g:${tag}>`).join('\n          ');
}

export async function GET() {
  const items = getCatalogOffers()
    .filter(({ product }) => product.id !== 'cachimbo')
    .map(({ product, groupId, size, color }) => {
      const hasSale = product.promotionalPrice != null && product.promotionalPrice < product.price;
      const curatedImages = getAttentionOrderedImages(product);
      const mainImage = curatedImages[0] ? absoluteUrl(curatedImages[0]) : `${SITE_DOMAIN}/images/placeholder.svg`;
      const additionalImages = curatedImages.slice(1, 10);
      const copy = englishProductCopy(product.id, product.name, product.description);
      const variant = IGREJA_VARIANTS[product.id];
      const itemGroupId = groupId ?? variant?.itemGroupId;
      const itemSize = size ?? variant?.size;

      return `
        <item>
          <g:id>${escapeXml(product.id)}-en</g:id>
          <g:title>${escapeXml(copy.title ?? copy.name)}</g:title>
          <g:description>${escapeXml(copy.description)}</g:description>
          <g:link>${escapeXml(`${SITE_DOMAIN}/en/produtos/${product.id}`)}</g:link>
          <g:mobile_link>${escapeXml(`${SITE_DOMAIN}/en/produtos/${product.id}`)}</g:mobile_link>
          <g:image_link>${escapeXml(mainImage)}</g:image_link>
          ${additionalImages.map((image) => `<g:additional_image_link>${escapeXml(absoluteUrl(image))}</g:additional_image_link>`).join('\n          ')}
          <g:availability>${product.available ? 'in_stock' : 'out_of_stock'}</g:availability>
          <g:condition>new</g:condition>
          <g:price>${product.price.toFixed(2)} BRL</g:price>
          ${hasSale ? `<g:sale_price>${product.promotionalPrice!.toFixed(2)} BRL</g:sale_price>` : ''}
          <g:identifier_exists>no</g:identifier_exists>
          <g:material>Ceramic</g:material>
          ${measurementTags(product.id)}
          <g:google_product_category>${googleProductCategory(product)}</g:google_product_category>
          <g:product_type>${escapeXml(englishProductType(product.category))}</g:product_type>
          ${product.dimensions ? `<g:product_detail>
            <g:section_name>Product details</g:section_name>
            <g:attribute_name>Dimensions</g:attribute_name>
            <g:attribute_value>${escapeXml(product.dimensions)}</g:attribute_value>
          </g:product_detail>` : ''}
          ${itemGroupId ? `<g:item_group_id>${escapeXml(itemGroupId)}-en</g:item_group_id>` : ''}
          ${itemSize ? `<g:size>${escapeXml(itemSize)}</g:size>` : ''}
          ${color ? `<g:color>${escapeXml(color)}</g:color>` : ''}
          <g:custom_label_0>International English</g:custom_label_0>
        </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Agô Trancoso — International</title>
    <link>${escapeXml(`${SITE_DOMAIN}/en`)}</link>
    <description>Trancoso ceramic décor, church miniatures, devotional pieces and keepsakes available from Agô Trancoso.</description>
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
