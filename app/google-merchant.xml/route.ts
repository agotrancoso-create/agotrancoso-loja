import { getCatalogOffers, getEffectivePrice } from '@/lib/products';
import { getAttentionOrderedImages } from '@/lib/merchandising';
import { SITE_DOMAIN } from '@/lib/config';
import { getShippingPrice } from '@/lib/shipping';
import { getPieceMeasurements, getParcelMeasurements } from '@/lib/catalog-measurements';

export const dynamic = 'force-static';
export const revalidate = 3600;

const SHOPPING_COPY: Record<string, { title: string; description: string }> = {
  'igreja-quadrado-p': {
    title: 'Igrejinha do Quadrado de Trancoso P em Cerâmica | Agô',
    description: 'Miniatura em cerâmica da Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso, tamanho P. Peça decorativa para apoiar e presentear, disponível na Agô Trancoso.',
  },
  'igreja-quadrado-m': {
    title: 'Igrejinha do Quadrado de Trancoso M em Cerâmica | Agô',
    description: 'Miniatura em cerâmica da Igreja de São João Batista, no Quadrado de Trancoso, tamanho M. Uma referência da vila para prateleiras e aparadores.',
  },
  'igreja-quadrado-gg': {
    title: 'Igreja do Quadrado de Trancoso GG — Luminária em Cerâmica | Agô',
    description: 'Escultura em cerâmica da Igreja do Quadrado de Trancoso na versão GG. Mede 16 cm de altura e 23 cm de largura e também funciona como luminária.',
  },
  'igrejinha-luminaria-trancoso': {
    title: 'Igrejinha Luminária do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Luminária em cerâmica inspirada na Igreja de São João Batista, no Quadrado de Trancoso. Mede 6,5 cm de altura e 7,5 cm de largura e pode receber vela LED ou vela pequena.',
  },
  'casinha-luminaria': {
    title: 'Casinha Luminária em Cerâmica Inspirada em Trancoso | Agô',
    description: 'Casinha luminária em cerâmica inspirada no casario de Trancoso. A luz aparece pelas portas e janelas quando usada com vela LED ou rechaud.',
  },
  'miniatura-quadrado-trancoso': {
    title: 'Miniatura do Quadrado de Trancoso em Cerâmica para Pendurar | Agô',
    description: 'Miniatura do Quadrado de Trancoso em cerâmica, com casinhas coloridas e igrejinha. Pode ser pendurada na parede ou apoiada em prateleiras e outros móveis.',
  },
  'cruzeiro-do-quadrado': {
    title: 'Cruzeiro do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Miniatura em cerâmica do Cruzeiro do Quadrado de Trancoso, referência do conjunto histórico da vila. Peça decorativa disponível na Agô.',
  },
  'mobile-trancoso': {
    title: 'Móbile de Casinhas de Trancoso em Cerâmica | Agô',
    description: 'Móbile em cerâmica com pequenas casinhas inspiradas no casario de Trancoso. Peça decorativa para pendurar e criar movimento com a brisa.',
  },
  'estatueta-iemanja': {
    title: 'Estatueta de Iemanjá em Cerâmica | Agô Trancoso',
    description: 'Representação de Iemanjá em cerâmica para altar, prateleira ou espaço de fé e devoção. Disponível para compra online na Agô Trancoso.',
  },
  'nossa-senhora-grande': {
    title: 'Nossa Senhora Grande em Cerâmica | Agô Trancoso',
    description: 'Imagem grande de Nossa Senhora em cerâmica, com detalhes nas vestes. Peça para altar doméstico ou ambiente dedicado à devoção.',
  },
  'presepio-em-ceramica': {
    title: 'Presépio em Cerâmica com 5 Peças | Agô Trancoso',
    description: 'Presépio em cerâmica com cinco peças: Menino Jesus, Maria, José, anjo e Estrela de Belém. Conjunto para decoração de Natal em mesa, prateleira ou aparador.',
  },
  'casal-pretos-velhos': {
    title: 'Casal de Pretos-Velhos em Cerâmica | Agô Trancoso',
    description: 'Representação de um casal de Pretos-Velhos em cerâmica, com elementos da tradição de fé, respeito e ancestralidade. Disponível na Agô Trancoso.',
  },
  'nossa-senhora-aparecida': {
    title: 'Nossa Senhora Aparecida em Cerâmica | Agô Trancoso',
    description: 'Imagem de Nossa Senhora Aparecida em cerâmica, com manto azul e detalhes dourados. Para espaço de oração, altar ou presente de devoção.',
  },
  'divino-espirito-santo': {
    title: 'Divino Espírito Santo de Parede em Cerâmica | Agô Trancoso',
    description: 'Peça circular em cerâmica com a pomba do Divino Espírito Santo em relevo. Indicada para pendurar em paredes internas e compor espaços de fé.',
  },
  'terco-em-ceramica': {
    title: 'Terço em Cerâmica com Contas Brancas | Agô Trancoso',
    description: 'Terço com contas brancas de cerâmica e cruz na extremidade. Para momentos de oração ou para compor um espaço de fé e devoção.',
  },
  'rosario-trancoso': {
    title: 'Rosário com Igreja do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Rosário de contas de cerâmica com medalhão que representa a Igreja do Quadrado de Trancoso, unindo devoção e uma referência da vila.',
  },
  'esfera-decorativa': {
    title: 'Esfera Decorativa em Cerâmica Terracota | Agô Trancoso',
    description: 'Esfera decorativa em cerâmica de tom terroso com desenhos florais claros. Para compor mesas, aparadores e estantes, sozinha ou com outras peças.',
  },
  'colar-igreja-quadrado': {
    title: 'Colar da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Colar com pingente em cerâmica inspirado na Igreja de São João Batista, no Quadrado de Trancoso. Lembrança da vila para usar ou presentear.',
  },
  'ima-igrejinha-trancoso': {
    title: 'Ímã da Igrejinha do Quadrado de Trancoso em Cerâmica | Agô',
    description: 'Ímã em cerâmica com a fachada da Igreja de São João Batista, a Igrejinha do Quadrado de Trancoso. Pequena lembrança para usar ou presentear.',
  },
  'rabo-de-baleia': {
    title: 'Rabo de Baleia Decorativo em Cerâmica P, M e G | Agô Trancoso',
    description: 'Escultura decorativa em cerâmica em forma de cauda de baleia. Disponível nos tamanhos P, M e G, com alturas de 10, 12 e 16 cm.',
  },
  'sagrada-familia': {
    title: 'Sagrada Família em Cerâmica Colorida ou Dourada | Agô',
    description: 'Sagrada Família em cerâmica com José, Maria e Menino Jesus. Disponível nos acabamentos colorido e dourado; a versão colorida pode ser pendurada ou apoiada.',
  },
  'cachimbo': {
    title: 'Cachimbo Decorativo em Cerâmica Terracota | Agô Trancoso',
    description: 'Cachimbo decorativo em cerâmica terracota com flores claras pintadas na superfície. Mede 10 cm de comprimento e está disponível na Agô Trancoso.',
  },
};

