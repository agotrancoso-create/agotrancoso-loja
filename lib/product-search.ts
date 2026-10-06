import type { Product } from './types';
import { cartEnglish } from './cart-copy';

export function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const stopWords = new Set([
  'a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'em', 'para', 'e', 'um', 'uma',
  'comprar', 'compra', 'online', 'the', 'of', 'in', 'and', 'for',
]);

const synonyms: Record<string, string> = {
  igrejinha: 'igreja', igrejinhas: 'igreja', igrejas: 'igreja', church: 'igreja', churches: 'igreja',
  souvenir: 'presente', souvenirs: 'presente', lembranca: 'presente', lembrancas: 'presente', presentes: 'presente', gift: 'presente', gifts: 'presente',
  luminarias: 'luminaria', luminary: 'luminaria', luminaries: 'luminaria', abajur: 'luminaria', lamp: 'luminaria', lamps: 'luminaria',
  casinhas: 'casa', casinha: 'casa', casas: 'casa', house: 'casa', houses: 'casa', home: 'casa',
  imas: 'ima', magnet: 'ima', magnets: 'ima',
  miniaturas: 'miniatura', miniature: 'miniatura', miniatures: 'miniatura',
  ceramicas: 'ceramica', ceramics: 'ceramica', pottery: 'ceramica',
  decor: 'decoracao', decoration: 'decoracao',
  necklace: 'colar', necklaces: 'colar',
  rosary: 'rosario', rosaries: 'rosario', terco: 'rosario',
  nativity: 'presepio',
  figurine: 'estatueta', statue: 'estatueta',
  hanging: 'pendurar', wall: 'pendurar',
  large: 'grande', medium: 'medio', small: 'pequeno',
  iemanja: 'iemanja', yemanja: 'iemanja',
  pretos: 'preto', velhos: 'velho',
};

const productAliases: Record<string, string> = {
  'igreja-quadrado-p': 'igreja pequena igrejinha pequena igreja p mini igreja small church small quadrado church',
  'igreja-quadrado-m': 'igreja media igreja medio igrejinha media igreja m medium church quadrado church',
  'igreja-quadrado-gg': 'igreja grande igreja gg luminaria grande church large church large luminary quadrado church',
  'igrejinha-luminaria-trancoso': 'igrejinha luminaria igreja luminaria igreja com luz igreja de ceramica trancoso church luminary church lamp',
  'casinha-luminaria': 'casinha casa casinha luminaria casa luminaria casinha de ceramica luz vela house ceramic house house luminary lamp',
  'miniatura-quadrado-trancoso': 'miniatura quadrado casinhas quadrado trancoso pendurar parede vila hanging quadrado miniature village houses',
  'cruzeiro-do-quadrado': 'cruzeiro cruz quadrado cross trancoso',
  'mobile-trancoso': 'mobile casinhas suspensas pendente hanging houses trancoso',
  'estatueta-iemanja': 'iemanja yemanja estatueta orixa figurine statue',
  'nossa-senhora-grande': 'nossa senhora maria grande our lady figurine mary',
  'presepio-em-ceramica': 'presepio natal nascimento jesus maria jose nativity christmas',
  'casal-pretos-velhos': 'preto velho pretos velhos casal sabedoria protecao couple',
  'nossa-senhora-aparecida': 'aparecida nossa senhora maria santa our lady',
  'divino-espirito-santo': 'divino espirito santo pomba pendurar holy spirit dove',
  'terco-em-ceramica': 'terco rosario contas cruz rosary beads',
  'rosario-trancoso': 'rosario terco trancoso contas igreja rosary',
  'esfera-decorativa': 'esfera bola decorativa decoracao sphere',
  'colar-igreja-quadrado': 'colar igreja quadrado pingente necklace pendant church',
  'ima-igrejinha-trancoso': 'ima imã igrejinha igreja trancoso magnet church',
};

function words(value: string) {
  return normalizeSearch(value).split(' ').filter((word) => word && !stopWords.has(word));
}

function canonical(word: string) {
  return synonyms[word] ?? word;
}

function isNearToken(a: string, b: string) {
  if (a.length < 5 || b.length < 5 || Math.abs(a.length - b.length) > 1) return false;

  if (a.length === b.length) {
    const diffs: number[] = [];
    for (let index = 0; index < a.length; index += 1) {
      if (a[index] !== b[index]) diffs.push(index);
      if (diffs.length > 2) return false;
    }
    if (diffs.length <= 1) return true;
    return diffs.length === 2
      && diffs[1] === diffs[0] + 1
      && a[diffs[0]] === b[diffs[1]]
      && a[diffs[1]] === b[diffs[0]];
  }

  const shorter = a.length < b.length ? a : b;
  const longer = a.length < b.length ? b : a;
  let shortIndex = 0;
  let longIndex = 0;
  let skipped = false;
  while (shortIndex < shorter.length && longIndex < longer.length) {
    if (shorter[shortIndex] === longer[longIndex]) {
      shortIndex += 1;
      longIndex += 1;
      continue;
    }
    if (skipped) return false;
    skipped = true;
    longIndex += 1;
  }
  return true;
}

