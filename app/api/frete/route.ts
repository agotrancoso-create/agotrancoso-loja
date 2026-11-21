import { NextResponse } from 'next/server';
import { calculateCartTotals } from '@/lib/products';
import { getShippingPrice, shouldOfferFreeShipping, FIXED_SHIPPING_PRICE } from '@/lib/shipping';
import { getShipFromCep, getShippingDeadlineProviderState, getShippingDeadlineQuote } from '@/lib/shipping-deadline';
import type { CartItem } from '@/lib/types';

function cleanCep(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

function formatCep(value: string) {
  return value.length === 8 ? `${value.slice(0, 5)}-${value.slice(5)}` : value;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const destinationCep = cleanCep(body.cep);
    const items = (Array.isArray(body.items) ? body.items : []) as CartItem[];

    if (destinationCep.length !== 8 || /^(\d)\1{7}$/.test(destinationCep)) {
      return NextResponse.json({ configured: true, available: false, error: 'Informe um CEP válido com 8 dígitos.' }, { status: 400 });
    }
    if (!items.length) {
      return NextResponse.json({ configured: true, available: false, error: 'Seu carrinho está vazio.' }, { status: 400 });
    }

    const totals = calculateCartTotals(items);
    if (!totals.valid) {
      return NextResponse.json({ configured: true, available: false, error: totals.errors[0] || 'Não foi possível validar o carrinho.' }, { status: 400 });
    }

    const subtotal = totals.total;
    const freeShipping = shouldOfferFreeShipping(subtotal);
    const deadlineQuote = await getShippingDeadlineQuote({ destinationCep, subtotal });

    return NextResponse.json({
      configured: true,
      available: true,
      freeShipping,
      options: [{
        name: freeShipping ? 'Frete grátis' : 'Frete fixo',
        price: getShippingPrice(subtotal),
        deadline: deadlineQuote?.deadline ?? null,
        serviceId: deadlineQuote?.serviceId || (freeShipping ? 'free' : 'fixed'),
        serviceName: deadlineQuote?.serviceName ?? null,
        estimated: deadlineQuote?.estimated === true,
      }],
      provider: deadlineQuote?.provider ?? 'Agô Trancoso',
      fixedPrice: FIXED_SHIPPING_PRICE,
      destinationCep,
      originCep: formatCep(getShipFromCep()),
    });
  } catch (error) {
    console.error('Frete calculation error:', error);
    return NextResponse.json({ configured: true, available: false, error: 'Não foi possível calcular o frete agora.' }, { status: 502 });
  }
}

export async function GET() {
  const state = getShippingDeadlineProviderState();
  return NextResponse.json({
    provider: state.provider ? `Agô Trancoso + ${state.provider} (prazo)` : 'Agô Trancoso',
    fixedPrice: FIXED_SHIPPING_PRICE,
    freeShippingAbove: 500,
    configured: true,
    deadlineConfigured: state.configured,
    correiosConfigured: state.correiosConfigured,
    frenetConfigured: state.frenetConfigured,
    originCep: formatCep(state.originCep),
  });
}
