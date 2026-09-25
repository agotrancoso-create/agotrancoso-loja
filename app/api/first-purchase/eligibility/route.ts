import { NextResponse } from 'next/server';
import { checkFirstPurchaseEligibility } from '@/lib/first-purchase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await checkFirstPurchaseEligibility({ email: body?.email, phone: body?.phone });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('First purchase eligibility error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message === 'FIRST_PURCHASE_STORAGE_NOT_CONFIGURED') {
      return NextResponse.json({ eligible: false, error: 'O benefício de primeira compra está temporariamente indisponível.' }, { status: 503 });
    }
    return NextResponse.json({ eligible: false, error: 'Não foi possível validar o benefício agora. Tente novamente.' }, { status: 503 });
  }
}
