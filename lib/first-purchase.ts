import 'server-only';
import { createHash } from 'node:crypto';

const RESERVATION_TTL_SECONDS = 2 * 60 * 60;
const ORDER_TTL_SECONDS = 30 * 24 * 60 * 60;

type IdentityRecord = {
  orderNsu: string;
  status: 'reserved' | 'paid';
  createdAt: string;
};

export type FirstPurchaseOrderRecord = {
  emailKey: string;
  phoneKey: string;
  expectedAmountCents: number;
  discountCents: number;
  createdAt: string;
};

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('FIRST_PURCHASE_STORAGE_NOT_CONFIGURED');
  return { url: url.replace(/\/$/, ''), token };
}

async function redisCommand<T = unknown>(command: unknown[]) {
  const { url, token } = redisConfig();
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(7000),
  });
  if (!response.ok) throw new Error(`FIRST_PURCHASE_STORAGE_${response.status}`);
  const data = await response.json();
  if (data?.error) throw new Error(String(data.error));
  return data?.result as T;
}

function hashIdentity(value: string) {
  return createHash('sha256').update(value).digest('hex');
}

function emailKey(email: string) {
  return `ago:first-purchase:email:${hashIdentity(email)}`;
}

function phoneKey(phone: string) {
  return `ago:first-purchase:phone:${hashIdentity(phone)}`;
}

function orderKey(orderNsu: string) {
  return `ago:first-purchase:order:${orderNsu}`;
}

export function normalizeCustomerEmail(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

export function normalizeCustomerPhone(value: unknown) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return digits.slice(2);
  return digits.length === 10 || digits.length === 11 ? digits : '';
}

export async function checkFirstPurchaseEligibility(input: { email: unknown; phone: unknown }) {
  const email = normalizeCustomerEmail(input.email);
  const phone = normalizeCustomerPhone(input.phone);
  if (!email || !phone) {
    return { eligible: false, reason: 'Informe um e-mail e telefone válidos para usar o benefício.' };
  }

  const existing = await redisCommand<(string | null)[]>(['MGET', emailKey(email), phoneKey(phone)]);
  if (existing?.some(Boolean)) {
    return { eligible: false, reason: 'O benefício de 3% OFF da primeira compra já foi utilizado ou está reservado para estes dados.' };
  }
  return { eligible: true as const };
}

export async function reserveFirstPurchaseIdentity(input: {
  orderNsu: string;
  email: unknown;
  phone: unknown;
  expectedAmountCents: number;
  discountCents: number;
}) {
  const email = normalizeCustomerEmail(input.email);
  const phone = normalizeCustomerPhone(input.phone);
  if (!email || !phone) {
    return { eligible: false, reason: 'Informe um e-mail e telefone válidos para usar o benefício.' };
  }

  const keys = [emailKey(email), phoneKey(phone), orderKey(input.orderNsu)];
  const now = new Date().toISOString();
  const identity: IdentityRecord = { orderNsu: input.orderNsu, status: 'reserved', createdAt: now };
  const order: FirstPurchaseOrderRecord = {
    emailKey: keys[0],
    phoneKey: keys[1],
    expectedAmountCents: Math.max(0, Math.round(input.expectedAmountCents)),
    discountCents: Math.max(0, Math.round(input.discountCents)),
    createdAt: now,
  };

  const script = `
    if redis.call('EXISTS', KEYS[1]) == 1 or redis.call('EXISTS', KEYS[2]) == 1 then
      return 0
    end
    redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
    redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[2])
    redis.call('SET', KEYS[3], ARGV[3], 'EX', ARGV[4])
    return 1
  `;
  const reserved = await redisCommand<number>([
    'EVAL', script, '3', ...keys,
    JSON.stringify(identity), String(RESERVATION_TTL_SECONDS), JSON.stringify(order), String(ORDER_TTL_SECONDS),
  ]);

  if (Number(reserved) !== 1) {
    return { eligible: false, reason: 'O benefício de 3% OFF da primeira compra já foi utilizado ou existe um pagamento iniciado com estes dados.' };
  }
  return { eligible: true as const };
}

export async function getFirstPurchaseOrder(orderNsu: string) {
  if (!orderNsu) return null;
  const raw = await redisCommand<string | null>(['GET', orderKey(orderNsu)]);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FirstPurchaseOrderRecord;
    if (!parsed?.emailKey || !parsed?.phoneKey) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function releaseFirstPurchaseReservation(orderNsu: string) {
  if (!orderNsu) return false;
  const order = await getFirstPurchaseOrder(orderNsu);
  if (!order) return false;

  const script = `
    local function release(key, orderNsu)
      local raw = redis.call('GET', key)
      if not raw then return end
      local ok, record = pcall(cjson.decode, raw)
      if ok and record['orderNsu'] == orderNsu and record['status'] == 'reserved' then
        redis.call('DEL', key)
      end
    end
    release(KEYS[1], ARGV[1])
    release(KEYS[2], ARGV[1])
    redis.call('DEL', KEYS[3])
    return 1
  `;
  await redisCommand(['EVAL', script, '3', order.emailKey, order.phoneKey, orderKey(orderNsu), orderNsu]);
  return true;
}

export async function markFirstPurchaseAsPaid(orderNsu: string) {
  if (!orderNsu) return false;
  const order = await getFirstPurchaseOrder(orderNsu);
  if (!order) return false;

  const record: IdentityRecord = { orderNsu, status: 'paid', createdAt: new Date().toISOString() };
  const value = JSON.stringify(record);
  const script = `
    redis.call('SET', KEYS[1], ARGV[1])
    redis.call('SET', KEYS[2], ARGV[1])
    redis.call('EXPIRE', KEYS[3], ARGV[2])
    return 1
  `;
  await redisCommand(['EVAL', script, '3', order.emailKey, order.phoneKey, orderKey(orderNsu), value, String(ORDER_TTL_SECONDS)]);
  return true;
}
