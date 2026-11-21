import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    return NextResponse.json({ configured: false, ok: false, reason: 'missing_key' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions?limit=1', {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json({
        configured: true,
        ok: false,
        status: response.status,
        reason: data?.error?.code || data?.error?.type || 'stripe_error',
      }, { status: 502 });
    }
    return NextResponse.json({
      configured: true,
      ok: true,
      livemode: Boolean(data?.data?.[0]?.livemode),
      checkoutSessionsReadable: true,
    });
  } catch {
    return NextResponse.json({ configured: true, ok: false, reason: 'network_error' }, { status: 502 });
  }
}
