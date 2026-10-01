type FrenetService = {
  ServiceCode?: string;
  ServiceDescription?: string;
  Carrier?: string;
  DeliveryTime?: number | string;
  OriginalDeliveryTime?: number | string;
  Error?: boolean | string;
};

type FrenetResponse = {
  ShippingSevicesArray?: FrenetService[];
  ShippingServicesArray?: FrenetService[];
};

export type ShippingDeadlineQuote = {
  deadline: number | string;
  provider: 'Frenet';
  serviceId?: string;
  serviceName?: string;
};

function digits(value: string | undefined) {
  return String(value ?? '').replace(/\D/g, '');
}

function parseDays(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

function serviceHasError(value: FrenetService['Error']) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().length > 0 && value.toLowerCase() !== 'false';
  return false;
}

export async function getShippingDeadlineQuote(params: {
  destinationCep: string;
  subtotal: number;
}): Promise<ShippingDeadlineQuote | null> {
  const token = process.env.FRENET_TOKEN?.trim();
  const sellerCep = digits(process.env.FRENET_SELLER_CEP);
  const destinationCep = digits(params.destinationCep);

  if (!token || sellerCep.length !== 8 || destinationCep.length !== 8) return null;

  try {
    const response = await fetch('https://api.frenet.com.br/shipping/quote', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        token,
      },
      body: JSON.stringify({
        SellerCEP: sellerCep,
        RecipientCEP: destinationCep,
        ShipmentInvoiceValue: Number(params.subtotal.toFixed(2)),
        RecipientCountry: 'BR',
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(4500),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as FrenetResponse;
    const services = data.ShippingSevicesArray ?? data.ShippingServicesArray ?? [];
    const valid = services
      .filter((service) => !serviceHasError(service.Error))
      .map((service) => ({ service, days: parseDays(service.DeliveryTime ?? service.OriginalDeliveryTime) }))
      .filter((entry): entry is { service: FrenetService; days: number } => entry.days !== null)
      .sort((a, b) => a.days - b.days);

    if (!valid.length) return null;

    const minDays = valid[0].days;
    const maxDays = valid[valid.length - 1].days;
    const deadline = minDays === maxDays ? minDays : `${minDays}–${maxDays}`;
    const representative = valid[0].service;

    return {
      deadline,
      provider: 'Frenet',
      serviceId: representative.ServiceCode,
      serviceName: representative.ServiceDescription || representative.Carrier,
    };
  } catch (error) {
    console.warn('Frenet deadline quote unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}
