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
  missingMeasurementProducts?: string[];
  reason?: 'invalid_destination' | 'invalid_cart' | 'missing_measurements' | 'manual_correios_quote';
};

function cleanPostalCode(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 24);
}

/**
 * Sem contrato/API internacional dos Correios não existe uma tarifa confiável
 * que o site possa cobrar automaticamente. A estratégia de menor custo da Agô
 * é manter a cotação pelo Minhas Exportações / Exporta Fácil e só cobrar depois
 * de confirmar peso, dimensões, destino e serviço real.
 */
export function isInternationalShippingProviderConfigured() {
  return false;
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
    return { configured: false, available: false, countryCode, postalCode, originCep, options: [], reason: 'invalid_destination' };
  }

  const items = Array.isArray(params.items) ? params.items : [];
  const totals = calculateCartTotals(items);
  if (!items.length || !totals.valid) {
    return { configured: false, available: false, countryCode, postalCode, originCep, options: [], reason: 'invalid_cart' };
  }

  const missingMeasurementProducts = items.flatMap((item) => {
    const product = getProductById(item.productId);
    return product && getParcelMeasurements(product.id) ? [] : [product?.name || item.productId];
  });

  return {
    configured: false,
    available: false,
    countryCode,
    postalCode,
    originCep,
    options: [],
    ...(missingMeasurementProducts.length ? { missingMeasurementProducts } : {}),
    reason: missingMeasurementProducts.length ? 'missing_measurements' : 'manual_correios_quote',
  };
}
