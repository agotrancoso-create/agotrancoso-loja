import type { Product } from './types';

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const stopWords = new Set(['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'em', 'para', 'e', 'um', 'uma', 'comprar', 'compra', 'online']);
const synonyms: Record<string, string> = {
  igrejinha: 'igreja', igrejinhas: 'igreja', igrejas: 'igreja', church: 'igreja',
  souvenir: 'presente', souvenirs: 'presente', lembranca: 'presente', lembrancas: 'presente', presentes: 'presente', gift: 'presente', gifts: 'presente',
  luminarias: 'luminaria', abajur: 'luminaria', luminaires: 'luminaria', lamp: 'luminaria',
  casinhas: 'casa', casinha: 'casa', casas: 'casa',
  imas: 'ima', magnet: 'ima', miniaturas: 'miniatura', ceramicas: 'ceramica', ceramics: 'ceramica', pottery: 'ceramica',
  iemanja: 'iemanja', yemanja: 'iemanja', pretos: 'preto', velhos: 'velho',
};

function tokens(value: string) {
  return normalizeSearch(value).split(' ').filter(word => word && !stopWords.has(word)).map(word => synonyms[word] ?? word);
}

/** Same matching for header suggestions and the catalogue; all query words must match. */
export function productSearchScore(product: Product, query: string): number {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 1;

  // Autocomplete starts with the very first letter. For a one-letter query we
  // intentionally search product-name words only, which keeps suggestions useful
  // instead of matching generic description words such as "artesanal".
  if (normalizedQuery.length === 1) {
    const nameWords = normalizeSearch(product.name).split(' ').filter(Boolean);
    const matchingWordIndex = nameWords.findIndex((word) => word.startsWith(normalizedQuery));
    if (matchingWordIndex === -1) return 0;
    if (normalizeSearch(product.name).startsWith(normalizedQuery)) return 140;
    return 120 - Math.min(matchingWordIndex, 10);
  }

  const needle = tokens(query);
  if (!needle.length) return 1;

  const gift = ['presentes', 'igrejinhas', 'trancoso'].includes(product.category) ? 'presente souvenir lembranca' : '';
  const name = tokens(product.name);
  const words = tokens(`${product.name} ${product.description} ${product.category} ${gift} ceramica artesanal ago trancoso bahia`);

  const matches = (word: string, candidates: string[]) => candidates.some((candidate) => (
    candidate === word
    || (word.length >= 2 && candidate.startsWith(word))
    || (word.length >= 3 && candidate.includes(word))
  ));

  if (!needle.every(word => matches(word, words))) return 0;

  const normalizedName = normalizeSearch(product.name);
  if (normalizedName.startsWith(normalizedQuery)) return 120;
  if (needle.every(word => matches(word, name))) return 100;
  return 40;
}
