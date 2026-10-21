import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { calculateSuperfreteQuote, isSuperfreteConfigured } from '@/lib/superfrete';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function authorized(request: Request): boolean {
  const expected = process.env.SUPERFRETE_INTERNAL_KEY?.trim();
  const provided = request.headers.get('x-ago-internal-key') || '';
  if (!expected || !provided) return false;
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

function privateResponse(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
}

/**
 * Internal operational quote only; never called by customer checkout.
 * Requires a separate internal key, NOT the provider API token.
 */
export async function POST(request: Request) {
  if (!authorized(request)) return privateResponse({ error: 'Not found' }, 404);
  if (!isSuperfreteConfigured()) return privateResponse({ ok: false, reason: 'not_configured' }, 503);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid');
    body = parsed as Record<string, unknown>;
  } catch {
    return privateResponse({ error: 'Informe os dados da embalagem.' }, 400);
  }

  const result = await calculateSuperfreteQuote({
    fromCep: typeof body.fromCep === 'string' ? body.fromCep : '',
    toCep: typeof body.toCep === 'string' ? body.toCep : '',
    width: typeof body.width === 'number' ? body.width : NaN,
    height: typeof body.height === 'number' ? body.height : NaN,
    length: typeof body.length === 'number' ? body.length : NaN,
    weight: typeof body.weight === 'number' ? body.weight : NaN,
  });
  return privateResponse(result, result.ok ? 200 : result.reason === 'invalid_input' ? 400 : 502);
}