const SHOPPING_SHORT_TITLES: Record<string, string> = {
  'igreja-quadrado-p': 'Igrejinha de Trancoso P',
  'igreja-quadrado-m': 'Igrejinha de Trancoso M',
  'igreja-quadrado-gg': 'Igreja de Trancoso GG Luminária',
  'igrejinha-luminaria-trancoso': 'Igrejinha Luminária de Trancoso',
  'casinha-luminaria': 'Casinha Luminária em Cerâmica',
  'miniatura-quadrado-trancoso': 'Miniatura do Quadrado de Trancoso',
  'cruzeiro-do-quadrado': 'Cruzeiro do Quadrado de Trancoso',
  'mobile-trancoso': 'Móbile de Casinhas de Trancoso',
  'estatueta-iemanja': 'Iemanjá em Cerâmica',
  'nossa-senhora-grande': 'Nossa Senhora Grande em Cerâmica',
  'presepio-em-ceramica': 'Presépio em Cerâmica 5 Peças',
  'casal-pretos-velhos': 'Casal de Pretos-Velhos em Cerâmica',
  'nossa-senhora-aparecida': 'Nossa Senhora Aparecida em Cerâmica',
  'divino-espirito-santo': 'Divino Espírito Santo em Cerâmica',
  'terco-em-ceramica': 'Terço em Cerâmica',
  'rosario-trancoso': 'Rosário Trancoso em Cerâmica',
  'esfera-decorativa': 'Esfera Decorativa em Cerâmica',
  'colar-igreja-quadrado': 'Colar da Igreja do Quadrado',
  'ima-igrejinha-trancoso': 'Ímã da Igrejinha de Trancoso',
  'rabo-de-baleia': 'Rabo de Baleia em Cerâmica',
  'sagrada-familia': 'Sagrada Família em Cerâmica',
  'cachimbo': 'Cachimbo Decorativo em Cerâmica',
};

