import { NextResponse } from 'next/server';
import { getShipFromCep, getShippingDeadlineProviderState } from '@/lib/shipping-deadline';
import { getNationalShippingQuote } from '@/lib/national-shipping';
import { FIXED_SHIPPING_PRICE } from '@/lib/shipping';
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

    const quote = await getNationalShippingQuote({ destinationCep, items });

    if (!quote.available || !quote.options.length) {
      const message = quote.reason === 'invalid_destination'
        ? 'Informe um CEP válido com 8 dígitos.'
        : quote.reason === 'invalid_cart'
          ? 'Não foi possível validar sua sacola.'
          : 'Não foi possível calcular o frete agora.';
      return NextResponse.json({ ...quote, error: message }, { status: quote.reason === 'invalid_destination' || quote.reason === 'invalid_cart' ? 400 : 502 });
    }

    return NextResponse.json({
      ...quote,
      provider: quote.options[0].provider,
      fixedPriceFallback: FIXED_SHIPPING_PRICE,
      originCep: formatCep(quote.originCep),
    });
  } catch (error) {
    console.error('Frete calculation error:', error);
    return NextResponse.json({ configured: false, available: false, error: 'Não foi possível calcular o frete agora.' }, { status: 502 });
  }
}

export async function GET() {
  const state = getShippingDeadlineProviderState();
  return NextResponse.json({
    provider: state.frenetConfigured ? 'Frenet + Correios' : 'Agô Trancoso',
    configured: true,
    frenetConfigured: state.frenetConfigured,
    fixedPriceFallback: FIXED_SHIPPING_PRICE,
    originCep: formatCep(getShipFromCep()),
    strategy: state.frenetConfigured
      ? 'Menor tarifa válida dos Correios retornada pela Frenet; fallback fixo somente se a cotação real não puder ser calculada.'
      : 'Frete fixo de segurança até a Frenet ser conectada ao checkout.',
  });
}
