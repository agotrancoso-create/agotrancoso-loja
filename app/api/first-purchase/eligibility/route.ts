import { NextResponse } from 'next/server';
import { checkFirstPurchaseEligibility, isFirstPurchaseStorageConfigured } from '@/lib/first-purchase';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      available: true,
      secureValidation: isFirstPurchaseStorageConfigured(),
    },
    { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } },
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await checkFirstPurchaseEligibility({ email: body?.email, phone: body?.phone, document: body?.document });
    return NextResponse.json(result, { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } });
  } catch (error) {
    console.error('First purchase eligibility error:', error);
    return NextResponse.json(
      { eligible: false, error: 'Não foi possível validar o benefício agora. Tente novamente.' },
      { status: 503, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
