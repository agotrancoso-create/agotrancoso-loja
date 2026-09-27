import { Product } from './types';

// Ordem editorial e comercial da vitrine.
// A sequência prioriza, nesta ordem: reconhecimento imediato de Trancoso,
// contraste visual entre peças, faixa de entrada acessível, variedade e
// facilidade de decisão. Peças de ticket muito alto entram depois da primeira
// dobra para não criarem uma âncora de preço pesada logo no início.
export const ATTENTION_PRODUCT_ORDER = [
  'igreja-quadrado-p',
  'igrejinha-luminaria-trancoso',
  'miniatura-quadrado-trancoso',
  'igreja-quadrado-m',
  'colar-igreja-quadrado',
  'ima-igrejinha-trancoso',
  'casinha-luminaria',
  'cruzeiro-do-quadrado',
  'igreja-quadrado-gg',
  'mobile-trancoso',
  'estatueta-iemanja',
  'nossa-senhora-grande',
  'presepio-em-ceramica',
  'casal-pretos-velhos',
  'nossa-senhora-aparecida',
  'divino-espirito-santo',
  'rosario-trancoso',
  'terco-em-ceramica',
  'esfera-decorativa',
] as const;

const attentionRank = new Map<string, number>(ATTENTION_PRODUCT_ORDER.map((id, index) => [id, index]));

export function sortProductsByAttention<T extends Product>(products: T[]): T[] {
  return [...products].sort((a, b) => {
    const rankA = attentionRank.get(a.id) ?? Number.MAX_SAFE_INTEGER;
    const rankB = attentionRank.get(b.id) ?? Number.MAX_SAFE_INTEGER;
    return rankA - rankB;
  });
}

/**
 * Curadoria fotográfica da vitrine.
 *
 * A primeira imagem é sempre a capa. A sequência foi organizada para reduzir
 * distração e facilitar reconhecimento: primeiro uma leitura clara/frontal da
 * peça, depois variações/ângulos e por último contexto ou composição de apoio.
 *
 * Importante: o mapa só reordena arquivos que já pertencem ao produto; qualquer
 * nova foto não listada continua aparecendo ao final, sem risco de sumir da
 * galeria.
 */
const ATTENTION_IMAGE_ORDER: Record<string, string[]> = {
  'igreja-quadrado-p': [
    '/produtos/igreja-quadrado-p.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'casinha-luminaria': [
    '/produtos/catalogo/casinha-luminaria-1.jpg',
    '/produtos/catalogo/casinha-luminaria-2.jpg',
    '/produtos/catalogo/casinha-luminaria-3.jpg',
    '/produtos/catalogo/casinha-luminaria-4.jpg',
  ],
  // Capa anterior removida a pedido da proprietária. A foto 04 passa a ser a
  // leitura principal; 05 e 02 entram como vistas complementares.
  'miniatura-quadrado-trancoso': [
    '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-5.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-2.jpg',
  ],
  'estatueta-iemanja': [
    '/produtos/catalogo/estatueta-iemanja-1.jpg',
    '/produtos/catalogo/estatueta-iemanja-2.jpg',
    '/produtos/catalogo/estatueta-iemanja-3.jpg',
    '/produtos/catalogo/estatueta-iemanja-4.jpg',
  ],
  'nossa-senhora-grande': [
    '/produtos/catalogo/nossa-senhora-grande-2.jpg',
    '/produtos/catalogo/nossa-senhora-grande-1.jpg',
  ],
  'casal-pretos-velhos': [
    '/produtos/catalogo/casal-pretos-velhos-1.jpg',
    '/produtos/catalogo/casal-pretos-velhos-2.jpg',
    '/produtos/catalogo/casal-pretos-velhos-3.jpg',
  ],
  'divino-espirito-santo': [
    '/produtos/divino-espirito-santo.jpg',
    '/produtos/catalogo/divino-espirito-santo-2.jpg',
  ],
  'esfera-decorativa': [
    '/produtos/esfera-decorativa.jpg',
    '/produtos/catalogo/esfera-decorativa-2.jpg',
  ],
  'colar-igreja-quadrado': [
    '/produtos/catalogo/colar-igreja-quadrado-frente.jpg',
    '/produtos/colar-igreja-quadrado.jpg',
  ],
  'ima-igrejinha-trancoso': [
    '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg',
    '/produtos/catalogo/ima-igrejinha-trancoso-conjunto.jpg',
  ],
};

