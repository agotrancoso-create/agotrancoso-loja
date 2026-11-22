import { getCatalogOffers, getEffectivePrice } from '@/lib/products';
import { getAttentionOrderedImages } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';
export const revalidate = 3600;

/**
 * Pinterest's hosted RSS 2.0 product data source.
 * Uses the canonical product IDs, checkout prices, availability and approved
 * photographs from the existing Agô storefront. No artificial product details.
 */
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
  return SITE_DOMAIN + (path.startsWith('/') ? path : '/' + path);
}

const TYPES: Record<string, string> = {
  igrejinhas: 'Casa e decoração > Miniaturas de igrejinhas',
  trancoso: 'Casa e decoração > Lembranças de Trancoso',
  decoracao: 'Casa e decoração > Cerâmica decorativa',
  'fe-devocao': 'Casa e decoração > Peças religiosas e devocionais',
  presentes: 'Presentes e lembranças > Cerâmica',
};

const GOOGLE_CATEGORIES: Record<string, number> = {
  'colar-igreja-quadrado': 196,
  'ima-igrejinha-trancoso': 5876,
  'igrejinha-luminaria-trancoso': 4636,
  'casinha-luminaria': 4636,
  'presepio-em-ceramica': 6531,
  'rosario-trancoso': 3923,
  'terco-em-ceramica': 3923,
  'esfera-decorativa': 696,
};

function googleCategory(id: string, category: string) {
  if (GOOGLE_CATEGORIES[id]) return GOOGLE_CATEGORIES[id];
  if (category === 'fe-devocao') return 97;
  return 5609;
}

export async function GET() {
  const offers = getCatalogOffers()
    // No tobacco/smoking-related items in Pinterest's product catalog.
    // Exclude products without a valid canonical photo or purchasing price.
    .filter(({ product }) => product.id !== 'cachimbo' && !product.displayOnly)
    .map(({ product, groupId, size, color }) => {
      const curated = getAttentionOrderedImages(product).filter(
        (src) => Boolean(src) && !src.includes('/placeholder.')
      );
      if (!curated.length) return '';
      const price = product.price;
      const effectivePrice = getEffectivePrice(product);
      if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(effectivePrice) || effectivePrice <= 0) return '';

      // Identifiers are the same IDs used by product detail pages and checkout.
      const detailUrl = SITE_DOMAIN + '/produtos/' + encodeURIComponent(product.id);
      const description = (product.description || product.name).replace(/\s+/g, ' ').trim();
      const hasSale = product.promotionalPrice != null && product.promotionalPrice < product.price;
      const itemGroupId = groupId ?? (
        product.id === 'igreja-quadrado-p' || product.id === 'igreja-quadrado-m'
          ? 'igreja-quadrado-trancoso'
          : undefined
      );
      const groupSize = size ?? (product.id === 'igreja-quadrado-p' ? 'P' : product.id === 'igreja-quadrado-m' ? 'M' : undefined);
      // Variants must keep their own price and product image rather than the parent preview.
      return `
        <item>
          <g:id>${escapeXml(product.id)}</g:id>
          <g:title>${escapeXml(product.name)}</g:title>
          <g:description>${escapeXml(description)}</g:description>
          <g:link>${escapeXml(detailUrl)}</g:link>
          <g:image_link>${escapeXml(absoluteUrl(curated[0]))}</g:image_link>
          ${curated.slice(1, 10).map((src) => `<g:additional_image_link>${escapeXml(absoluteUrl(src))}</g:additional_image_link>`).join('')}
          <g:price>${price.toFixed(2)} BRL</g:price>
          ${hasSale ? `<g:sale_price>${product.promotionalPrice!.toFixed(2)} BRL</g:sale_price>` : ''}
          <g:availability>${product.available && (product.stock == null || product.stock > 0) ? 'in stock' : 'out of stock'}</g:availability>
          <g:condition>new</g:condition>
          <g:material>Cerâmica</g:material>
          <g:product_type>${escapeXml(TYPES[product.category] || 'Casa e decoração > Cerâmica')}</g:product_type>
          <g:google_product_category>${googleCategory(product.id, product.category)}</g:google_product_category>
          ${itemGroupId ? `<g:item_group_id>${escapeXml(itemGroupId)}</g:item_group_id>` : ''}
          ${groupSize ? `<g:size>${escapeXml(groupSize)}</g:size>` : ''}
          ${color ? `<g:color>${escapeXml(color)}</g:color>` : ''}
          <g:custom_label_0>${escapeXml(product.category)}</g:custom_label_0>
        </item>`;
    })
    .filter(Boolean)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Agô Trancoso — Catálogo de Produtos</title>
    <link>${escapeXml(SITE_DOMAIN)}</link>
    <description>Peças de cerâmica, decoração, presentes e lembranças disponíveis na Agô Trancoso.</description>
    ${offers}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
