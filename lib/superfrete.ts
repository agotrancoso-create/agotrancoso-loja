/**
 * SuperFrete API connector for internal operational quotes.
 * Server-side only: no credentials in NEXT_PUBLIC_ variables or browsers.
 * Never charge a customer, create labels or modify the site's fixed-price shipping.
 */
export type SuperfreteQuoteInput = {
  fromCep: string;
  toCep: string;
  width: number;
  height: number;
  length: number;
  weight: number; // kilograms
};

type SuperfreteService = {
  id?: number | string;
  name?: string;
  price?: number | string;
  custom_price?: number | string;
  delivery_time?: number | string;
  error?: string | null;
};

export type SuperfreteQuoteResult =
  | { ok: true; services: SuperfreteService[] }
  | { ok: false; reason: 'not_configured' | 'invalid_input' | 'provider_error' | 'provider_unavailable'; status?: number };

function normalizeCep(value: string): string {
  return value.replace(/\D/g, '');
}

function validMeasure(n: number): boolean {
  return Number.isFinite(n) && n > 0 && n <= 200;
}

export function isSuperfreteConfigured(): boolean {
  return Boolean(process.env.SUPERFRETE_TOKEN?.trim() && process.env.SUPERFRETE_CONTACT_EMAIL?.trim());
}

export async function calculateSuperfreteQuote(input: SuperfreteQuoteInput): Promise<SuperfreteQuoteResult> {
  const token = process.env.SUPERFRETE_TOKEN?.trim();
  const contact = process.env.SUPERFRETE_CONTACT_EMAIL?.trim();
  if (!token || !contact) return { ok: false, reason: 'not_configured' };

  const from = normalizeCep(input.fromCep);
  const to = normalizeCep(input.toCep);
  if (
    from.length !== 8 || to.length !== 8 ||
    ![input.width, input.height, input.length].every(validMeasure) ||
    !Number.isFinite(input.weight) || input.weight <= 0 || input.weight > 30
  ) return { ok: false, reason: 'invalid_input' };

  try {
    // PAC 1, SEDEX 2. This is a read-only quotation; never issues or pays for a label.
    const response = await fetch('https://api.superfrete.com/api/v0/calculator', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': `AgoTrancoso/1.0 (${contact})`,
      },
      body: JSON.stringify({
        from: { postal_code: from },
        to: { postal_code: to },
        services: '1,2',
        package: { width: input.width, height: input.height, length: input.length, weight: input.weight },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return { ok: false, reason: 'provider_error', status: response.status };
    const body: unknown = await response.json();
    const services = Array.isArray(body) ? body : (
      body && typeof body === 'object' && 'services' in body && Array.isArray(body.services) ? body.services : null
    );
    if (!services) return { ok: false, reason: 'provider_error', status: response.status };
    // Strict allowlist to avoid forwarding unexpected provider response fields to callers.
    const safe = (services as SuperfreteService[]).map((service) => ({
      id: service.id,
      name: service.name,
      price: service.price,
      custom_price: service.custom_price,
      delivery_time: service.delivery_time,
      error: service.error,
    }));
    return { ok: true, services: safe };
  } catch {
    return { ok: false, reason: 'provider_unavailable' };
  }
}
