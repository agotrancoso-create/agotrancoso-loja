import { Product } from './types';

// Ordem editorial e comercial da vitrine.
// A sequência prioriza, nesta ordem: reconhecimento imediato de Trancoso,
// contraste visual entre peças, assinatura da marca, variedade de faixa de
// preço e facilidade de entrada na compra.
export const ATTENTION_PRODUCT_ORDER = [
  'igreja-quadrado-p',
  'igrejinha-luminaria-trancoso',
  'miniatura-quadrado-trancoso',
  'igreja-quadrado-m',
  'igreja-quadrado-gg',
  'casinha-luminaria',
  'colar-igreja-quadrado',
  'ima-igrejinha-trancoso',
  'mobile-trancoso',
  'estatueta-iemanja',
  'nossa-senhora-grande',
  'presepio-em-ceramica',
  'casal-pretos-velhos',
  'nossa-senhora-aparecida',
  'divino-espirito-santo',
  'rosario-trancoso',
  'terco-em-ceramica',
  'cruzeiro-do-quadrado',
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
