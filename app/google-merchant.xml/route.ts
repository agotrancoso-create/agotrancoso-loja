import { getAllProducts } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export const dynamic = 'force-static';
export const revalidate = 3600;

const SHOPPING_COPY: Record<string, { title: string; description: string }> = {
  'igreja-quadrado-p': {
    title: 'Igrejinha de Trancoso em Cerâmica P | Agô Trancoso',
    description: 'Miniatura artesanal em cerâmica inspirada na Igreja de São João Batista, a famosa Igrejinha do Quadrado de Trancoso, Bahia. Pintada à mão pela Agô Trancoso para decorar, presentear ou guardar como lembrança da vila.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha de Trancoso em Cerâmica M | Agô Trancoso',
    description: 'Igrejinha de Trancoso em cerâmica tamanho M, inspirada na Igreja de São João Batista do Quadrado. Peça artesanal feita à mão pela Agô Trancoso, com a fachada e os elementos que remetem a um dos símbolos mais conhecidos da vila.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado de Trancoso em Cerâmica GG | Agô',
    description: 'Escultura artesanal em cerâmica inspirada na Igreja de São João Batista, no Quadrado de Trancoso. Versão GG modelada à mão pela Agô Trancoso, pensada como peça de destaque para decoração e coleção.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha de Trancoso Luminária em Cerâmica | Agô',
    description: 'Luminária artesanal em cerâmica inspirada na Igrejinha do Quadrado de Trancoso. Modelada à mão pela Agô Trancoso e criada para receber vela LED ou vela pequena, trazendo a fachada da igreja para a decoração.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha de Trancoso em Cerâmica | Agô',
    description: 'Ímã artesanal em cerâmica inspirado na Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Uma lembrança pintada à mão pela Agô Trancoso para levar um símbolo da vila para o dia a dia.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igrejinha de Trancoso em Cerâmica | Agô',
    description: 'Colar artesanal em cerâmica inspirado na fachada da Igreja de São João Batista do Quadrado de Trancoso. Uma peça discreta, modelada à mão pela Agô Trancoso, para usar ou presentear.',
  },
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

function productType(category: string) {
  const labels: Record<string, string> = {
    igrejinhas: 'Artesanato > Cerâmica > Igrejinhas de Trancoso',
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
      const mainImage = product.images?.[0] ? absoluteUrl(product.images[0]) : `${SITE_DOMAIN}/images/placeholder.svg`;
      const additionalImages = (product.images ?? []).slice(1, 10);
      const shoppingCopy = SHOPPING_COPY[product.id];
      const title = shoppingCopy?.title ?? product.name;
      const description = shoppingCopy?.description ?? product.description;

      return `
        <item>
          <g:id>${escapeXml(product.id)}</g:id>
          <g:title>${escapeXml(title)}</g:title>
          <g:description>${escapeXml(description)}</g:description>
          <g:link>${escapeXml(`${SITE_DOMAIN}/produtos/${product.id}`)}</g:link>
          <g:image_link>${escapeXml(mainImage)}</g:image_link>
          ${additionalImages.map((image) => `<g:additional_image_link>${escapeXml(absoluteUrl(image))}</g:additional_image_link>`).join('\n          ')}
          <g:availability>in_stock</g:availability>
          <g:condition>new</g:condition>
          <g:price>${product.price.toFixed(2)} BRL</g:price>
          ${hasSale ? `<g:sale_price>${product.promotionalPrice!.toFixed(2)} BRL</g:sale_price>` : ''}
          <g:brand>Agô Trancoso</g:brand>
          <g:mpn>${escapeXml(`AGO-${product.id.toUpperCase()}`)}</g:mpn>
          <g:product_type>${escapeXml(productType(product.category))}</g:product_type>
        </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Agô Trancoso</title>
    <link>${escapeXml(SITE_DOMAIN)}</link>
    <description>Cerâmica artesanal e Igrejinhas de Trancoso feitas à mão.</description>
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
