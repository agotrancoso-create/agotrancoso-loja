import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

type StripeParams = Record<string, unknown>;

function secretKey() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) throw new Error('STRIPE_NOT_CONFIGURED');
  return key;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

function appendParam(form: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (item !== undefined && item !== null && typeof item === 'object') appendParam(form, `${key}[${index}]`, item);
      else appendParam(form, `${key}[]`, item);
    });
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value as Record<string, unknown>).forEach(([childKey, childValue]) => {
      appendParam(form, `${key}[${childKey}]`, childValue);
    });
    return;
  }
  form.append(key, typeof value === 'boolean' ? String(value) : String(value));
}

function toForm(params: StripeParams) {
  const form = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => appendParam(form, key, value));
  return form;
}

async function stripeRequest<T>(path: string, init?: { method?: 'GET' | 'POST'; params?: StripeParams; query?: URLSearchParams }) {
  const method = init?.method ?? 'GET';
  const query = init?.query?.toString();
  const response = await fetch(`https://api.stripe.com${path}${query ? `?${query}` : ''}`, {
    method,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      ...(method === 'POST' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    ...(method === 'POST' ? { body: toForm(init?.params ?? {}) } : {}),
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof data?.error?.message === 'string' ? data.error.message : `Stripe API error ${response.status}`;
    throw new Error(message);
  }
  return data as T;
}

export function createStripeCheckoutSession(params: StripeParams) {
  return stripeRequest<any>('/v1/checkout/sessions', { method: 'POST', params });
}

export function retrieveStripeCheckoutSession(sessionId: string) {
  return stripeRequest<any>(`/v1/checkout/sessions/${encodeURIComponent(sessionId)}`);
}

export function retrieveStripeCheckoutLineItems(sessionId: string) {
  const query = new URLSearchParams();
  query.set('limit', '100');
  query.append('expand[]', 'data.price.product');
  return stripeRequest<any>(`/v1/checkout/sessions/${encodeURIComponent(sessionId)}/line_items`, { query });
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !signatureHeader) return false;

  const parts = signatureHeader.split(',').map(part => part.trim());
  const timestamp = parts.find(part => part.startsWith('t='))?.slice(2);
  const signatures = parts.filter(part => part.startsWith('v1=')).map(part => part.slice(3));
  if (!timestamp || !signatures.length) return false;

  const timestampNumber = Number(timestamp);
  if (!Number.isFinite(timestampNumber)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNumber) > 300) return false;

  const expected = createHmac('sha256', secret).update(`${timestamp}.${payload}`, 'utf8').digest('hex');

  return signatures.some(signature => {
    try {
      const a = Buffer.from(expected, 'hex');
      const b = Buffer.from(signature, 'hex');
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}
