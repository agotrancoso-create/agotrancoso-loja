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

    return NextResponse.json({
      ...quote,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
    }, { status: quote.available ? 200 : 422 });
  } catch (error) {
    console.error('International shipping quote error:', error);
    return NextResponse.json({
      configured: Boolean(process.env.FRENET_TOKEN?.trim()),
      available: false,
      stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      options: [],
      reason: 'provider_error',
    }, { status: 502 });
  }
}
