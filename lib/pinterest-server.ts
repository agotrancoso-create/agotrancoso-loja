import 'server-only';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { SITE_DOMAIN } from '@/lib/config';

const AD_ACCOUNT_ID = '549771027158';

type PinterestPurchaseItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
};

type PinterestPurchase = {
  orderId: string;
  total: number;
  shipping?: number;
  currency: string;
  items: PinterestPurchaseItem[];
  source: 'infinitepay' | 'stripe';
  email?: string;
  hashedEmail?: string;
  clientIp?: string | null;
  userAgent?: string | null;
};

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function extractClientIp(header: string | null | undefined) {
  const first = String(header || '').split(',')[0].trim();
  return isIP(first) ? first : undefined;
}

/**
 * Only call after authoritative payment verification and affirmative analytics
 * consent. The access token is NEVER a NEXT_PUBLIC_ variable or source constant.
 * This method cannot initiate or capture payments and does not affect checkout.
 */
export async function sendPinterestConfirmedPurchase(input: PinterestPurchase) {
  const token = process.env.PINTEREST_CONVERSIONS_ACCESS_TOKEN?.trim();
  if (!token) return;
  if (!/^AGO-[A-Z0-9-]+$/i.test(input.orderId) || !Number.isFinite(input.total) || input.total <= 0) return;

  const normalizedEmail = String(input.email || '').trim().toLowerCase();
  const emailHash = /^[a-f0-9]{64}$/i.test(input.hashedEmail || '')
    ? input.hashedEmail!.toLowerCase()
    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
      ? sha256(normalizedEmail)
      : undefined;
  const ua = String(input.userAgent || '').slice(0, 600);
  const ip = extractClientIp(input.clientIp);
  const items = input.items.filter((item) =>
    Boolean(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 &&
    Number.isFinite(item.price) && item.price > 0
  );
  const subtotal = Math.max(0.01, input.total - Math.max(0, input.shipping || 0));

  const userData = {
    ...(emailHash ? { em: [emailHash] } : {}),
    ...(ip ? { client_ip_address: ip } : {}),
    ...(ua ? { client_user_agent: ua } : {}),
  };
  // Do not submit an anonymous event without any matching signals.
  if (!Object.keys(userData).length) return;

  const event = {
    event_name: 'checkout',
    action_source: 'web',
    event_id: input.orderId, // Identical to browser pintrk Checkout event ID.
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: SITE_DOMAIN + (input.source === 'stripe' ? '/confirmacao-stripe' : '/confirmacao'),
    opt_out: false,
    partner_name: 'direct',
    user_data: userData,
    custom_data: {
      order_id: input.orderId,
      currency: input.currency.toUpperCase() || 'BRL',
      value: subtotal.toFixed(2),
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
      content_ids: items.map((item) => item.id),
      contents: items.map((item) => ({
        id: item.id,
        item_name: item.name,
        item_price: item.price.toFixed(2),
        quantity: item.quantity,
        ...(item.category ? { item_category: item.category } : {}),
      })),
    },
  };

  try {
    const response = await fetch(
      `https://api.pinterest.com/v5/ad_accounts/${AD_ACCOUNT_ID}/events`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event] }),
        cache: 'no-store',
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) {
      // No tokens, PII, API response bodies or URLs with customer data in logs.
      console.error('Pinterest conversion API rejected confirmed event', {
        status: response.status,
        source: input.source,
      });
    }
  } catch {
    console.error('Pinterest conversion API delivery unavailable', { source: input.source });
  }
}
