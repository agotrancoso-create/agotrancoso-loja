export const FREE_SHIPPING_THRESHOLD = 500;
export const FIXED_SHIPPING_PRICE = 39.9;

const FREE_SHIPPING_THRESHOLD_CENTS = Math.round(FREE_SHIPPING_THRESHOLD * 100);
const FIXED_SHIPPING_PRICE_CENTS = Math.round(FIXED_SHIPPING_PRICE * 100);

/**
 * A regra comercial considera o total que o pedido teria com o frete fixo.
 * Se subtotal dos produtos + R$ 39,90 ultrapassar R$ 500, o frete vira grátis.
 * Ex.: R$ 480,00 + R$ 39,90 = R$ 519,90 -> frete grátis.
 */
export function shouldOfferFreeShipping(subtotal: number): boolean {
  const subtotalCents = Math.round(Number(subtotal) * 100);
  if (!Number.isFinite(subtotalCents)) return false;
  return subtotalCents + FIXED_SHIPPING_PRICE_CENTS > FREE_SHIPPING_THRESHOLD_CENTS;
}

export function getShippingPrice(subtotal: number): number {
  return shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
}
