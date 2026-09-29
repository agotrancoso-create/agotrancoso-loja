import { getFirstPurchaseOrder, markFirstPurchaseAsPaid, isFirstPurchaseStorageConfigured } from '@/lib/first-purchase';

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'ago-trancoso';
const FIRST_PURCHASE_ORDER_PREFIX = 'AGO-FP-';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const orderNsu = String(data?.order_nsu || '').trim();

    if (!orderNsu) return new Response('Pedido não encontrado', { status: 400 });

    const protectedOrder = orderNsu.startsWith(FIRST_PURCHASE_ORDER_PREFIX);
    if (!isFirstPurchaseStorageConfigured()) {
      // Compras comuns continuam funcionando mesmo sem o armazenamento opcional.
      if (!protectedOrder) return new Response('OK', { status: 200 });
      return new Response('Storage unavailable', { status: 503 });
    }

    const purchaseOrder = await getFirstPurchaseOrder(orderNsu);
    if (!purchaseOrder) {
      // Um pedido comum antigo pode ter sido criado antes do histórico de compras.
      if (!protectedOrder) return new Response('OK', { status: 200 });
      console.error('First purchase order not found for webhook:', { orderNsu });
      return new Response('Pedido de primeira compra não encontrado', { status: 503 });
    }

    const transactionNsu = String(data?.transaction_nsu || '').trim();
    const invoiceSlug = String(data?.invoice_slug || data?.slug || '').trim();
    if (!transactionNsu || !invoiceSlug) {
      console.error('InfinitePay webhook missing verification fields:', { orderNsu });
      return new Response('Webhook incompleto', { status: 400 });
    }

    const verificationResponse = await fetch('https://api.checkout.infinitepay.io/payment_check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        handle: INFINITEPAY_HANDLE,
        order_nsu: orderNsu,
        transaction_nsu: transactionNsu,
        slug: invoiceSlug,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    const verification = await verificationResponse.json().catch(() => ({}));

    if (!verificationResponse.ok) {
      console.error('InfinitePay payment verification service error:', { orderNsu, status: verificationResponse.status });
      return new Response('Não foi possível verificar o pagamento', { status: 503 });
    }
    if (verification?.success !== true || verification?.paid !== true) {
      console.error('InfinitePay payment not confirmed:', { orderNsu, success: verification?.success, paid: verification?.paid });
      return new Response('Pagamento ainda não confirmado', { status: 503 });
    }

    const verifiedAmount = Number(verification?.amount);
    if (!Number.isFinite(verifiedAmount) || verifiedAmount !== purchaseOrder.expectedAmountCents) {
      console.error('InfinitePay amount mismatch:', { orderNsu, expected: purchaseOrder.expectedAmountCents, received: verification?.amount });
      return new Response('Valor do pagamento divergente', { status: 422 });
    }

    const webhookAmount = data?.amount == null ? null : Number(data.amount);
    if (webhookAmount != null && Number.isFinite(webhookAmount) && webhookAmount !== purchaseOrder.expectedAmountCents) {
      console.error('InfinitePay webhook amount mismatch:', { orderNsu, expected: purchaseOrder.expectedAmountCents, received: webhookAmount });
      return new Response('Valor do webhook divergente', { status: 422 });
    }

    // A partir da confirmação, e-mail + telefone + CPF/CNPJ ficam registrados como
    // cliente que já realizou uma compra, independentemente de ter usado cupom.
    await markFirstPurchaseAsPaid(orderNsu);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Invalid InfinitePay webhook:', error);
    const message = error instanceof Error ? error.message : '';
    if (message === 'FIRST_PURCHASE_STORAGE_NOT_CONFIGURED') return new Response('Storage unavailable', { status: 503 });
    if (message.toLowerCase().includes('timeout') || message.toLowerCase().includes('aborted')) return new Response('Verification timeout', { status: 504 });
    return new Response('Webhook error', { status: 500 });
  }
}
