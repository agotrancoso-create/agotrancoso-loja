import { NextResponse } from 'next/server';
import { calculateCartTotals, getEffectivePrice, getProductById } from '@/lib/products';
import { getInternationalShippingQuote } from '@/lib/international-shipping';
import { getInternationalCountry } from '@/lib/international-countries';
import { createStripeCheckoutSession, isStripeConfigured } from '@/lib/stripe-server';
import { SITE_DOMAIN } from '@/lib/config';
import type { CartItem } from '@/lib/types';

function absoluteImage(path: string | undefined) {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_DOMAIN}${path.startsWith('/') ? path : `/${path}`}`;
}

function cleanEmail(value: unknown) {
  const email = String(value ?? '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

export async function POST(req: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json({ error: 'O pagamento internacional online ainda está sendo ativado.' }, { status: 503 });
    }

    const body = await req.json();
    const items = (Array.isArray(body.items) ? body.items : []) as CartItem[];
    const countryCode = String(body.countryCode || '').trim().toUpperCase();
    const postalCode = String(body.postalCode || '').trim();
    const requestedServiceCode = String(body.serviceCode || '').trim();
    const english = body.english === true;
    const email = cleanEmail(body.email);

    const country = getInternationalCountry(countryCode);
    if (!country || countryCode === 'BR') {
      return NextResponse.json({ error: english ? 'Choose a valid international destination.' : 'Escolha um destino internacional válido.' }, { status: 400 });
    }

    const totals = calculateCartTotals(items);
    if (!items.length || !totals.valid) {
      return NextResponse.json({ error: english ? 'Your bag could not be validated.' : 'Não foi possível validar sua sacola.' }, { status: 400 });
    }

    const quote = await getInternationalShippingQuote({ countryCode, postalCode, items });
    if (!quote.available || !quote.options.length) {
      return NextResponse.json({ error: english ? 'This order needs a confirmed international shipping quote before payment.' : 'Este pedido precisa de uma cotação internacional confirmada antes do pagamento.' }, { status: 422 });
    }

    const shipping = quote.options.find(option => option.serviceCode === requestedServiceCode) ?? quote.options[0];
    if (!shipping) {
      return NextResponse.json({ error: english ? 'The selected shipping option is no longer available.' : 'A opção de frete selecionada não está mais disponível.' }, { status: 409 });
    }

    const checkoutLines = items.map((item) => {
      const product = getProductById(item.productId);
      const quantity = Number(item.quantity);
      if (!product || !product.available || !Number.isInteger(quantity) || quantity < 1) throw new Error(`Produto indisponível: ${item.productId}`);
      const unitAmount = Math.round(getEffectivePrice(product) * 100);
      if (unitAmount < 1) throw new Error(`Preço inválido: ${item.productId}`);
      return { product, quantity, unitAmount };
    });

    const orderId = `AGO-INT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_DOMAIN).replace(/\/$/, '');
    const localePrefix = english ? '/en' : '';
    const shippingAmount = Math.round(shipping.price * 100);

    const lineItems = checkoutLines.map(({ product, quantity, unitAmount }) => ({
      price_data: {
        currency: 'brl',
        unit_amount: unitAmount,
        product_data: {
          name: product.name,
          description: product.description.slice(0, 500),
          ...(absoluteImage(product.images?.[0]) ? { images: [absoluteImage(product.images?.[0])!] } : {}),
          metadata: { ago_product_id: product.id },
        },
      },
      quantity,
    }));

    const shippingRateData: Record<string, unknown> = {
      type: 'fixed_amount',
      display_name: `${shipping.carrier} · ${shipping.name}`.slice(0, 100),
      fixed_amount: { amount: shippingAmount, currency: 'brl' },
      metadata: { service_code: shipping.serviceCode },
    };
    if (shipping.deadlineDays) {
      shippingRateData.delivery_estimate = {
        minimum: { unit: 'business_day', value: shipping.deadlineDays },
        maximum: { unit: 'business_day', value: shipping.deadlineDays },
      };
    }

    const session = await createStripeCheckoutSession({
      mode: 'payment',
      client_reference_id: orderId,
      ...(email ? { customer_email: email } : {}),
      customer_creation: 'always',
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: [countryCode] },
      phone_number_collection: { enabled: true },
      line_items: lineItems,
      shipping_options: [{ shipping_rate_data: shippingRateData }],
      adaptive_pricing: { enabled: true },
      automatic_tax: { enabled: false },
      after_expiration: { recovery: { enabled: true } },
      success_url: `${siteUrl}${localePrefix}/confirmacao-stripe?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${localePrefix}/envio-internacional?pagamento=cancelado`,
      locale: 'auto',
      submit_type: 'pay',
      branding_settings: {
        background_color: '#FAF3E8',
        button_color: '#8E432C',
        border_style: 'rounded',
        font_family: 'lora',
        display_name: 'Agô Trancoso',
        logo: { type: 'url', url: `${SITE_DOMAIN}/logo.png` },
        icon: { type: 'url', url: `${SITE_DOMAIN}/logo.png` },
      },
      custom_text: {
        shipping_address: {
          message: english
            ? 'A fixed international shipping rate for this destination region is included in your order. Import duties or local taxes, when applicable, may be charged by destination authorities.'
            : 'Uma tarifa fixa de envio internacional para esta região está incluída no pedido. Tributos ou taxas locais de importação, quando aplicáveis, podem ser cobrados pelas autoridades do país de destino.',
        },
      },
      metadata: {
        ago_order_id: orderId,
        ago_channel: 'international',
        destination_country: countryCode,
        shipping_service_code: shipping.serviceCode,
        shipping_brl_cents: String(shippingAmount),
      },
      payment_intent_data: {
        metadata: {
          ago_order_id: orderId,
          ago_channel: 'international',
          destination_country: countryCode,
          shipping_service_code: shipping.serviceCode,
        },
      },
    });

    if (!session?.url || !session?.id) throw new Error('Stripe não retornou uma sessão de pagamento válida.');

    return NextResponse.json({
      orderId,
      sessionId: session.id,
      checkoutUrl: session.url,
      shipping,
      subtotal: Number(totals.total.toFixed(2)),
      total: Number((totals.total + shipping.price).toFixed(2)),
    });
  } catch (error) {
    console.error('Stripe international checkout error:', error);
    const message = error instanceof Error ? error.message : '';
    if (message === 'STRIPE_NOT_CONFIGURED') return NextResponse.json({ error: 'O pagamento internacional online ainda está sendo ativado.' }, { status: 503 });
    return NextResponse.json({ error: 'Não foi possível iniciar o pagamento internacional. Tente novamente.' }, { status: 500 });
  }
}
