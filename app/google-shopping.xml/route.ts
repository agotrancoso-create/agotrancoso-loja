import { getAllCategories, getAllProducts, getEffectivePrice } from '@/lib/products';
import { getAttentionOrderedImages } from '@/lib/merchandising';
import { getShippingPrice } from '@/lib/shipping';
import { SITE_DOMAIN } from '@/lib/config';
import type { Product } from '@/lib/types';

// RSS 2.0 public product source for Google Merchant Center.
// This route has no connection to the storefront layout, cart or checkout.
export const dynamic = 'force-dynamic';

function escapeXml(value: string | number): string {
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function element(name: string, value: string | number): string {
  return '<' + name + '>' + escapeXml(value) + '</' + name + '>';
}

function brl(value: number): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('Invalid BRL value in Merchant Center source');
  }
  return value.toFixed(2) + ' BRL';
}

function productEntry(product: Product, categories: Map<string, string>): string {
  // Follow the same gallery used by the product page, including the deliberately
  // reversed historical image filenames for Igrejinha P and Luminária.
  const images = getAttentionOrderedImages(product).filter((image) =>
    /^\/produtos\/.+\.(?:jpe?g|png|webp)$/i.test(image),
  );
  if (!images.length) {
    throw new Error('Product has no supported Merchant Center image: ' + product.id);
  }

  const currentPrice = getEffectivePrice(product);
  const hasSale = product.promotionalPrice != null && product.promotionalPrice < product.price;
  const shippingPrice = getShippingPrice(currentPrice);
  const productUrl = SITE_DOMAIN + '/produtos/' + encodeURIComponent(product.id);
  const absoluteImage = (image: string) => new URL(image, SITE_DOMAIN).toString();

  return [
    '<item>',
    element('g:id', product.id),
    element('g:title', product.name),
    element('g:description', product.description),
    element('g:link', productUrl),
    element('g:image_link', absoluteImage(images[0])),
    ...images.slice(1, 10).map((image) => element('g:additional_image_link', absoluteImage(image))),
    element('g:availability', product.available ? 'in_stock' : 'out_of_stock'),
    element('g:condition', 'new'),
    element('g:price', brl(product.price)),
    ...(hasSale ? [element('g:sale_price', brl(product.promotionalPrice as number))] : []),
    element('g:brand', 'Agô Trancoso'),
    // These original handmade pieces have no assigned GTIN or manufacturer part number.
    element('g:identifier_exists', 'no'),
    element('g:product_type', categories.get(product.category) || 'Cerâmica artesanal'),
    '<g:shipping>',
    element('g:country', 'BR'),
    element('g:service', 'PAC'),
    element('g:price', brl(shippingPrice)),
    '</g:shipping>',
    '</item>',
  ].join('\n');
}

export function GET(): Response {
  const categories = new Map(getAllCategories().map((category) => [category.id, category.name]));
  const items = getAllProducts().map((product) => productEntry(product, categories)).join('\n');
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '<channel>',
    element('title', 'Agô Trancoso — Produtos artesanais'),
    element('link', SITE_DOMAIN),
    element('description', 'Catálogo oficial de cerâmica artesanal da Agô Trancoso.'),
    items,
    '</channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
