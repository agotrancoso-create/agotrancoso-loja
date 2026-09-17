import 'server-only';
import { createHash } from 'node:crypto';

const RESERVATION_TTL_SECONDS = 2 * 60 * 60;
const ORDER_TTL_SECONDS = 30 * 24 * 60 * 60;

type IdentityRecord = {
  orderNsu: string;
  status: 'reserved' | 'paid';
  createdAt: string;
};

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('FIRST_PURCHASE_STORAGE_NOT_CONFIGURED');
  }
  return { url: url.replace(/\/$/, ''), token };
}

async function redisCommand<T = unknown>(command: unknown[]) {
  const { url, token } = redisConfig();
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
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
  return digits.length >= 10 ? digits : '';
}

export async function reserveFirstPurchaseIdentity(input: {
  orderNsu: string;
  email: unknown;
  phone: unknown;
}) {
  const email = normalizeCustomerEmail(input.email);
  const phone = normalizeCustomerPhone(input.phone);
  if (!email || !phone) {
    return { eligible: false, reason: 'Informe um e-mail e telefone válidos para usar o benefício.' };
  }

  const keys = [emailKey(email), phoneKey(phone)];
  const existing = await redisCommand<(string | null)[]>(['MGET', ...keys]);
  if (existing?.some(Boolean)) {
    return { eligible: false, reason: 'O benefício de 3% OFF da primeira compra já foi utilizado com este e-mail ou telefone.' };
  }

  const record: IdentityRecord = {
    orderNsu: input.orderNsu,
    status: 'reserved',
    createdAt: new Date().toISOString(),
  };
  const value = JSON.stringify(record);

  const emailResult = await redisCommand<string | null>(['SET', keys[0], value, 'NX', 'EX', String(RESERVATION_TTL_SECONDS)]);
  if (emailResult !== 'OK') {
    return { eligible: false, reason: 'O benefício de primeira compra não está disponível para esses dados.' };
  }

  const phoneResult = await redisCommand<string | null>(['SET', keys[1], value, 'NX', 'EX', String(RESERVATION_TTL_SECONDS)]);
  if (phoneResult !== 'OK') {
    await redisCommand(['DEL', keys[0]]).catch(() => undefined);
    return { eligible: false, reason: 'O benefício de primeira compra não está disponível para esses dados.' };
  }

  await redisCommand(['SET', orderKey(input.orderNsu), JSON.stringify({ emailKey: keys[0], phoneKey: keys[1] }), 'EX', String(ORDER_TTL_SECONDS)]);
  return { eligible: true };
}

export async function markFirstPurchaseAsPaid(orderNsu: string) {
  if (!orderNsu) return false;
  const raw = await redisCommand<string | null>(['GET', orderKey(orderNsu)]);
  if (!raw) return false;

  const parsed = JSON.parse(raw) as { emailKey?: string; phoneKey?: string };
  const record: IdentityRecord = {
    orderNsu,
    status: 'paid',
    createdAt: new Date().toISOString(),
  };
  const value = JSON.stringify(record);

  if (parsed.emailKey) await redisCommand(['SET', parsed.emailKey, value]);
  if (parsed.phoneKey) await redisCommand(['SET', parsed.phoneKey, value]);
  await redisCommand(['EXPIRE', orderKey(orderNsu), String(ORDER_TTL_SECONDS)]);
  return true;
}
