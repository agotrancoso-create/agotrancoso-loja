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
      strategy: 'Tarifa fixa internacional da Agô por região; postagem realizada a partir de Trancoso.',
    }, { status: invalid ? 400 : 200 });
  } catch (error) {
    console.error('International shipping quote error:', error);
    return NextResponse.json({
      configured: true,
      available: false,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      options: [],
      reason: 'invalid_cart',
    }, { status: 400 });
  }
}
