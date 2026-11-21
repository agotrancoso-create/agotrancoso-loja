import 'server-only';

import { calculateCartTotals, getProductById } from '@/lib/products';
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
  reason?: 'invalid_destination' | 'invalid_cart';
};

type ShippingRegion = 'south_america' | 'north_america' | 'europe' | 'rest';

const SOUTH_AMERICA = new Set(['AR', 'CL', 'CO', 'PE', 'UY', 'PY', 'BO']);
const NORTH_AMERICA = new Set(['US', 'CA', 'MX']);
const EUROPE = new Set([
  'GB', 'PT', 'ES', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT', 'CH', 'IE', 'DK',
  'SE', 'NO', 'FI', 'IS', 'PL', 'CZ', 'SK', 'HU', 'RO', 'GR', 'HR', 'SI',
  'EE', 'LV', 'LT', 'LU', 'MT', 'CY',
]);

// Tarifa comercial fixa da Agô enquanto nem todas as peças possuem peso e
// dimensões de postagem confirmados. O custo real da postagem pode variar;
// a diferença é risco operacional da loja, nunca uma cobrança surpresa ao cliente.
const BASE_PRICE_BRL: Record<ShippingRegion, number> = {
  south_america: 199,
  north_america: 259,
  europe: 289,
  rest: 399,
};

const EXTRA_ITEM_BRL = 69;
const BULKY_SURCHARGE_BRL = 120;
const BULKY_PRODUCT_IDS = new Set(['igreja-quadrado-gg']);

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

  const totalUnits = items.reduce((sum, item) => sum + Math.max(0, Math.round(Number(item.quantity) || 0)), 0);
  const region = regionForCountry(countryCode);
  const extraItems = Math.max(0, totalUnits - 1) * EXTRA_ITEM_BRL;
  const hasBulkyItem = items.some((item) => {
    const product = getProductById(item.productId);
    return Boolean(product && BULKY_PRODUCT_IDS.has(product.id));
  });
  const bulkySurcharge = hasBulkyItem ? BULKY_SURCHARGE_BRL : 0;
  const price = Number((BASE_PRICE_BRL[region] + extraItems + bulkySurcharge).toFixed(2));

  return {
    configured: true,
    available: true,
    countryCode,
    postalCode,
    originCep,
    options: [{
      serviceCode: `AGO_FIXED_${region.toUpperCase()}`,
      name: `Frete fixo internacional · ${regionLabel(region)}`,
      carrier: 'Agô Trancoso',
      price,
      deadlineDays: null,
    }],
  };
}
