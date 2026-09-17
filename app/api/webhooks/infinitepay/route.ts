import { markFirstPurchaseAsPaid } from '@/lib/first-purchase';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderNsu = String(data?.order_nsu || '');
    if (!orderNsu) return new Response('Pedido não encontrado', { status: 400 });
    await markFirstPurchaseAsPaid(orderNsu);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Invalid InfinitePay webhook:', error);
    return new Response('Webhook error', { status: 400 });
  }
}
