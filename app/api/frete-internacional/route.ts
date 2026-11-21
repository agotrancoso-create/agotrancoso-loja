import { NextResponse } from 'next/server';
import { getInternationalShippingQuote } from '@/lib/international-shipping';
import type { CartItem } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = (Array.isArray(body.items) ? body.items : []) as CartItem[];
    const countryCode = String(body.countryCode || '').trim().toUpperCase();
    const postalCode = String(body.postalCode || '').trim();

    const quote = await getInternationalShippingQuote({ countryCode, postalCode, items });
    const invalid = quote.reason === 'invalid_destination' || quote.reason === 'invalid_cart';

    return NextResponse.json({
      ...quote,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      strategy: 'Correios / Minhas Exportações / Exporta Fácil — cotação confirmada antes do pagamento',
    }, { status: invalid ? 400 : 200 });
  } catch (error) {
    console.error('International shipping quote error:', error);
    return NextResponse.json({
      configured: false,
      available: false,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      options: [],
      reason: 'manual_correios_quote',
    }, { status: 200 });
  }
}
