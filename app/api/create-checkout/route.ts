import { NextResponse } from 'next/server';
import { getProductById, getEffectivePrice, calculateCartTotals } from '@/lib/products';
import { getShippingPrice, shouldOfferFreeShipping, FIXED_SHIPPING_PRICE } from '@/lib/shipping';
import { SITE_DOMAIN } from '@/lib/config';
import type { CartItem } from '@/lib/types';

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'ago-trancoso';

type CheckoutItem = { id: string; name: string; price: number; quantity: number };

function cleanCep(value: unknown) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 8);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = (Array.isArray(body.items) ? body.items : []) as CartItem[];
    const customer = body.customer ?? {};
    const address = customer.address ?? {};

    if (!items.length) return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 });

    const totals = calculateCartTotals(items);
    if (!totals.valid) {
      return NextResponse.json({ error: totals.errors[0] || 'Não foi possível validar o carrinho.' }, { status: 400 });
    }

    const checkoutItems: CheckoutItem[] = items.map((item) => {
      const product = getProductById(item.productId);
      const quantity = Number(item.quantity);
      if (!product || !product.available) throw new Error(`Produto indisponível: ${item.productId}`);
      return { id: product.id, name: product.name, price: getEffectivePrice(product), quantity };
    });

    const subtotal = totals.total;
    const shippingValue = shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
    const shippingName = shippingValue === 0 ? 'Frete grátis' : 'Frete fixo';

    if (shippingValue !== getShippingPrice(subtotal)) {
      return NextResponse.json({ error: 'Não foi possível validar o frete. Tente novamente.' }, { status: 422 });
    }

    const destinationCep = cleanCep(address.zip);
    if (destinationCep.length !== 8) {
      return NextResponse.json({ error: 'Informe um CEP válido para a entrega.' }, { status: 400 });
    }

    if (shippingValue > 0) {
      checkoutItems.push({ id: 'frete', name: `${shippingName} R$ ${shippingValue.toFixed(2).replace('.', ',')}`, price: shippingValue, quantity: 1 });
    }

    const orderNsu = `AGO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_DOMAIN).replace(/\/$/, '');

    const payload = {
      handle: INFINITEPAY_HANDLE,
      items: checkoutItems.map((item) => ({
        quantity: item.quantity,
        price: Math.round(item.price * 100),
        description: item.name,
      })),
      order_nsu: orderNsu,
      redirect_url: `${siteUrl}/confirmacao?pedido=${encodeURIComponent(orderNsu)}`,
      webhook_url: `${siteUrl}/api/webhooks/infinitepay`,
      customer: {
        name: customer.name || undefined,
        email: customer.email || undefined,
        phone_number: customer.phone || undefined,
      },
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement || undefined,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        cep: destinationCep,
      },
    };

    const response = await fetch('https://api.checkout.infinitepay.io/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) {
      console.error('InfinitePay checkout error:', { status: response.status, data });
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: 'O Checkout Integrado da InfinitePay não está habilitado ou a InfiniteTag configurada não tem acesso ao checkout.' }, { status: 502 });
      }
      const detail = typeof data?.message === 'string' ? data.message : typeof data?.error === 'string' ? data.error : '';
      return NextResponse.json({ error: detail ? `A InfinitePay recusou a criação do pagamento: ${detail}` : 'Não foi possível iniciar o pagamento pela InfinitePay. Tente novamente.' }, { status: 502 });
    }

    return NextResponse.json({ orderId: orderNsu, checkoutUrl: data.url });
  } catch (error) {
    console.error('Checkout preparation error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message.toLowerCase().includes('timeout') || message.toLowerCase().includes('aborted')) {
      return NextResponse.json({ error: 'A InfinitePay demorou para responder. Tente novamente em alguns segundos.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Não foi possível preparar o pagamento. Tente novamente ou fale conosco pelo WhatsApp.' }, { status: 500 });
  }
}
