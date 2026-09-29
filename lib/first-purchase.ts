import 'server-only';
import { createHash } from 'node:crypto';
import { normalizeBrazilianDocument, isValidBrazilianDocument } from './checkout-validation';

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
  documentKey?: string;
  expectedAmountCents: number;
  discountCents: number;
  firstPurchase?: boolean;
  createdAt: string;
};

export function isFirstPurchaseStorageConfigured() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

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

function emailKey(email: string) { return `ago:first-purchase:email:${hashIdentity(email)}`; }
function phoneKey(phone: string) { return `ago:first-purchase:phone:${hashIdentity(phone)}`; }
function documentKey(document: string) { return `ago:first-purchase:document:${hashIdentity(document)}`; }
function orderKey(orderNsu: string) { return `ago:first-purchase:order:${orderNsu}`; }

export function normalizeCustomerEmail(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

export function normalizeCustomerPhone(value: unknown) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return digits.slice(2);
  return digits.length === 10 || digits.length === 11 ? digits : '';
}

function normalizeCustomerDocument(value: unknown) {
  const document = normalizeBrazilianDocument(value);
  return isValidBrazilianDocument(document) ? document : '';
}

function normalizedIdentity(input: { email: unknown; phone: unknown; document: unknown }) {
  const email = normalizeCustomerEmail(input.email);
  const phone = normalizeCustomerPhone(input.phone);
  const document = normalizeCustomerDocument(input.document);
  if (!email || !phone || !document) return null;
  return { keys: [emailKey(email), phoneKey(phone), documentKey(document)] as const };
}

/* Pré-checagem da etapa Benefício: o checkout já possui e-mail e telefone; o
   CPF/CNPJ entra quando informado. A reserva final, antes de gerar pagamento,
   exige obrigatoriamente os três identificadores. */
export async function checkFirstPurchaseEligibility(input: { email: unknown; phone: unknown; document?: unknown }) {
  if (!isFirstPurchaseStorageConfigured()) {
    return { eligible: false, reason: 'A validação segura do benefício está temporariamente indisponível.' };
  }

  const email = normalizeCustomerEmail(input.email);
  const phone = normalizeCustomerPhone(input.phone);
  if (!email || !phone) {
    return { eligible: false, reason: 'Informe e-mail e telefone válidos para confirmar o benefício.' };
  }
  const document = normalizeCustomerDocument(input.document);
  const keys = [emailKey(email), phoneKey(phone), ...(document ? [documentKey(document)] : [])];
  const existing = await redisCommand<(string | null)[]>(['MGET', ...keys]);
  if (existing?.some(Boolean)) {
    return { eligible: false, reason: 'Este benefício é exclusivo para a primeira compra neste cadastro.' };
  }
  return { eligible: true as const };
}

export async function reserveFirstPurchaseIdentity(input: {
  orderNsu: string;
  email: unknown;
  phone: unknown;
  document: unknown;
  expectedAmountCents: number;
  discountCents: number;
}) {
  if (!isFirstPurchaseStorageConfigured()) {
    return { eligible: false, reason: 'A validação segura do benefício está temporariamente indisponível.' };
  }

  const identity = normalizedIdentity(input);
  if (!identity) {
    return { eligible: false, reason: 'Informe e-mail, telefone e CPF/CNPJ válidos para confirmar o benefício.' };
  }

  const [emailIdentityKey, phoneIdentityKey, documentIdentityKey] = identity.keys;
  const keys = [emailIdentityKey, phoneIdentityKey, documentIdentityKey, orderKey(input.orderNsu)];
  const now = new Date().toISOString();
  const identityRecord: IdentityRecord = { orderNsu: input.orderNsu, status: 'reserved', createdAt: now };
  const order: FirstPurchaseOrderRecord = {
    emailKey: emailIdentityKey,
    phoneKey: phoneIdentityKey,
    documentKey: documentIdentityKey,
    expectedAmountCents: Math.max(0, Math.round(input.expectedAmountCents)),
    discountCents: Math.max(0, Math.round(input.discountCents)),
    firstPurchase: true,
    createdAt: now,
  };

  const script = `
    if redis.call('EXISTS', KEYS[1]) == 1 or redis.call('EXISTS', KEYS[2]) == 1 or redis.call('EXISTS', KEYS[3]) == 1 then return 0 end
    redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2])
    redis.call('SET', KEYS[2], ARGV[1], 'EX', ARGV[2])
    redis.call('SET', KEYS[3], ARGV[1], 'EX', ARGV[2])
    redis.call('SET', KEYS[4], ARGV[3], 'EX', ARGV[4])
    return 1
  `;
  const reserved = await redisCommand<number>(['EVAL', script, '4', ...keys, JSON.stringify(identityRecord), String(RESERVATION_TTL_SECONDS), JSON.stringify(order), String(ORDER_TTL_SECONDS)]);
  if (Number(reserved) !== 1) return { eligible: false, reason: 'Este benefício é exclusivo para a primeira compra neste cadastro.' };
  return { eligible: true as const };
}