const SHOPPING_HIGHLIGHTS: Record<string, string[]> = {
  'igreja-quadrado-p': ['Miniatura em cerâmica da Igrejinha do Quadrado de Trancoso.', 'Tamanho P para apoiar na decoração ou presentear.'],
  'igreja-quadrado-m': ['Miniatura em cerâmica da Igrejinha do Quadrado de Trancoso.', 'Tamanho M para prateleiras, aparadores e nichos.'],
  'igreja-quadrado-gg': ['Escultura em cerâmica com 16 cm de altura e 23 cm de largura.', 'Também funciona como luminária decorativa.'],
  'igrejinha-luminaria-trancoso': ['Luminária em cerâmica com 6,5 cm de altura e 7,5 cm de largura.', 'Pode receber vela LED ou vela pequena no interior.'],
  'casinha-luminaria': ['Casinha em cerâmica inspirada no casario de Trancoso.', 'A luz aparece pelas portas e janelas da peça.'],
  'miniatura-quadrado-trancoso': ['Miniatura em cerâmica do Quadrado de Trancoso.', 'Pode ser pendurada na parede ou apoiada.'],
  'cruzeiro-do-quadrado': ['Miniatura em cerâmica do Cruzeiro do Quadrado de Trancoso.', 'Referência do conjunto histórico da vila.'],
  'mobile-trancoso': ['Móbile com pequenas casinhas de cerâmica.', 'Peça para pendurar e criar movimento com a brisa.'],
  'estatueta-iemanja': ['Representação de Iemanjá em cerâmica.', 'Indicada para altar, prateleira ou espaço de devoção.'],
  'nossa-senhora-grande': ['Imagem grande de Nossa Senhora em cerâmica.', 'Indicada para altar doméstico ou espaço de devoção.'],
  'presepio-em-ceramica': ['Conjunto de presépio com cinco peças de cerâmica.', 'Inclui Menino Jesus, Maria, José, anjo e Estrela de Belém.'],
  'casal-pretos-velhos': ['Casal de Pretos-Velhos representado em cerâmica.', 'Peça ligada à tradição de fé, respeito e ancestralidade.'],
  'nossa-senhora-aparecida': ['Imagem de Nossa Senhora Aparecida em cerâmica.', 'Manto azul com detalhes dourados.'],
  'divino-espirito-santo': ['Peça circular em cerâmica com pomba em relevo.', 'Feita para pendurar em paredes internas.'],
  'terco-em-ceramica': ['Terço com contas brancas de cerâmica.', 'Cruz na extremidade para momentos de oração e devoção.'],
  'rosario-trancoso': ['Rosário com contas de cerâmica.', 'Medalhão com referência à Igreja do Quadrado de Trancoso.'],
  'esfera-decorativa': ['Esfera decorativa em cerâmica de tom terroso.', 'Desenhos florais claros para mesas, aparadores e estantes.'],
  'colar-igreja-quadrado': ['Pingente em cerâmica inspirado na Igreja do Quadrado.', 'Lembrança de Trancoso para usar ou presentear.'],
  'ima-igrejinha-trancoso': ['Ímã em cerâmica da Igrejinha do Quadrado de Trancoso.', 'Lembrança compacta para presentear.'],
  'rabo-de-baleia': ['Escultura decorativa em cerâmica em forma de cauda de baleia.', 'Tamanhos P, M e G com 10, 12 e 16 cm de altura.'],
  'sagrada-familia': ['Sagrada Família em cerâmica com José, Maria e Menino Jesus.', 'Disponível nos acabamentos colorido e dourado.'],
  'cachimbo': ['Peça decorativa em cerâmica terracota.', 'Mede 10 cm de comprimento.'],
};

