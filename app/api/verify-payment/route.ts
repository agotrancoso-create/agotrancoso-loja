import { NextResponse, after } from 'next/server';
import { sendPinterestConfirmedPurchase } from '@/lib/pinterest-server';
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

    const verifiedAmountCents = Number(payment.amount);
    if ((typeof payment.amount !== 'number' && typeof payment.amount !== 'string') || !Number.isSafeInteger(verifiedAmountCents) || verifiedAmountCents <= 0 || !Number.isInteger(verifiedAmountCents)) {
      return NextResponse.json({ confirmed: false }, { status: 422, headers: noStore });
    }

    const order = await getFirstPurchaseOrder(orderNsu);
    if (order && verifiedAmountCents !== order.expectedAmountCents) {
      return NextResponse.json({ confirmed: false }, { status: 422, headers: noStore });
    }

    const snapshot = order?.analytics;
    const purchase = {
      transactionId: orderNsu,
      currency: 'BRL' as const,
      value: Number((verifiedAmountCents / 100).toFixed(2)),
      ...(snapshot ? {
        shipping: Number((snapshot.shippingCents / 100).toFixed(2)),
        ...(snapshot.coupon ? { coupon: snapshot.coupon } : {}),
        items: snapshot.items.map((item) => ({
          item_id: item.itemId,
          item_name: item.itemName,
          price: Number((item.unitPriceCents / 100).toFixed(2)),
          quantity: item.quantity,
          ...(item.itemCategory ? { item_category: item.itemCategory } : {}),
        })),
      } : {}),
    };

    // Never report a merely-created checkout. This executes only after
    // InfinitePay confirms the payment amount and the browser opted into analytics.
    if (body?.analyticsConsent === true) {
      after(() => sendPinterestConfirmedPurchase({
        orderId: orderNsu,
        total: purchase.value,
        shipping: purchase.shipping,
        currency: 'BRL',
        source: 'infinitepay',
        items: snapshot?.items.map((item) => ({
          id: item.itemId,
          name: item.itemName,
          price: item.unitPriceCents / 100,
          quantity: item.quantity,
          ...(item.itemCategory ? { category: item.itemCategory } : {}),
        })) || [],
        hashedEmail: order?.emailKey.split(':').pop(),
        clientIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      }));
    }

    return NextResponse.json({ confirmed: true, purchase }, { headers: noStore });
  } catch (error) {
    console.error('Payment return verification error:', error);
    return NextResponse.json({ confirmed: false }, { status: 502, headers: noStore });
  }
}
