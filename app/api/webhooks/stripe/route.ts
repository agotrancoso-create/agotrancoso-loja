import { NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/stripe-server';

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!verifyStripeWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    const event = JSON.parse(payload);
    const type = String(event?.type || '');
    const session = event?.data?.object;

    if (type === 'checkout.session.completed' || type === 'checkout.session.async_payment_succeeded') {
      console.info('Stripe checkout paid', {
        eventId: event?.id,
        sessionId: session?.id,
        orderId: session?.client_reference_id || session?.metadata?.ago_order_id,
        paymentStatus: session?.payment_status,
      });
    } else if (type === 'checkout.session.async_payment_failed' || type === 'checkout.session.expired') {
      console.info('Stripe checkout not completed', {
        eventId: event?.id,
        type,
        sessionId: session?.id,
        orderId: session?.client_reference_id || session?.metadata?.ago_order_id,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook parse error:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
