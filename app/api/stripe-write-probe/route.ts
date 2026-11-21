import { NextResponse } from 'next/server';
import { createStripeCheckoutSession } from '@/lib/stripe-server';

export async function POST(req: Request) {
  if (process.env.VERCEL_ENV !== 'preview') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const url = new URL(req.url);
    const origin = url.origin;
    const session = await createStripeCheckoutSession({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'brl',
          unit_amount: 100,
          product_data: { name: 'Agô Trancoso · teste técnico do checkout' },
        },
        quantity: 1,
      }],
      success_url: `${origin}/?stripe_probe=success`,
      cancel_url: `${origin}/?stripe_probe=cancel`,
      metadata: { technical_probe: 'true' },
    });

    return NextResponse.json({
      ok: Boolean(session?.id),
      sessionId: session?.id || null,
      livemode: Boolean(session?.livemode),
      status: session?.status || null,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      reason: error instanceof Error ? error.message : 'stripe_error',
    }, { status: 502 });
  }
}
