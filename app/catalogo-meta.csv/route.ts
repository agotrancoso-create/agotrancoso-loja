import { getCatalogOffers, getEffectivePrice } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

// Feed público: https://www.agotrancoso.com.br/catalogo-meta.csv
// Gerado a partir das mesmas fichas de produto e variantes usadas no checkout.
// Atualiza com o deploy do site; a Meta deve buscar o link em intervalos regulares.
// Omitimos "cachimbo" para evitar listagem de possível acessório de tabaco,
// restrito pelas Políticas de Comércio da Meta/WhatsApp.
// A Agô revende as peças; "Sem marca" NÃO atribui fabricação à loja.

export const revalidate = 3600;

const CATEGORIES: Record<string, string> = {
  igrejinhas: 'Igrejinhas e luminárias',
  trancoso: 'Lembranças de Trancoso',
  decoracao: 'Decoração em cerâmica',
  'fe-devocao': 'Peças religiosas e devocionais',
  presentes: 'Presentes e acessórios',
};

const JPEG_HERO: Record<string, string> = {
  'igreja-quadrado-gg': '/pinterest/pins-v2/21-igreja-quadrado-gg.jpg',
  'igrejinha-luminaria-trancoso': '/pinterest/pins-v2/02-igrejinha-luminaria-trancoso.jpg',
};

const HEADERS = [
  'id', 'title', 'description', 'availability', 'condition', 'price', 'link',
  'image_link', 'brand', 'identifier_exists', 'product_type',
  'item_group_id', 'size', 'color', 'material',
  'sale_price',
];

function fullUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : SITE_DOMAIN + (path.startsWith('/') ? path : '/' + path);
}

function escapeCsv(input: unknown): string {
  const normalized = String(input ?? '').replace(/[\r\n]+/g, ' ').trim();
  return '"' + normalized.replace(/"/g, '""') + '"';
}

export async function GET() {
  const offers = getCatalogOffers()
    .filter(({ product }) =>
      product.id !== 'cachimbo' &&
      !product.displayOnly &&
      product.available &&
      (product.stock == null || product.stock > 0) &&
      Number.isFinite(product.price) &&
      product.price > 0
    )
    .map(({ product, groupId, size, color }) => {
      const preferred = product.images?.[0] ?? '';
      const image = JPEG_HERO[product.id] ?? preferred;
      if (!image || !/\.(?:jpe?g|png)$/i.test(image)) return null;

      const discounted = getEffectivePrice(product);
      if (!Number.isFinite(discounted) || discounted <= 0) return null;
      const hasDiscount = discounted < product.price;

      const row: Record<string, string> = {
        id: product.id,
        title: product.name,
        description: (product.description || product.name).replace(/\s+/g, ' ').trim(),
        availability: 'in stock',
        condition: 'new',
        price: product.price.toFixed(2) + ' BRL',
        link: fullUrl('/produtos/' + encodeURIComponent(product.id)),
        image_link: fullUrl(image),
        brand: 'Sem marca',
        identifier_exists: 'no',
        product_type: CATEGORIES[product.category] || 'Decoração em cerâmica',
        item_group_id: groupId ?? '',
        size: size ?? '',
        color: color ?? '',
        material: 'Cerâmica',
        sale_price: hasDiscount ? discounted.toFixed(2) + ' BRL' : '',
      };
      return HEADERS.map((header) => escapeCsv(row[header])).join(',');
    })
    .filter((row): row is string => Boolean(row));

  const csv = '\uFEFF' + HEADERS.map(escapeCsv).join(',') + '\r\n' +
    offers.join('\r\n') + '\r\n';

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'inline; filename="catalogo-meta-ago.csv"',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
