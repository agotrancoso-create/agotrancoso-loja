import { getAllProducts } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';
export const revalidate = 3600;

const IGREJINHA_IDS = new Set([
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
]);

function escapeXml(value: string) {
  return value
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

export async function GET() {
  const products = getAllProducts().filter((product) => product.available && product.images?.length);

  const productEntries = products
    .map((product) => {
      const images = product.images
        .filter(Boolean)
        .slice(0, 1000)
        .map((image) => `\n    <image:image>\n      <image:loc>${escapeXml(absoluteUrl(image))}</image:loc>\n    </image:image>`)
        .join('');

      return `\n  <url>\n    <loc>${escapeXml(`${SITE_DOMAIN}/produtos/${product.id}`)}</loc>${images}\n  </url>`;
    })
    .join('');

  const igrejinhaImages = products
    .filter((product) => IGREJINHA_IDS.has(product.id))
    .flatMap((product) => product.images)
    .filter(Boolean)
    .filter((image, index, all) => all.indexOf(image) === index)
    .slice(0, 1000)
    .map((image) => `\n    <image:image>\n      <image:loc>${escapeXml(absoluteUrl(image))}</image:loc>\n    </image:image>`)
    .join('');

  const landingEntry = `\n  <url>\n    <loc>${escapeXml(`${SITE_DOMAIN}/igrejinha-de-trancoso`)}</loc>${igrejinhaImages}\n  </url>`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${landingEntry}${productEntries}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