// IDs oficiais da taxonomia Google Product Category. Mantemos as classes
// específicas apenas quando a natureza da peça é inequívoca; nas demais,
// usamos uma classe de decoração/religiosa ampla em vez de adivinhar atributos.
const GOOGLE_PRODUCT_CATEGORY_BY_ID: Record<string, number> = {
  'colar-igreja-quadrado': 196, // Joias > Colares
  'ima-igrejinha-trancoso': 5876, // Casa e jardim > Decoração > Ímãs de geladeira
  'igrejinha-luminaria-trancoso': 4636, // Casa e jardim > Iluminação > Luminárias
  'casinha-luminaria': 4636,
  'presepio-em-ceramica': 6531, // Casa e jardim > Decoração de Natal > Presépios
  'rosario-trancoso': 3923, // Material para cerimônias e eventos religiosos > Itens religiosos > Rosários
  'terco-em-ceramica': 3923,
  'mobile-trancoso': 696, // Casa e jardim > Decoração
  'esfera-decorativa': 696,
};

const IGREJA_VARIANTS: Record<string, { size: string; itemGroupId: string }> = {
  'igreja-quadrado-p': { size: 'P', itemGroupId: 'igreja-quadrado-trancoso' },
  'igreja-quadrado-m': { size: 'M', itemGroupId: 'igreja-quadrado-trancoso' },
  // A GG também funciona como luminária: não é apenas uma variação de tamanho
  // das miniaturas decorativas P/M. Mantê-la independente evita agrupamento indevido.
};

const IGREJINHA_IDS = new Set([
  'igreja-quadrado-p',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'igrejinha-luminaria-trancoso',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
]);

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
    igrejinhas: 'Artesanato > Cerâmica > Igrejinhas do Quadrado de Trancoso',
    trancoso: 'Artesanato > Cerâmica > Trancoso',
    decoracao: 'Casa e decoração > Cerâmica artesanal',
    'fe-devocao': 'Fé e devoção > Cerâmica artesanal',
    presentes: 'Presentes > Artesanato de Trancoso',
  };
  return labels[category] ?? 'Artesanato > Cerâmica artesanal';
}

