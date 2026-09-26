import { NextResponse } from 'next/server';
import { getFirstPurchaseOrder } from '@/lib/first-purchase';

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'ago-trancoso';
const noStore = { 'Cache-Control': 'no-store' };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderNsu = String(body?.orderNsu || '').trim();
    const transactionNsu = String(body?.transactionNsu || '').trim();
    const slug = String(body?.slug || '').trim();

    if (!orderNsu.startsWith('AGO-') || !transactionNsu || !slug ||
        [orderNsu, transactionNsu, slug].some(value => value.length > 180)) {
      return NextResponse.json({ confirmed: false }, { status: 400, headers: noStore });
    }

    const response = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ handle: INFINITEPAY_HANDLE, order_nsu: orderNsu, transaction_nsu: transactionNsu, slug }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return NextResponse.json({ confirmed: false }, { status: 502, headers: noStore });

    const payment = await response.json().catch(() => ({}));
    if (payment?.success !== true || payment?.paid !== true) {
      return NextResponse.json({ confirmed: false }, { headers: noStore });
    }

    if (orderNsu.startsWith('AGO-FP-')) {
      const order = await getFirstPurchaseOrder(orderNsu);
      if (!order || Number(payment.amount) !== order.expectedAmountCents) {
        return NextResponse.json({ confirmed: false }, { status: 422, headers: noStore });
      }
    }

    return NextResponse.json({ confirmed: true }, { headers: noStore });
  } catch (error) {
    console.error('Payment return verification error:', error);
    return NextResponse.json({ confirmed: false }, { status: 502, headers: noStore });
  }
}
