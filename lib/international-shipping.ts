import 'server-only';

import { calculateCartTotals, getProductById } from '@/lib/products';
import { getParcelMeasurements } from '@/lib/catalog-measurements';
import { getShipFromCep } from '@/lib/shipping-deadline';
import { getInternationalCountry } from '@/lib/international-countries';
import type { CartItem } from '@/lib/types';

export type InternationalShippingOption = {
  serviceCode: string;
  name: string;
  carrier: string;
  price: number;
  deadlineDays: number | null;
};

export type InternationalShippingQuote = {
  configured: boolean;
  available: boolean;
  countryCode: string;
  postalCode: string;
  originCep: string;
  options: InternationalShippingOption[];
  estimatedWeightG?: number;
  reason?: 'invalid_destination' | 'invalid_cart' | 'manual_quote_required';
};

type ShippingRegion = 'south_america' | 'north_america' | 'europe' | 'rest';

const SOUTH_AMERICA = new Set(['AR', 'CL', 'CO', 'PE', 'UY', 'PY', 'BO']);
const NORTH_AMERICA = new Set(['US', 'CA', 'MX']);
const EUROPE = new Set([
  'GB', 'PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'CH', 'IE', 'DK',
  'SE', 'NO', 'FI', 'IS', 'PL', 'CZ', 'SK', 'HU', 'RO', 'GR', 'HR', 'SI',
  'EE', 'LV', 'LT', 'LU', 'MT', 'CY',
]);

/**
 * Fallback comercial da Agô enquanto nem todos os SKUs possuem peso/dimensões
 * finais de postagem. O objetivo é usar o serviço internacional econômico
 * disponível e cobrar uma tarifa previsível que cubra postagem, custo do
 * pagamento e uma pequena margem de segurança operacional.
 *
 * Referência de 2026: uma simulação pública do Exporta Fácil Econômico para
 * Portugal/500 g aparece em torno de R$ 210. Por isso o preço de loja para
 * Europa/até 500 g fica em R$ 249, já absorvendo taxa do pagamento, embalagem
 * e variação operacional.
 */
const RATE_BY_REGION: Record<ShippingRegion, {
  upTo250G: number;
  upTo500G: number;
  extra500G: number;
}> = {
  south_america: { upTo250G: 139, upTo500G: 169, extra500G: 55 },
  north_america: { upTo250G: 239, upTo500G: 269, extra500G: 70 },
  europe: { upTo250G: 219, upTo500G: 249, extra500G: 70 },
  rest: { upTo250G: 289, upTo500G: 329, extra500G: 90 },
};

// Itens grandes sem pacote final confirmado não entram no checkout automático.
// Isso protege a margem até a primeira medição real do volume embalado.
const MANUAL_QUOTE_PRODUCTS = new Set([
  'igreja-quadrado-gg',
  'mobile-trancoso',
  'nossa-senhora-grande',
]);

// Estimativa conservadora do peso já com proteção/embalagem para SKUs sem
// pacote final confirmado. Conforme a Agô pesar cada SKU embalado, estes
// valores devem ser substituídos por medidas reais em catalog-measurements.
const ESTIMATED_PACKED_WEIGHT_G: Record<string, number> = {
  'igrejinha-luminaria-trancoso': 500,
  'casinha-luminaria': 600,
  'miniatura-quadrado-trancoso': 700,
  'cruzeiro-do-quadrado': 500,
  'estatueta-iemanja': 750,
  'presepio-em-ceramica': 900,
  'casal-pretos-velhos': 600,
  'nossa-senhora-aparecida': 450,
  'divino-espirito-santo': 300,
  'terco-em-ceramica': 350,
  'rosario-trancoso': 500,
  'esfera-decorativa': 250,
  'colar-igreja-quadrado': 120,
  'ima-igrejinha-trancoso': 100,
  'sagrada-familia': 120,
  'sagrada-familia-colorida': 120,
  'sagrada-familia-dourada': 120,
  'cachimbo': 120,
};

function cleanPostalCode(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 24);
}

function regionForCountry(countryCode: string): ShippingRegion {
  if (SOUTH_AMERICA.has(countryCode)) return 'south_america';
  if (NORTH_AMERICA.has(countryCode)) return 'north_america';
  if (EUROPE.has(countryCode)) return 'europe';
  return 'rest';
}

function regionLabel(region: ShippingRegion) {
  if (region === 'south_america') return 'América do Sul / South America';
  if (region === 'north_america') return 'América do Norte / North America';
  if (region === 'europe') return 'Europa / Europe';
  return 'Outros destinos / Other destinations';
}

function packedWeightForProduct(productId: string) {
  const parcel = getParcelMeasurements(productId);
  if (parcel?.grossWeightG) return parcel.grossWeightG;
  return ESTIMATED_PACKED_WEIGHT_G[productId] ?? 500;
}

function estimateCartPackedWeight(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const quantity = Math.max(0, Math.round(Number(item.quantity) || 0));
    return sum + packedWeightForProduct(item.productId) * quantity;
  }, 0);
}

function fixedRateFor(region: ShippingRegion, estimatedWeightG: number) {
  const rate = RATE_BY_REGION[region];
  if (estimatedWeightG <= 250) return rate.upTo250G;
  if (estimatedWeightG <= 500) return rate.upTo500G;
  const extraBands = Math.ceil((estimatedWeightG - 500) / 500);
  return rate.upTo500G + extraBands * rate.extra500G;
}

export function isInternationalShippingProviderConfigured() {
  return true;
}

export async function getInternationalShippingQuote(params: {
  countryCode: string;
  postalCode: string;
  items: CartItem[];
}): Promise<InternationalShippingQuote> {
  const countryCode = String(params.countryCode || '').trim().toUpperCase();
  const postalCode = cleanPostalCode(params.postalCode);
  const originCep = getShipFromCep();

  if (!getInternationalCountry(countryCode) || countryCode === 'BR' || postalCode.length < 2) {
    return { configured: true, available: false, countryCode, postalCode, originCep, options: [], reason: 'invalid_destination' };
  }

  const items = Array.isArray(params.items) ? params.items : [];
  const totals = calculateCartTotals(items);
  if (!items.length || !totals.valid) {
    return { configured: true, available: false, countryCode, postalCode, originCep, options: [], reason: 'invalid_cart' };
  }

  const requiresManualQuote = items.some((item) => {
    const product = getProductById(item.productId);
    return Boolean(product && MANUAL_QUOTE_PRODUCTS.has(product.id));
  });

  const estimatedWeightG = estimateCartPackedWeight(items);

  // Acima de 2 kg, o Econômico deixa de ser a referência principal. Sem peso e
  // volume finais, uma tarifa fixa seria arriscada; cotação manual protege ambas
  // as partes até que o catálogo tenha dados reais suficientes.
  if (requiresManualQuote || estimatedWeightG > 2000) {
    return {
      configured: true,
      available: false,
      countryCode,
      postalCode,
      originCep,
      options: [],
      estimatedWeightG,
      reason: 'manual_quote_required',
    };
  }

  const region = regionForCountry(countryCode);
  const price = Number(fixedRateFor(region, estimatedWeightG).toFixed(2));

  return {
    configured: true,
    available: true,
    countryCode,
    postalCode,
    originCep,
    estimatedWeightG,
    options: [{
      serviceCode: `AGO_FIXED_${region.toUpperCase()}_${Math.ceil(estimatedWeightG / 250)}`,
      name: `Frete internacional fixo · ${regionLabel(region)}`,
      carrier: 'Agô Trancoso',
      price,
      deadlineDays: null,
    }],
  };
}