function googleProductCategory(product: { id: string; category: string }) {
  const direct = GOOGLE_PRODUCT_CATEGORY_BY_ID[product.id];
  if (direct) return direct;
  if (product.category === 'fe-devocao') return 97; // Itens religiosos
  return 5609; // Casa e jardim > Decoração > Estatuetas
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
    // Functional smoking pipes cannot be listed on Shopping (including free listings).
    // Keep the item in the store; this exclusion is specific to the Google data source.
    .filter(({ product }) => product.id !== 'cachimbo')
    .map(({ product, groupId, size, color }) => {
      const hasSale = product.promotionalPrice != null && product.promotionalPrice < product.price;
      const effectivePrice = getEffectivePrice(product);
      const shippingPrice = getShippingPrice(effectivePrice);
      const curatedImages = getAttentionOrderedImages(product);
      const mainImage = curatedImages[0] ? absoluteUrl(curatedImages[0]) : `${SITE_DOMAIN}/images/placeholder.svg`;
      const additionalImages = curatedImages.slice(1, 10);
      const shoppingKey = product.id.startsWith('rabo-de-baleia-')
        ? 'rabo-de-baleia'
        : product.id.startsWith('sagrada-familia-')
          ? 'sagrada-familia'
          : product.id;
      const shoppingCopy = SHOPPING_COPY[shoppingKey];
      const baseShortTitle = SHOPPING_SHORT_TITLES[shoppingKey];
      const highlights = SHOPPING_HIGHLIGHTS[shoppingKey] ?? [];
      const variant = IGREJA_VARIANTS[product.id];
      const itemGroupId = groupId ?? variant?.itemGroupId;
      const itemSize = size ?? variant?.size;
      const isWhaleVariant = product.id.startsWith('rabo-de-baleia-');
      const isFamilyVariant = product.id.startsWith('sagrada-familia-');
      const title = isWhaleVariant
        ? `Rabo de Baleia em Cerâmica ${itemSize || ''} | Agô Trancoso`
        : isFamilyVariant
          ? `${product.name} | Agô Trancoso`
          : shoppingCopy?.title ?? product.name;
      const shortTitle = isWhaleVariant
        ? `Rabo de Baleia ${itemSize || ''} em Cerâmica`
        : isFamilyVariant
          ? product.name.replace('Sagrada Família em Cerâmica — ', 'Sagrada Família ')
          : baseShortTitle;
      const description = (isWhaleVariant || isFamilyVariant) ? product.description : shoppingCopy?.description ?? product.description;
      const isIgrejinha = IGREJINHA_IDS.has(product.id);
      const category = googleProductCategory(product);

      return `
        <item>
          <g:id>${escapeXml(product.id)}</g:id>
          <g:title>${escapeXml(title)}</g:title>
          ${shortTitle ? `<g:short_title>${escapeXml(shortTitle)}</g:short_title>` : ''}
          <g:description>${escapeXml(description)}</g:description>
          ${highlights.map((highlight) => `<g:product_highlight>${escapeXml(highlight)}</g:product_highlight>`).join('\n          ')}
          <g:link>${escapeXml(`${SITE_DOMAIN}/produtos/${product.id}`)}</g:link>
          <g:mobile_link>${escapeXml(`${SITE_DOMAIN}/produtos/${product.id}`)}</g:mobile_link>
          <g:image_link>${escapeXml(mainImage)}</g:image_link>
          ${additionalImages.map((image) => `<g:additional_image_link>${escapeXml(absoluteUrl(image))}</g:additional_image_link>`).join('\n          ')}
          <g:availability>${product.available ? 'in_stock' : 'out_of_stock'}</g:availability>
          <g:condition>new</g:condition>
          <g:price>${product.price.toFixed(2)} BRL</g:price>
          ${hasSale ? `<g:sale_price>${product.promotionalPrice!.toFixed(2)} BRL</g:sale_price>` : ''}
          <g:identifier_exists>no</g:identifier_exists>
          <g:material>Cerâmica</g:material>
          ${measurementTags(product.id)}
          <g:google_product_category>${category}</g:google_product_category>
          <g:product_type>${escapeXml(productType(product.category))}</g:product_type>
          ${product.dimensions ? `<g:product_detail>
            <g:section_name>Características</g:section_name>
            <g:attribute_name>Medidas</g:attribute_name>
            <g:attribute_value>${escapeXml(product.dimensions)}</g:attribute_value>
          </g:product_detail>` : ''}
          ${itemGroupId ? `<g:item_group_id>${escapeXml(itemGroupId)}</g:item_group_id>` : ''}
          ${itemSize ? `<g:size>${escapeXml(itemSize)}</g:size>` : ''}
          ${color ? `<g:color>${escapeXml(color)}</g:color>` : ''}
          ${isIgrejinha ? '<g:custom_label_0>Igrejinha do Quadrado de Trancoso</g:custom_label_0>' : ''}
          ${product.id === 'miniatura-quadrado-trancoso' ? '<g:custom_label_1>Decoração de parede</g:custom_label_1>' : ''}
          <g:shipping>
            <g:country>BR</g:country>
            <g:service>Entrega nacional</g:service>
            <g:price>${shippingPrice.toFixed(2)} BRL</g:price>
          </g:shipping>
        </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Agô Trancoso</title>
    <link>${escapeXml(SITE_DOMAIN)}</link>
    <description>Cerâmica artesanal, Igrejinhas do Quadrado e lembranças de Trancoso disponíveis na Agô Trancoso.</description>
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