function tokenMatchScore(queryWord: string, candidateWord: string) {
  if (!queryWord || !candidateWord) return 0;

  // Keep raw words first so unfinished typing such as "casinh" still matches
  // "casinha" even though the complete word later canonicalizes to "casa".
  if (candidateWord === queryWord) return 120;
  if (queryWord.length >= 2 && candidateWord.startsWith(queryWord)) return 105;
  if (queryWord.length >= 3 && candidateWord.includes(queryWord)) return 80;

  const queryCanonical = canonical(queryWord);
  const candidateCanonical = canonical(candidateWord);
  if (candidateCanonical === queryCanonical) return 95;
  if (queryCanonical.length >= 2 && candidateCanonical.startsWith(queryCanonical)) return 80;
  if (queryCanonical.length >= 3 && candidateCanonical.includes(queryCanonical)) return 60;

  // Conservative typo tolerance: one insertion/deletion/substitution or one
  // adjacent transposition, only for longer words to avoid noisy matches.
  if (isNearToken(queryWord, candidateWord) || isNearToken(queryCanonical, candidateCanonical)) return 48;

  return 0;
}

function fieldTokenScore(queryWords: string[], fieldWords: string[]) {
  if (!queryWords.length || !fieldWords.length) return 0;
  let total = 0;
  for (const queryWord of queryWords) {
    const best = fieldWords.reduce((score, candidate) => Math.max(score, tokenMatchScore(queryWord, candidate)), 0);
    if (!best) return 0;
    total += best;
  }
  return total;
}

function phraseScore(query: string, field: string) {
  const q = normalizeSearch(query);
  const f = normalizeSearch(field);
  if (!q || !f) return 0;
  if (f === q) return 420;
  if (f.startsWith(q)) return 330;
  if (q.length >= 3 && f.includes(q)) return 250;
  return 0;
}

/**
 * Shared relevance ranking for header autocomplete and the catalogue.
 * Priority: product name (PT/EN) > curated aliases > category > description.
 * All meaningful query words must match the selected field group.
 */
export function productSearchScore(product: Product, query: string): number {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 1;

  const names = [product.name, cartEnglish[product.name]].filter((value): value is string => Boolean(value));
  const aliasText = productAliases[product.id] ?? '';
  const queryWords = words(query);

  // A single letter should only autocomplete actual product-name words.
  if (normalizedQuery.length === 1) {
    const nameWords = names.flatMap(words);
    const index = nameWords.findIndex((word) => word.startsWith(normalizedQuery));
    if (index === -1) return 0;
    return names.some((name) => normalizeSearch(name).startsWith(normalizedQuery)) ? 300 : 260 - Math.min(index, 20);
  }

  const namePhrase = Math.max(...names.map((name) => phraseScore(query, name)), 0);
  if (namePhrase) return 1200 + namePhrase;

  const aliasPhrase = phraseScore(query, aliasText);
  if (aliasPhrase) return 1020 + aliasPhrase;

  const nameTokenScore = fieldTokenScore(queryWords, names.flatMap(words));
  if (nameTokenScore) return 900 + nameTokenScore;

  const aliasTokenScore = fieldTokenScore(queryWords, words(aliasText));
  if (aliasTokenScore) return 760 + aliasTokenScore;

  const categoryAliases = [
    product.category,
    product.category === 'igrejinhas' ? 'igreja church churches' : '',
    product.category === 'decoracao' ? 'decoracao decor casa home' : '',
    product.category === 'presentes' ? 'presente gift souvenir lembranca' : '',
    product.category === 'fe-devocao' ? 'fe devocao faith devotional' : '',
    product.category === 'trancoso' ? 'trancoso quadrado bahia' : '',
  ].join(' ');
  const categoryScore = fieldTokenScore(queryWords, words(categoryAliases));
  if (categoryScore) return 560 + categoryScore;

  const descriptionScore = fieldTokenScore(
    queryWords,
    words(`${product.description} ceramica artesanal ago trancoso bahia`),
  );
  if (descriptionScore) return 300 + descriptionScore;

  return 0;
}
