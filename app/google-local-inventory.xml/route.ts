import { getCatalogOffers } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';
export const revalidate = 3600;

// Google Business Profile: keep this identifier as a string (20 digits).
const STORE_CODE = '17349608108258520233';

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  // Use the same canonical offer IDs and policy exclusion as google-merchant.xml.
  // The owner confirmed that available online items are also sold in the physical store.
  // Unknown quantities are conservatively marked limited, without inventing a count.
  // Prices inherit from the primary data source; no local price override is assumed.
  const items = getCatalogOffers()
    .filter(({ product }) => product.id !== 'cachimbo')
    .map(({ product }) => {
      const stock = product.stock;
      const availability = !product.available || stock === 0
        ? 'out_of_stock'
        : stock == null || stock < 3 ? 'limited_availability' : 'in_stock';
      return [
        '    <item>',
        '      <g:id>' + escapeXml(product.id) + '</g:id>',
        '      <g:store_code>' + STORE_CODE + '</g:store_code>',
        '      <g:availability>' + availability + '</g:availability>',
        '    </item>',
      ].join('\n');
    }).join('\n');
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">',
    '  <channel>',
    '    <title>Agô Trancoso — Inventário local</title>',
    '    <link>' + escapeXml(SITE_DOMAIN) + '</link>',
    '    <description>Disponibilidade dos produtos na loja física de Trancoso, Brasil.</description>',
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');
  return new Response(xml, { headers: {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
  } });
}
