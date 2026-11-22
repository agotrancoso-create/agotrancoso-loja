import { NextResponse, after } from 'next/server';
import { sendPinterestConfirmedPurchase } from '@/lib/pinterest-server';
import { retrieveStripeCheckoutLineItems, retrieveStripeCheckoutSession } from '@/lib/stripe-server';

function safeSessionId(value: unknown) {
  const id = String(value ?? '').trim();
  return /^cs_(test|live)_[A-Za-z0-9_]+$/.test(id) ? id : '';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sessionId = safeSessionId(body.sessionId);
    if (!sessionId) return NextResponse.json({ error: 'Sessão inválida.' }, { status: 400 });

    const [session, lineItems] = await Promise.all([
      retrieveStripeCheckoutSession(sessionId),
      retrieveStripeCheckoutLineItems(sessionId),
    ]);

    const orderId = String(session.client_reference_id || session.metadata?.ago_order_id || '').trim();
    const paid = session.payment_status === 'paid';
    const items = Array.isArray(lineItems?.data) ? lineItems.data.flatMap((line: any) => {
      const quantity = Number(line?.quantity);
      const unitAmount = Number(line?.price?.unit_amount);
      const product = line?.price?.product;
      const productId = typeof product === 'object' ? String(product?.metadata?.ago_product_id || '').trim() : '';
      const itemName = String(line?.description || (typeof product === 'object' ? product?.name : '') || '').trim();
      if (!productId || !itemName || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(unitAmount) || unitAmount <= 0) return [];
      return [{
        item_id: productId,
        item_name: itemName,
        price: Number((unitAmount / 100).toFixed(2)),
        quantity,
      }];
    }) : [];

    const amountTotal = Number(session.amount_total);
    const shippingAmount = Number(session.total_details?.amount_shipping || 0);
    const currency = String(session.currency || 'brl').toUpperCase();

    // Conversion occurs only for sessions Stripe marks paid and for visitors
    // who opted in to marketing analytics. No browser-supplied prices are trusted.
    if (paid && /^AGO-/.test(orderId) && Number.isFinite(amountTotal) && amountTotal > 0 && body?.analyticsConsent === true) {
      const email = String(session?.customer_details?.email || session?.customer_email || '').trim();
      after(() => sendPinterestConfirmedPurchase({
        orderId,
        total: amountTotal / 100,
        shipping: Number.isFinite(shippingAmount) ? shippingAmount / 100 : 0,
        currency,
        source: 'stripe',
        email,
        items: items.map((item: { item_id: string; item_name: string; price: number; quantity: number }) => ({
          id: item.item_id,
          name: item.item_name,
          price: item.price,
          quantity: item.quantity,
        })),
        clientIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        userAgent: req.headers.get('user-agent'),
      }));
    }

    return NextResponse.json({
      paid,
      status: String(session.status || ''),
      paymentStatus: String(session.payment_status || ''),
      orderId,
      currency,
      value: Number.isFinite(amountTotal) ? Number((amountTotal / 100).toFixed(2)) : 0,
      shipping: Number.isFinite(shippingAmount) ? Number((shippingAmount / 100).toFixed(2)) : 0,
      items,
    });
  } catch (error) {
    console.error('Stripe session verification error:', error);
    return NextResponse.json({ error: 'Não foi possível confirmar o pagamento agora.' }, { status: 502 });
  }
}
