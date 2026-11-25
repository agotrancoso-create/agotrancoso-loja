import { getCatalogOffers } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';

const csv = (value: string | number) => '"' + String(value).replace(/"/g, '""') + '"';
const url = (path: string) => new URL(path, SITE_DOMAIN).href;

// Preferências de capa exclusivas da Meta; não alteram a galeria do site.
const preferredCover: Record<string, string> = {
  'casinha-luminaria': '/produtos/catalogo/casinha-luminaria-1.jpg',
};

export function GET() {
  const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'item_group_id', 'size', 'color', 'sale_price', 'custom_label_0', 'additional_image_link'];
  const rows = getCatalogOffers().flatMap(({ product: p, groupId, size, color }) => {
    // Mantém a ordem aprovada da galeria, com exceções explícitas de capa.
    // Variações usam somente as fotos da própria oferta, sem misturar acabamentos.
    const images = Array.from(new Set(p.images.filter(i => i && !i.includes('placeholder') && /\.(jpg|jpeg|png|webp)(\?|$)/i.test(i)).map(url)));
    const preferred = preferredCover[p.id] ? url(preferredCover[p.id]) : undefined;
    if (preferred && images.includes(preferred)) {
      images.splice(images.indexOf(preferred), 1);
      images.unshift(preferred);
    }
    const image = images[0];
    // Limites do campo Meta: 20 URLs adicionais e 2000 caracteres.
    const additional: string[] = [];
    for (const candidate of images.slice(1)) {
      if (additional.length >= 20) break;
      if ([...additional, candidate].join(',').length > 2000) continue;
      additional.push(candidate);
    }
    if (p.displayOnly || !image || !Number.isFinite(p.price) || p.price <= 0) return [];
    const available = p.available && (p.stock == null || p.stock > 0);
    const sale = p.promotionalPrice != null && p.promotionalPrice > 0 && p.promotionalPrice < p.price
      ? p.promotionalPrice.toFixed(2) + ' BRL' : '';
    return [[p.id, p.name, p.description, available ? 'in stock' : 'out of stock', 'new',
      p.price.toFixed(2) + ' BRL', url('/produtos/' + encodeURIComponent(p.id)), url(image),
      'Agô Trancoso', groupId ?? '', size ?? '', color ?? '', sale, 'ago-site-automatico', additional.join(',')]];
  });
  return new Response([headers, ...rows].map(row => row.map(csv).join(',')).join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}