export function getAttentionOrderedImages(product: Product): string[] {
  const images = (product.images ?? []).filter(Boolean);
  if (!images.length) return [];

  const preferred = ATTENTION_IMAGE_ORDER[product.id] ?? [];
  if (!preferred.length) return images;

  const available = new Set(images);
  const ordered = preferred.filter((image) => available.has(image));
  const orderedSet = new Set(ordered);
  return [...ordered, ...images.filter((image) => !orderedSet.has(image))];
}

export function getAttentionCoverImage(product: Product): string {
  return getAttentionOrderedImages(product)[0] ?? '/images/placeholder.svg';
}

const RELATED_PRODUCTS: Record<string, string[]> = {
  'igreja-quadrado-p': ['colar-igreja-quadrado', 'ima-igrejinha-trancoso', 'igrejinha-luminaria-trancoso', 'miniatura-quadrado-trancoso'],
  'igreja-quadrado-m': ['igrejinha-luminaria-trancoso', 'colar-igreja-quadrado', 'ima-igrejinha-trancoso', 'miniatura-quadrado-trancoso'],
  'igreja-quadrado-gg': ['igrejinha-luminaria-trancoso', 'miniatura-quadrado-trancoso', 'mobile-trancoso', 'colar-igreja-quadrado'],
  'igrejinha-luminaria-trancoso': ['igreja-quadrado-p', 'casinha-luminaria', 'colar-igreja-quadrado', 'ima-igrejinha-trancoso'],
  'miniatura-quadrado-trancoso': ['igreja-quadrado-p', 'cruzeiro-do-quadrado', 'colar-igreja-quadrado', 'ima-igrejinha-trancoso'],
  'casinha-luminaria': ['igrejinha-luminaria-trancoso', 'miniatura-quadrado-trancoso', 'esfera-decorativa', 'mobile-trancoso'],
  'colar-igreja-quadrado': ['igreja-quadrado-p', 'ima-igrejinha-trancoso', 'miniatura-quadrado-trancoso', 'igrejinha-luminaria-trancoso'],
  'ima-igrejinha-trancoso': ['colar-igreja-quadrado', 'igreja-quadrado-p', 'miniatura-quadrado-trancoso', 'cruzeiro-do-quadrado'],
  'mobile-trancoso': ['casinha-luminaria', 'miniatura-quadrado-trancoso', 'igreja-quadrado-m', 'esfera-decorativa'],
  'estatueta-iemanja': ['nossa-senhora-aparecida', 'divino-espirito-santo', 'terco-em-ceramica', 'rosario-trancoso'],
  'nossa-senhora-grande': ['terco-em-ceramica', 'divino-espirito-santo', 'nossa-senhora-aparecida', 'rosario-trancoso'],
  'presepio-em-ceramica': ['nossa-senhora-aparecida', 'divino-espirito-santo', 'terco-em-ceramica', 'nossa-senhora-grande'],
  'casal-pretos-velhos': ['estatueta-iemanja', 'divino-espirito-santo', 'nossa-senhora-aparecida', 'terco-em-ceramica'],
  'nossa-senhora-aparecida': ['terco-em-ceramica', 'divino-espirito-santo', 'nossa-senhora-grande', 'rosario-trancoso'],
  'divino-espirito-santo': ['terco-em-ceramica', 'nossa-senhora-aparecida', 'rosario-trancoso', 'nossa-senhora-grande'],
  'rosario-trancoso': ['terco-em-ceramica', 'divino-espirito-santo', 'nossa-senhora-aparecida', 'igreja-quadrado-p'],
  'terco-em-ceramica': ['rosario-trancoso', 'nossa-senhora-aparecida', 'divino-espirito-santo', 'nossa-senhora-grande'],
  'cruzeiro-do-quadrado': ['miniatura-quadrado-trancoso', 'igreja-quadrado-p', 'colar-igreja-quadrado', 'ima-igrejinha-trancoso'],
  'esfera-decorativa': ['casinha-luminaria', 'mobile-trancoso', 'miniatura-quadrado-trancoso', 'igreja-quadrado-p'],
};

export function getRelatedProductIds(productId: string): string[] {
  return RELATED_PRODUCTS[productId] ?? [];
}
