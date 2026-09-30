import { Product } from './types';

// Ordem editorial e comercial da vitrine.
// Prioriza reconhecimento imediato de Trancoso, força visual da fotografia,
// variedade de formatos, entrada de preço acessível e progressão de ticket.
// O Casal de Pretos-Velhos sobe na curadoria para ganhar mais descoberta sem
// substituir as peças-símbolo de Trancoso no topo da coleção.
export const ATTENTION_PRODUCT_ORDER = [
  'miniatura-quadrado-trancoso',
  'igreja-quadrado-p',
  'igrejinha-luminaria-trancoso',
  'igreja-quadrado-m',
  'casal-pretos-velhos',
  'casinha-luminaria',
  'ima-igrejinha-trancoso',
  'colar-igreja-quadrado',
  'cruzeiro-do-quadrado',
  'igreja-quadrado-gg',
  'mobile-trancoso',
  'nossa-senhora-grande',
  'estatueta-iemanja',
  'presepio-em-ceramica',
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
 * A primeira imagem de cada lista é a capa aprovada para a vitrine.
 *
 * REGRA VISUAL APROVADA PELA PROPRIETÁRIA:
 * os nomes históricos de dois arquivos estão invertidos em relação ao que
 * realmente aparece nas fotos. A P usa visualmente o arquivo chamado
 * igrejinha-luminaria-trancoso.jpg e a Luminária usa visualmente o arquivo
 * chamado igreja-quadrado-p.jpg. Não inverter esta regra pelo nome do arquivo.
 */
const ATTENTION_IMAGE_ORDER: Record<string, string[]> = {
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'igrejinha-luminaria-trancoso': [
    '/produtos/igreja-quadrado-p.jpg',
  ],
  'casinha-luminaria': [
    '/produtos/casinha-luminaria.jpg',
    '/produtos/catalogo/casinha-luminaria-1.jpg',
    '/produtos/catalogo/casinha-luminaria-2.jpg',
    '/produtos/catalogo/casinha-luminaria-3.jpg',
    '/produtos/catalogo/casinha-luminaria-4.jpg',
  ],
  'miniatura-quadrado-trancoso': [
    '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-6.avif',
    '/produtos/catalogo/miniatura-quadrado-trancoso-7.avif',
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
  'igreja-quadrado-p': ['miniatura-quadrado-trancoso', 'igrejinha-luminaria-trancoso', 'colar-igreja-quadrado', 'ima-igrejinha-trancoso'],
  'igreja-quadrado-m': ['miniatura-quadrado-trancoso', 'igrejinha-luminaria-trancoso', 'colar-igreja-quadrado', 'ima-igrejinha-trancoso'],
  'igreja-quadrado-gg': ['igrejinha-luminaria-trancoso', 'miniatura-quadrado-trancoso', 'mobile-trancoso', 'casinha-luminaria'],
  'igrejinha-luminaria-trancoso': ['miniatura-quadrado-trancoso', 'igreja-quadrado-p', 'casinha-luminaria', 'colar-igreja-quadrado'],
  'miniatura-quadrado-trancoso': ['igreja-quadrado-p', 'igrejinha-luminaria-trancoso', 'cruzeiro-do-quadrado', 'colar-igreja-quadrado'],
  'casinha-luminaria': ['igrejinha-luminaria-trancoso', 'miniatura-quadrado-trancoso', 'esfera-decorativa', 'mobile-trancoso'],
  'colar-igreja-quadrado': ['miniatura-quadrado-trancoso', 'igreja-quadrado-p', 'ima-igrejinha-trancoso', 'igrejinha-luminaria-trancoso'],
  'ima-igrejinha-trancoso': ['miniatura-quadrado-trancoso', 'igreja-quadrado-p', 'colar-igreja-quadrado', 'cruzeiro-do-quadrado'],
  'mobile-trancoso': ['miniatura-quadrado-trancoso', 'casinha-luminaria', 'igreja-quadrado-m', 'esfera-decorativa'],
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
