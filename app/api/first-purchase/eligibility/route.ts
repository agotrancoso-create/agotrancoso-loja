import { NextResponse } from 'next/server';
import { checkFirstPurchaseEligibility } from '@/lib/first-purchase';

export const dynamic = 'force-dynamic';

function firstPurchaseStorageAvailable() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return Boolean(url && token);
}

export async function GET() {
  return NextResponse.json(
    { available: firstPurchaseStorageAvailable() },
    { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await checkFirstPurchaseEligibility({ email: body?.email, phone: body?.phone });
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('First purchase eligibility error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message === 'FIRST_PURCHASE_STORAGE_NOT_CONFIGURED') {
      return NextResponse.json(
        { eligible: false, error: 'O benefício de primeira compra está temporariamente indisponível.' },
        { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
      );
    }
    return NextResponse.json(
      { eligible: false, error: 'Não foi possível validar o benefício agora. Tente novamente.' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
