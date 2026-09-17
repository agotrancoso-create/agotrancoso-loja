import { markFirstPurchaseAsPaid } from '@/lib/first-purchase';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderNsu = String(data?.order_nsu || '');
    if (!orderNsu) return new Response('Pedido não encontrado', { status: 400 });

    console.log('InfinitePay webhook:', {
      invoice_slug: data?.invoice_slug,
      amount: data?.amount,
      paid_amount: data?.paid_amount,
      installments: data?.installments,
      transaction_nsu: data?.transaction_nsu,
      order_nsu: orderNsu,
      capture_method: data?.capture_method,
      receipt_url: data?.receipt_url,
    });

    await markFirstPurchaseAsPaid(orderNsu);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Invalid InfinitePay webhook:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
