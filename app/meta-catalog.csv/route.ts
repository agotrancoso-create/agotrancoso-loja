import { getCatalogOffers } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';

const csv = (value: string | number) => '"' + String(value).replace(/"/g, '""') + '"';
const url = (path: string) => new URL(path, SITE_DOMAIN).href;

// A curadoria afeta SOMENTE o feed da Meta. A galeria, os arquivos e a ordem do site
// permanecem intactos. Uma foto só pode aparecer se pertencer à galeria dessa oferta.
// Fotos futuras acrescentadas à galeria do site entram automaticamente ao final.
const metaPhotoOrder: Record<string, readonly string[]> = {
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'casinha-luminaria': [
    '/produtos/catalogo/casinha-luminaria-1.jpg',
    '/produtos/casinha-luminaria.jpg',
    '/produtos/catalogo/casinha-luminaria-2.jpg',
    '/produtos/catalogo/casinha-luminaria-3.jpg',
    '/produtos/catalogo/casinha-luminaria-4.jpg',
  ],
  'miniatura-quadrado-trancoso': [
    '/produtos/catalogo/miniatura-quadrado-trancoso-5.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-2.jpg',
  ],
  'estatueta-iemanja': [
    '/produtos/catalogo/estatueta-iemanja-1.jpg',
    '/produtos/catalogo/estatueta-iemanja-4.jpg',
    '/produtos/catalogo/estatueta-iemanja-2.jpg',
    '/produtos/catalogo/estatueta-iemanja-3.jpg',
  ],
  'casal-pretos-velhos': [
    '/produtos/catalogo/casal-pretos-velhos-1.jpg',
    '/produtos/atualizadas-20261013/casal-pretos-velhos-3.jpg',
    '/produtos/catalogo/casal-pretos-velhos-2.jpg',
  ],
  'divino-espirito-santo': [
    '/produtos/catalogo/divino-espirito-santo-2.jpg',
    '/produtos/divino-espirito-santo.jpg',
  ],
};

// A Meta aceita até 20 fotos adicionais/2.000 caracteres no atributo.
// Não tentamos converter AVIF, redimensionar, recortar ou recriar originais.
const META_IMAGE_EXTENSIONS = /\.(?:jpe?g|png|webp)(?:\?|$)/i;
const MAX_ADDITIONAL_IMAGES = 20;
const MAX_ADDITIONAL_CHARS = 2000;

function imagesForMeta(product: { id: string; images: string[] }): string[] {
  const eligible = Array.from(new Set(
    (product.images ?? [])
      .filter((path): path is string =>
        typeof path === 'string' &&
        path.startsWith('/produtos/') &&
        !path.includes('..') &&
        !path.includes('placeholder') &&
        META_IMAGE_EXTENSIONS.test(path)
      )
  ));

  // Cada preferência é usada somente quando a foto existe na galeria original.
  // As demais seguem na ordem atual, inclusive novas fotos adicionadas ao site.
  const preferred = metaPhotoOrder[product.id] ?? [];
  const ordered = [
    ...preferred.filter(path => eligible.includes(path)),
    ...eligible,
  ];
  return Array.from(new Set(ordered)).map(url);
}

export function GET() {
  const headers = [
    'id', 'title', 'description', 'availability', 'condition', 'price',
    'link', 'image_link', 'brand', 'item_group_id', 'size', 'color',
    'sale_price', 'custom_label_0', 'additional_image_link',
  ];
  const rows = getCatalogOffers().flatMap(({ product: p, groupId, size, color }) => {
    // getCatalogOffers() já isola cada tamanho/acabamento em um ID próprio;
    // jamais combinamos imagens entre opções, ainda que pertençam ao mesmo grupo.
    const images = imagesForMeta(p);
    const image = images[0];
    if (p.displayOnly || !image || !Number.isFinite(p.price) || p.price <= 0) return [];

    const additional: string[] = [];
    for (const candidate of images.slice(1)) {
      if (additional.length >= MAX_ADDITIONAL_IMAGES) break;
      if ([...additional, candidate].join(',').length > MAX_ADDITIONAL_CHARS) continue;
      additional.push(candidate);
    }

    const available = p.available && (p.stock == null || p.stock > 0);
    const sale = p.promotionalPrice != null && p.promotionalPrice > 0 && p.promotionalPrice < p.price
      ? p.promotionalPrice.toFixed(2) + ' BRL' : '';

    return [[
      p.id, p.name, p.description, available ? 'in stock' : 'out of stock',
      'new', p.price.toFixed(2) + ' BRL',
      url('/produtos/' + encodeURIComponent(p.id)),
      image, 'Agô Trancoso', groupId ?? '', size ?? '', color ?? '',
      sale, 'ago-site-automatico', additional.join(','),
    ]];
  });

  return new Response(
    [headers, ...rows].map(row => row.map(csv).join(',')).join('\r\n') + '\r\n',
    { headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    } },
  );
}
