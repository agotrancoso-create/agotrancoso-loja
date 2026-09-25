import { NextResponse } from 'next/server';
import { getProductById, getEffectivePrice, calculateCartTotals } from '@/lib/products';
import { calculateCouponDiscount, isFirstPurchaseCoupon, normalizeCoupon } from '@/lib/coupons';
import { getShippingPrice, shouldOfferFreeShipping, FIXED_SHIPPING_PRICE } from '@/lib/shipping';
import { SITE_DOMAIN } from '@/lib/config';
import { releaseFirstPurchaseReservation, reserveFirstPurchaseIdentity } from '@/lib/first-purchase';
import type { CartItem } from '@/lib/types';

const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'ago-trancoso';
type CheckoutUnit = { id: string; name: string; price: number; quantity: number };

function cleanCep(value: unknown) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 8);
}

function cleanPhone(value: unknown) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return '+55' + digits;
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return '+' + digits;
  return '';
}

function buildDiscountedUnits(
  lines: { id: string; name: string; unitPrice: number; quantity: number; subtotal: number }[],
  discount: number,
) {
  const units: { id: string; name: string; originalCents: number; exactDiscount: number; discountCents: number }[] = [];
  const totalCents = Math.round(lines.reduce((sum, line) => sum + line.subtotal, 0) * 100);
  const discountCents = Math.round(discount * 100);

  for (const line of lines) {
    const unitCents = Math.round(line.unitPrice * 100);
    for (let index = 0; index < line.quantity; index += 1) {
      const exactDiscount = totalCents > 0 ? (discountCents * unitCents) / totalCents : 0;
      units.push({
        id: line.id,
        name: line.name,
        originalCents: unitCents,
        exactDiscount,
        discountCents: Math.floor(exactDiscount),
      });
    }
  }

  let assigned = units.reduce((sum, unit) => sum + unit.discountCents, 0);
  const remaining = Math.max(0, discountCents - assigned);
  units
    .sort((a, b) => (b.exactDiscount - Math.floor(b.exactDiscount)) - (a.exactDiscount - Math.floor(a.exactDiscount)))
    .slice(0, remaining)
    .forEach((unit) => {
      unit.discountCents += 1;
      assigned += 1;
    });

  return units.map((unit) => ({
    id: unit.id,
    name: unit.name,
    price: Math.max(1, unit.originalCents - unit.discountCents),
    quantity: 1,
  }));
}

