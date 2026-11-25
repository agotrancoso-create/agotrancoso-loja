import { getCatalogOffers } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';

const csv = (value: string | number) => '"' + String(value).replace(/"/g, '""') + '"';
const url = (path: string) => new URL(path, SITE_DOMAIN).href;

export function GET() {
  const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'item_group_id', 'size', 'color', 'sale_price'];
  const rows = getCatalogOffers().flatMap(({ product: p, groupId, size, color }) => {
    const image = p.images.find(i => i && !i.includes('placeholder') && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(i));
    if (p.displayOnly || !image || !Number.isFinite(p.price) || p.price <= 0) return [];
    const available = p.available && (p.stock == null || p.stock > 0);
    const sale = p.promotionalPrice != null && p.promotionalPrice > 0 && p.promotionalPrice < p.price
      ? p.promotionalPrice.toFixed(2) + ' BRL' : '';
    return [[p.id, p.name, p.description, available ? 'in stock' : 'out of stock', 'new',
      p.price.toFixed(2) + ' BRL', url('/produtos/' + encodeURIComponent(p.id)), url(image),
      'Agô Trancoso', groupId ?? '', size ?? '', color ?? '', sale]];
  });
  return new Response([headers, ...rows].map(row => row.map(csv).join(',')).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}
