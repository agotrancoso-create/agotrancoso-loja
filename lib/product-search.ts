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
  const needle = tokens(query);
  if (!needle.length) return 1;

  const gift = ['presentes', 'igrejinhas', 'trancoso'].includes(product.category) ? 'presente souvenir lembranca' : '';
  const name = tokens(product.name);
  const words = tokens(`${product.name} ${product.description} ${product.category} ${gift} ceramica artesanal ago trancoso bahia`);

  // Two typed letters are enough for useful autocomplete ("ca" → Casinha, "ig" → Igreja).
  // One-letter queries stay conservative so the suggestion box does not become noisy.
  const matches = (word: string, candidates: string[]) => candidates.some((candidate) => (
    candidate === word
    || (word.length >= 2 && candidate.startsWith(word))
    || (word.length >= 3 && candidate.includes(word))
  ));

  if (!needle.every(word => matches(word, words))) return 0;

  const normalizedQuery = normalizeSearch(query);
  const normalizedName = normalizeSearch(product.name);
  if (normalizedQuery.length >= 2 && normalizedName.startsWith(normalizedQuery)) return 120;
  if (needle.every(word => matches(word, name))) return 100;
  return 40;
}
