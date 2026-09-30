export const FREE_SHIPPING_THRESHOLD = 500;
export const FIXED_SHIPPING_PRICE = 39.9;
export const FREE_SHIPPING_SUBTOTAL_MINIMUM = Number((FREE_SHIPPING_THRESHOLD - FIXED_SHIPPING_PRICE).toFixed(2));

const FREE_SHIPPING_THRESHOLD_CENTS = Math.round(FREE_SHIPPING_THRESHOLD * 100);
const FIXED_SHIPPING_PRICE_CENTS = Math.round(FIXED_SHIPPING_PRICE * 100);

/**
 * Regra comercial única da Agô: se subtotal + frete fixo chegaria a R$ 500,00
 * ou mais, o frete é zerado. Ex.: R$ 480,00 + R$ 39,90 = R$ 519,90,
 * portanto o cliente paga R$ 480,00 com frete grátis.
 */
export function shouldOfferFreeShipping(subtotal: number): boolean {
  const subtotalCents = Math.round(Number(subtotal) * 100);
  if (!Number.isFinite(subtotalCents)) return false;
  return subtotalCents + FIXED_SHIPPING_PRICE_CENTS >= FREE_SHIPPING_THRESHOLD_CENTS;
}

export function getShippingPrice(subtotal: number): number {
  return shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
}
