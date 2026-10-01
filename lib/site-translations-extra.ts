import { translateExactText, type SiteLocale } from './site-translations';

const EXTRA_EN_TEXT: Record<string, string> = {
  'Peças moldadas à mão, desde 2016 no Quadrado.': 'Hand-shaped ceramic pieces, at the Square since 2016.',
  'Peça indisponível no momento': 'Piece currently unavailable',
  'Quantidade': 'Quantity',
  'Diminuir quantidade': 'Decrease quantity',
  'Aumentar quantidade': 'Increase quantity',
  'Consultar envio pelo CEP': 'Check shipping by postal code',
  'Frete e prazo para seu CEP': 'Shipping and delivery time for your postal code',
  'Consultando…': 'Checking…',
  'Consultar': 'Check',
  'Prazo online ainda não disponível para este CEP.': 'Online delivery estimate is not available for this postal code yet.',
  'Confirmar prazo com a Agô': 'Confirm delivery time with Agô',
  'Não foi possível consultar o envio agora.': 'We could not check shipping right now.',
  'Detalhes da peça': 'Piece details',
  'Cerâmica': 'Ceramic',
  'Navegação estrutural': 'Breadcrumb navigation',
  'Igrejinha de Trancoso': 'Trancoso little church',
  'Igrejinha de Trancoso · Cerâmica artesanal': 'Trancoso little church · Handcrafted ceramics',
  'Produtos relacionados': 'Related products',
  'Localização da Agô': 'Agô location',
  'Fotografias reais da banca e das peças da Agô no Quadrado de Trancoso': 'Real photos of Agô’s stand and ceramic pieces in Trancoso Historic Square',
  'Abrir a localização da banca no Google Maps': 'Open our stand location in Google Maps',
  'Mapa da Agô Trancoso no Quadrado': 'Map of Agô Trancoso in the Historic Square',
  'Escolher pela intenção': 'Shop by purpose',
};

const EXTRA_PATTERNS: Array<[RegExp, (match: RegExpMatchArray) => string]> = [
  [/^Prazo estimado: (.+) dias úteis$/, (m) => `Estimated delivery: ${m[1]} business days`],
  [/^Prazo estimado: (.+)$/, (m) => `Estimated delivery: ${m[1]}`],
  [/^Frete (R\$\s?[\d.,]+)$/, (m) => `Shipping ${m[1]}`],
  [/^Adicionar à sacola: (\d+) unidade de (.+)$/, (m) => `Add to bag: ${m[1]} unit of ${m[2]}`],
  [/^Adicionar à sacola: (\d+) unidades de (.+)$/, (m) => `Add to bag: ${m[1]} units of ${m[2]}`],
  [/^(.+) está na sacola$/, (m) => `${m[1]} is in the bag`],
];

export function translateSiteText(value: string, locale: SiteLocale) {
  const base = translateExactText(value, locale);
  if (locale !== 'en' || base !== value) return base;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  const core = value.trim();
  if (!core) return value;
  const exact = EXTRA_EN_TEXT[core];
  if (exact) return `${leading}${exact}${trailing}`;
  for (const [pattern, render] of EXTRA_PATTERNS) {
    const match = core.match(pattern);
    if (match) return `${leading}${render(match)}${trailing}`;
  }
  return value;
}