export async function registerPurchaseOrder(input: { orderNsu: string; email: unknown; phone: unknown; document: unknown; expectedAmountCents: number }) {
  if (!isFirstPurchaseStorageConfigured()) return false;
  const identity = normalizedIdentity(input);
  if (!identity) return false;
  const [emailIdentityKey, phoneIdentityKey, documentIdentityKey] = identity.keys;
  const order: FirstPurchaseOrderRecord = {
    emailKey: emailIdentityKey,
    phoneKey: phoneIdentityKey,
    documentKey: documentIdentityKey,
    expectedAmountCents: Math.max(0, Math.round(input.expectedAmountCents)),
    discountCents: 0,
    firstPurchase: false,
    createdAt: new Date().toISOString(),
  };
  await redisCommand(['SET', orderKey(input.orderNsu), JSON.stringify(order), 'EX', String(ORDER_TTL_SECONDS)]);
  return true;
}

export async function getFirstPurchaseOrder(orderNsu: string) {
  if (!orderNsu || !isFirstPurchaseStorageConfigured()) return null;
  const raw = await redisCommand<string | null>(['GET', orderKey(orderNsu)]);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FirstPurchaseOrderRecord;
    if (!parsed?.emailKey || !parsed?.phoneKey) return null;
    return parsed;
  } catch { return null; }
}

export async function releaseFirstPurchaseReservation(orderNsu: string) {
  if (!orderNsu || !isFirstPurchaseStorageConfigured()) return false;
  const order = await getFirstPurchaseOrder(orderNsu);
  if (!order || order.firstPurchase === false) return false;
  const identityKeys = [order.emailKey, order.phoneKey, order.documentKey].filter((key): key is string => Boolean(key));
  const redisKeys = [...identityKeys, orderKey(orderNsu)];
  const script = `
    local orderNsu = ARGV[1]
    for i = 1, #KEYS - 1 do
      local raw = redis.call('GET', KEYS[i])
      if raw then
        local ok, record = pcall(cjson.decode, raw)
        if ok and record['orderNsu'] == orderNsu and record['status'] == 'reserved' then redis.call('DEL', KEYS[i]) end
      end
    end
    redis.call('DEL', KEYS[#KEYS])
    return 1
  `;
  await redisCommand(['EVAL', script, String(redisKeys.length), ...redisKeys, orderNsu]);
  return true;
}

export async function markFirstPurchaseAsPaid(orderNsu: string) {
  if (!orderNsu || !isFirstPurchaseStorageConfigured()) return false;
  const order = await getFirstPurchaseOrder(orderNsu);
  if (!order) return false;
  const record: IdentityRecord = { orderNsu, status: 'paid', createdAt: new Date().toISOString() };
  const value = JSON.stringify(record);
  const identityKeys = [order.emailKey, order.phoneKey, order.documentKey].filter((key): key is string => Boolean(key));
  const redisKeys = [...identityKeys, orderKey(orderNsu)];
  const script = `
    for i = 1, #KEYS - 1 do redis.call('SET', KEYS[i], ARGV[1]) end
    redis.call('EXPIRE', KEYS[#KEYS], ARGV[2])
    return 1
  `;
  await redisCommand(['EVAL', script, String(redisKeys.length), ...redisKeys, value, String(ORDER_TTL_SECONDS)]);
  return true;
}
