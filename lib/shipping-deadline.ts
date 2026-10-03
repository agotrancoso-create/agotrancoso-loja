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

type CorreiosPrazoResponse = {
  coProduto?: string;
  prazoEntrega?: number | string;
  dataMaxima?: string;
  txErro?: string;
};

export type ShippingDeadlineQuote = {
  deadline: number | string;
  provider: 'Correios' | 'Frenet' | 'Estimativa Agô';
  serviceId?: string;
  serviceName?: string;
  estimated?: boolean;
};

/* CEP de origem já utilizado pela operação. Pode ser sobrescrito por SHIP_FROM_CEP. */
export const DEFAULT_SHIP_FROM_CEP = '46098000';

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

export function getShipFromCep() {
  const configured = digits(process.env.SHIP_FROM_CEP || process.env.FRENET_SELLER_CEP);
  return configured.length === 8 ? configured : DEFAULT_SHIP_FROM_CEP;
}

export function getShippingDeadlineProviderState() {
  const correiosConfigured = Boolean((process.env.CORREIOS_TOKEN || process.env.CORREIOS_ACCESS_KEY)?.trim());
  const frenetConfigured = Boolean(process.env.FRENET_TOKEN?.trim());
  return {
    correiosConfigured,
    frenetConfigured,
    configured: true,
    provider: correiosConfigured ? 'Correios' : frenetConfigured ? 'Frenet' : 'Estimativa Agô',
    originCep: getShipFromCep(),
  } as const;
}

async function getCorreiosDeadlineQuote(destinationCep: string): Promise<ShippingDeadlineQuote | null> {
  const token = (process.env.CORREIOS_TOKEN || process.env.CORREIOS_ACCESS_KEY)?.trim();
  const sellerCep = getShipFromCep();
  const serviceCode = digits(process.env.CORREIOS_SERVICE_CODE) || '03298';

  if (!token || sellerCep.length !== 8 || destinationCep.length !== 8 || serviceCode.length < 4) return null;

  try {
    const url = new URL(`https://api.correios.com.br/prazo/v1/nacional/${serviceCode}`);
    url.searchParams.set('cepOrigem', sellerCep);
    url.searchParams.set('cepDestino', destinationCep);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(4500),
    });

    if (!response.ok) return null;

    const raw = (await response.json()) as CorreiosPrazoResponse | CorreiosPrazoResponse[];
    const data = Array.isArray(raw) ? raw[0] : raw;
    if (!data || data.txErro) return null;

    const days = parseDays(data.prazoEntrega);
    if (days === null) return null;

    return {
      deadline: days,
      provider: 'Correios',
      serviceId: data.coProduto || serviceCode,
      serviceName: serviceCode === '03298' ? 'PAC' : 'Correios',
      estimated: false,
    };
  } catch (error) {
    console.warn('Correios deadline quote unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function getFrenetDeadlineQuote(params: {
  destinationCep: string;
  subtotal: number;
}): Promise<ShippingDeadlineQuote | null> {
  const token = process.env.FRENET_TOKEN?.trim();
  const sellerCep = getShipFromCep();
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
      .filter((service) => !serviceHasError(service.Error) && /correios|\bPAC\b|\bSEDEX\b/i.test(`${service.Carrier || ''} ${service.ServiceDescription || ''}`))
      .map((service) => ({ service, days: parseDays(service.DeliveryTime ?? service.OriginalDeliveryTime) }))
      .filter((entry): entry is { service: FrenetService; days: number } => entry.days !== null)
      .sort((a, b) => a.days - b.days);

    if (!valid.length) return null;

    const serviceCode = digits(process.env.CORREIOS_SERVICE_CODE) || '03298';
    const selected = valid.find(({ service }) => service.ServiceCode === serviceCode)
      ?? (serviceCode === '03298' ? valid.find(({ service }) => /\bPAC\b/i.test(service.ServiceDescription || '')) : undefined)
      ?? valid[0];
    const representative = selected.service;

    return {
      deadline: selected.days,
      provider: 'Frenet',
      serviceId: representative.ServiceCode,
      serviceName: representative.ServiceDescription || representative.Carrier,
      estimated: false,
    };
  } catch (error) {
    console.warn('Frenet deadline quote unavailable:', error instanceof Error ? error.message : error);
    return null;
  }
}

/*
 * Fallback conservador quando Correios/Frenet não devolvem prazo.
 * Não inventa peso nem dimensões: considera apenas a faixa do CEP de destino
 * a partir da origem da operação na Bahia e é sempre identificado como estimativa.
 */
function getEstimatedDeadline(destinationCep: string): ShippingDeadlineQuote {
  const firstDigit = Number(destinationCep[0]);
  let deadline = '6–12';

  if (firstDigit === 4) deadline = '3–7';
  else if (firstDigit === 5) deadline = '4–9';
  else if (firstDigit >= 0 && firstDigit <= 3) deadline = '5–10';
  else if (firstDigit === 6 || firstDigit === 7) deadline = '6–12';
  else if (firstDigit === 8) deadline = '7–12';
  else if (firstDigit === 9) deadline = '8–13';

  return {
    deadline,
    provider: 'Estimativa Agô',
    serviceId: 'estimated-by-cep',
    serviceName: 'Prazo estimado pelo CEP',
    estimated: true,
  };
}

export async function getShippingDeadlineQuote(params: {
  destinationCep: string;
  subtotal: number;
}): Promise<ShippingDeadlineQuote | null> {
  const destinationCep = digits(params.destinationCep);
  if (destinationCep.length !== 8) return null;

  const correios = await getCorreiosDeadlineQuote(destinationCep);
  if (correios) return correios;

  const frenet = await getFrenetDeadlineQuote({ destinationCep, subtotal: params.subtotal });
  if (frenet) return frenet;

  return getEstimatedDeadline(destinationCep);
}