export async function POST(req: Request) {
  let reservedOrderNsu = '';

  try {
    const body = await req.json();
    const items = (Array.isArray(body.items) ? body.items : []) as CartItem[];
    const coupon = normalizeCoupon(body.coupon);
    const customer = body.customer ?? {};
    const address = customer.address ?? {};

    if (!items.length) return NextResponse.json({ error: 'Sua sacola está vazia.' }, { status: 400 });
    if (coupon && !isFirstPurchaseCoupon(coupon)) {
      return NextResponse.json({ error: 'Cupom não encontrado. Confira o código e tente novamente.' }, { status: 400 });
    }

    const normalizedPhone = cleanPhone(customer.phone);
    if (!customer.email || !normalizedPhone) {
      return NextResponse.json({ error: 'Informe um e-mail e telefone válidos.' }, { status: 400 });
    }

    const totals = calculateCartTotals(items);
    if (!totals.valid) {
      return NextResponse.json({ error: totals.errors[0] || 'Não foi possível validar sua sacola.' }, { status: 400 });
    }

    const checkoutLines = items.map((item) => {
      const product = getProductById(item.productId);
      const quantity = Number(item.quantity);
      if (!product || !product.available || !Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Produto indisponível: ${item.productId}`);
      }
      const unitPrice = getEffectivePrice(product);
      return {
        id: product.id,
        name: product.name,
        unitPrice,
        quantity,
        subtotal: Number((unitPrice * quantity).toFixed(2)),
      };
    });

    const subtotal = Number(totals.total.toFixed(2));
    const discount = calculateCouponDiscount(subtotal, coupon);
    const discountedUnits = buildDiscountedUnits(checkoutLines, discount);
    const discountedSubtotal = Number((subtotal - discount).toFixed(2));

    const freeShipping = shouldOfferFreeShipping(subtotal);
    const shippingValue = freeShipping ? 0 : FIXED_SHIPPING_PRICE;
    if (shippingValue !== getShippingPrice(subtotal)) {
      return NextResponse.json({ error: 'Não foi possível validar o frete. Tente novamente.' }, { status: 422 });
    }

    const destinationCep = cleanCep(address.zip);
    if (destinationCep.length !== 8) {
      return NextResponse.json({ error: 'Informe um CEP válido para a entrega.' }, { status: 400 });
    }

    const checkoutItems: CheckoutUnit[] = [...discountedUnits];
    if (shippingValue > 0) {
      checkoutItems.push({
        id: 'frete',
        name: `Frete fixo R$ ${shippingValue.toFixed(2).replace('.', ',')}`,
        price: Math.round(shippingValue * 100),
        quantity: 1,
      });
    }

    const orderNsu = `AGO-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const expectedAmountCents = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (isFirstPurchaseCoupon(coupon)) {
      const eligibility = await reserveFirstPurchaseIdentity({
        orderNsu,
        email: customer.email,
        phone: customer.phone,
        expectedAmountCents,
        discountCents: Math.round(discount * 100),
      });
      if (!eligibility.eligible) {
        return NextResponse.json({ error: eligibility.reason }, { status: 409 });
      }
      reservedOrderNsu = orderNsu;
    }

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_DOMAIN).replace(/\/$/, '');
    const payload = {
      handle: INFINITEPAY_HANDLE,
      items: checkoutItems.map((item) => ({
        quantity: item.quantity,
        price: item.price,
        description: item.name,
      })),
      order_nsu: orderNsu,
      redirect_url: `${siteUrl}/confirmacao?pedido=${encodeURIComponent(orderNsu)}`,
      webhook_url: `${siteUrl}/api/webhooks/infinitepay`,
      customer: {
        name: customer.name || undefined,
        email: customer.email || undefined,
        phone_number: normalizedPhone,
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
      if (reservedOrderNsu) {
        await releaseFirstPurchaseReservation(reservedOrderNsu).catch((releaseError) => {
          console.error('First purchase reservation release error:', releaseError);
        });
        reservedOrderNsu = '';
      }

      console.error('InfinitePay checkout error:', { status: response.status, data });
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: 'O Checkout Integrado da InfinitePay não está habilitado ou a InfiniteTag configurada não tem acesso ao checkout.' }, { status: 502 });
      }
      const detail = typeof data?.message === 'string' ? data.message : typeof data?.error === 'string' ? data.error : '';
      return NextResponse.json({
        error: detail ? `A InfinitePay recusou a criação do pagamento: ${detail}` : 'Não foi possível iniciar o pagamento pela InfinitePay. Tente novamente.',
      }, { status: 502 });
    }

    return NextResponse.json({
      orderId: orderNsu,
      checkoutUrl: data.url,
      subtotal,
      discount,
      discountedSubtotal,
      shippingValue,
      total: Number((discountedSubtotal + shippingValue).toFixed(2)),
    });
  } catch (error) {
    if (reservedOrderNsu) {
      await releaseFirstPurchaseReservation(reservedOrderNsu).catch((releaseError) => {
        console.error('First purchase reservation release error:', releaseError);
      });
    }

    console.error('Checkout preparation error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message === 'FIRST_PURCHASE_STORAGE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'O benefício de primeira compra está temporariamente indisponível. Você pode continuar sem o cupom.' }, { status: 503 });
    }
    if (message.toLowerCase().includes('timeout') || message.toLowerCase().includes('aborted')) {
      return NextResponse.json({ error: 'A InfinitePay demorou para responder. Tente novamente em alguns segundos.' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Não foi possível preparar o pagamento. Tente novamente ou fale conosco pelo WhatsApp.' }, { status: 500 });
  }
}
