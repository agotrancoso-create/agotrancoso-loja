import 'server-only';

import { calculateCartTotals, getProductById } from '@/lib/products';
import { getParcelMeasurements } from '@/lib/catalog-measurements';
import { getShipFromCep } from '@/lib/shipping-deadline';
import { getInternationalCountry } from '@/lib/international-countries';
import type { CartItem } from '@/lib/types';

type FrenetService = {
  ServiceCode?: string;
  ServiceDescription?: string;
  Carrier?: string;
  CarrierCode?: string;
  ShippingPrice?: string | number;
  OriginalShippingPrice?: string | number;
  DeliveryTime?: string | number;
  OriginalDeliveryTime?: string | number;
  Error?: boolean | string;
};

type FrenetResponse = {
  ShippingSevicesArray?: FrenetService[];
  ShippingServicesArray?: FrenetService[];
};

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
  options: InternationalShippingOption[];
  missingMeasurementProducts?: string[];
  reason?: 'provider_not_configured' | 'invalid_destination' | 'invalid_cart' | 'missing_measurements' | 'no_service' | 'provider_error';
};

function cleanPostalCode(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 24);
}

function cleanServiceError(value: FrenetService['Error']) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return Boolean(normalized && normalized !== 'false' && normalized !== '0');
  }
  return false;
}

function money(value: unknown) {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? Number(parsed.toFixed(2)) : null;
}

function days(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

export function isInternationalShippingProviderConfigured() {
  return Boolean(process.env.FRENET_TOKEN?.trim());
}

export async function getInternationalShippingQuote(params: {
  countryCode: string;
  postalCode: string;
  items: CartItem[];
}): Promise<InternationalShippingQuote> {
  const countryCode = String(params.countryCode || '').trim().toUpperCase();
  const postalCode = cleanPostalCode(params.postalCode);
  const token = process.env.FRENET_TOKEN?.trim();

  if (!token) {
    return { configured: false, available: false, countryCode, postalCode, options: [], reason: 'provider_not_configured' };
  }

  if (!getInternationalCountry(countryCode) || countryCode === 'BR' || postalCode.length < 2) {
    return { configured: true, available: false, countryCode, postalCode, options: [], reason: 'invalid_destination' };
  }

  const items = Array.isArray(params.items) ? params.items : [];
  const totals = calculateCartTotals(items);
  if (!items.length || !totals.valid) {
    return { configured: true, available: false, countryCode, postalCode, options: [], reason: 'invalid_cart' };
  }

  const missingMeasurementProducts: string[] = [];
  const shippingItems = items.flatMap((item) => {
    const product = getProductById(item.productId);
    const parcel = product ? getParcelMeasurements(product.id) : undefined;
    const quantity = Number(item.quantity);

    if (!product || !parcel || !Number.isInteger(quantity) || quantity < 1) {
      if (product?.name) missingMeasurementProducts.push(product.name);
      else if (item.productId) missingMeasurementProducts.push(item.productId);
      return [];
    }

    return [{
      SKU: product.id,
      Weight: Number((parcel.grossWeightG / 1000).toFixed(3)),
      Length: parcel.lengthCm,
      Height: parcel.heightCm,
      Width: parcel.widthCm,
      Quantity: quantity,
      Category: 'Ceramica e decoracao',
      isFragile: true,
    }];
  });

  if (shippingItems.length !== items.length || missingMeasurementProducts.length) {
    return {
      configured: true,
      available: false,
      countryCode,
      postalCode,
      options: [],
      missingMeasurementProducts,
      reason: 'missing_measurements',
    };
  }

  try {
    const response = await fetch('https://api.frenet.com.br/shipping/quote', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        token,
      },
      body: JSON.stringify({
        SellerCEP: getShipFromCep(),
        RecipientCEP: postalCode,
        RecipientCountry: countryCode,
        ShipmentInvoiceValue: Number(totals.total.toFixed(2)),
        ShippingItemArray: shippingItems,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      return { configured: true, available: false, countryCode, postalCode, options: [], reason: 'provider_error' };
    }

    const data = (await response.json()) as FrenetResponse;
    const services = data.ShippingSevicesArray ?? data.ShippingServicesArray ?? [];
    const options = services
      .filter(service => !cleanServiceError(service.Error))
      .flatMap((service): InternationalShippingOption[] => {
        const price = money(service.ShippingPrice ?? service.OriginalShippingPrice);
        if (price == null) return [];
        const serviceCode = String(service.ServiceCode || '').trim();
        const carrier = String(service.Carrier || service.CarrierCode || 'Transportadora').trim();
        const description = String(service.ServiceDescription || carrier).trim();
        if (!serviceCode || /retirada|pickup/i.test(`${carrier} ${description}`)) return [];
        return [{
          serviceCode,
          name: description || carrier,
          carrier,
          price,
          deadlineDays: days(service.DeliveryTime ?? service.OriginalDeliveryTime),
        }];
      })
      .sort((a, b) => a.price - b.price || (a.deadlineDays ?? 999) - (b.deadlineDays ?? 999))
      .slice(0, 3);

    return {
      configured: true,
      available: options.length > 0,
      countryCode,
      postalCode,
      options,
      ...(options.length ? {} : { reason: 'no_service' as const }),
    };
  } catch (error) {
    console.warn('International Frenet quote unavailable:', error instanceof Error ? error.message : error);
    return { configured: true, available: false, countryCode, postalCode, options: [], reason: 'provider_error' };
  }
}
