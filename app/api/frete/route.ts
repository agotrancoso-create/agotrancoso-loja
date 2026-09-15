import { NextResponse } from 'next/server';
import { calculateCartTotals } from '@/lib/products';
import { getShippingPrice, shouldOfferFreeShipping, FIXED_SHIPPING_PRICE } from '@/lib/shipping';
import type { CartItem } from '@/lib/types';

function cleanCep(value: unknown) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 8);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const destinationCep = cleanCep(body.cep);
    const items = (Array.isArray(body.items) ? body.items : []) as CartItem[];

    if (destinationCep.length !== 8) {
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

    return NextResponse.json({
      configured: true,
      available: true,
      freeShipping,
      options: [{
        name: freeShipping ? 'Frete grátis' : 'Frete fixo',
        price: getShippingPrice(subtotal),
        deadline: null,
        serviceId: freeShipping ? 'free' : 'fixed',
      }],
      provider: 'Agô Trancoso',
      fixedPrice: FIXED_SHIPPING_PRICE,
      destinationCep,
    });
  } catch (error) {
    console.error('Frete calculation error:', error);
    return NextResponse.json({ configured: true, available: false, error: 'Não foi possível calcular o frete agora.' }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({
    provider: 'Agô Trancoso',
    fixedPrice: FIXED_SHIPPING_PRICE,
    freeShippingAbove: 500,
    configured: true,
  });
}
