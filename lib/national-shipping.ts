import 'server-only';

import { calculateCartTotals, getProductById } from '@/lib/products';
import { getParcelMeasurements } from '@/lib/catalog-measurements';
import { getShipFromCep, getShippingDeadlineQuote } from '@/lib/shipping-deadline';
import { FIXED_SHIPPING_PRICE, shouldOfferFreeShipping } from '@/lib/shipping';
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

export type NationalShippingOption = {
  serviceId: string;
  name: string;
  provider: 'Frenet' | 'Agô Trancoso';
  price: number;
  deadline: number | string | null;
  estimated: boolean;
  fallback: boolean;
};

export type NationalShippingQuote = {
  configured: boolean;
  available: boolean;
  freeShipping: boolean;
  originCep: string;
  destinationCep: string;
  options: NationalShippingOption[];
  missingMeasurementProducts?: string[];
  reason?: 'invalid_destination' | 'invalid_cart' | 'provider_not_configured' | 'missing_measurements' | 'provider_error' | 'no_service';
};

function digits(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

function money(value: unknown) {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? Number(parsed.toFixed(2)) : null;
}

function days(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

function serviceHasError(value: FrenetService['Error']) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return Boolean(normalized && normalized !== 'false' && normalized !== '0');
  }
  return false;
}

async function fallbackQuote(params: {
  destinationCep: string;
  subtotal: number;
  freeShipping: boolean;
  reason: NationalShippingQuote['reason'];
  missingMeasurementProducts?: string[];
}): Promise<NationalShippingQuote> {
  const deadlineQuote = await getShippingDeadlineQuote({
    destinationCep: params.destinationCep,
    subtotal: params.subtotal,
  });

  return {
    configured: Boolean(process.env.FRENET_TOKEN?.trim()),
    available: true,
    freeShipping: params.freeShipping,
    originCep: getShipFromCep(),
    destinationCep: params.destinationCep,
    options: [{
      serviceId: params.freeShipping ? 'free' : 'fixed-fallback',
      name: params.freeShipping ? 'Frete grátis' : 'Frete fixo de segurança',
      provider: 'Agô Trancoso',
      price: params.freeShipping ? 0 : FIXED_SHIPPING_PRICE,
      deadline: deadlineQuote?.deadline ?? null,
      estimated: deadlineQuote?.estimated !== false,
      fallback: true,
    }],
    ...(params.missingMeasurementProducts?.length ? { missingMeasurementProducts: params.missingMeasurementProducts } : {}),
    reason: params.reason,
  };
}

export async function getNationalShippingQuote(params: {
  destinationCep: string;
  items: CartItem[];
}): Promise<NationalShippingQuote> {
  const destinationCep = digits(params.destinationCep);
  const originCep = getShipFromCep();

  if (destinationCep.length !== 8 || /^(\d)\1{7}$/.test(destinationCep)) {
    return {
      configured: Boolean(process.env.FRENET_TOKEN?.trim()),
      available: false,
      freeShipping: false,
      originCep,
      destinationCep,
      options: [],
      reason: 'invalid_destination',
    };
  }

  const items = Array.isArray(params.items) ? params.items : [];
  const totals = calculateCartTotals(items);
  if (!items.length || !totals.valid) {
    return {
      configured: Boolean(process.env.FRENET_TOKEN?.trim()),
      available: false,
      freeShipping: false,
      originCep,
      destinationCep,
      options: [],
      reason: 'invalid_cart',
    };
  }

  const subtotal = totals.total;
  const freeShipping = shouldOfferFreeShipping(subtotal);
  if (freeShipping) {
    return fallbackQuote({ destinationCep, subtotal, freeShipping: true, reason: undefined });
  }

  const token = process.env.FRENET_TOKEN?.trim();
  if (!token) {
    return fallbackQuote({ destinationCep, subtotal, freeShipping: false, reason: 'provider_not_configured' });
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
    return fallbackQuote({
      destinationCep,
      subtotal,
      freeShipping: false,
      reason: 'missing_measurements',
      missingMeasurementProducts,
    });
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
        SellerCEP: originCep,
        RecipientCEP: destinationCep,
        RecipientCountry: 'BR',
        ShipmentInvoiceValue: Number(subtotal.toFixed(2)),
        ShippingItemArray: shippingItems,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(9000),
    });

    if (!response.ok) {
      return fallbackQuote({ destinationCep, subtotal, freeShipping: false, reason: 'provider_error' });
    }

    const data = (await response.json()) as FrenetResponse;
    const services = data.ShippingSevicesArray ?? data.ShippingServicesArray ?? [];
    const options = services
      .filter((service) => !serviceHasError(service.Error))
      .flatMap((service): NationalShippingOption[] => {
        const label = `${service.Carrier || service.CarrierCode || ''} ${service.ServiceDescription || ''}`.trim();
        if (!/correios|\bpac\b|\bsedex\b|mini envios/i.test(label) || /retirada|pickup/i.test(label)) return [];
        const price = money(service.ShippingPrice ?? service.OriginalShippingPrice);
        const serviceId = String(service.ServiceCode || '').trim();
        if (price == null || !serviceId) return [];
        const description = String(service.ServiceDescription || service.Carrier || 'Correios').trim();
        return [{
          serviceId,
          name: description,
          provider: 'Frenet',
          price,
          deadline: days(service.DeliveryTime ?? service.OriginalDeliveryTime),
          estimated: false,
          fallback: false,
        }];
      })
      .sort((a, b) => a.price - b.price || Number(a.deadline ?? 999) - Number(b.deadline ?? 999));

    if (!options.length) {
      return fallbackQuote({ destinationCep, subtotal, freeShipping: false, reason: 'no_service' });
    }

    return {
      configured: true,
      available: true,
      freeShipping: false,
      originCep,
      destinationCep,
      options: [options[0]],
    };
  } catch (error) {
    console.warn('Frenet national quote unavailable:', error instanceof Error ? error.message : error);
    return fallbackQuote({ destinationCep, subtotal, freeShipping: false, reason: 'provider_error' });
  }
}
