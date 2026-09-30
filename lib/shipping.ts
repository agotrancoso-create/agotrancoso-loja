export const FREE_SHIPPING_THRESHOLD = 500;
export const FIXED_SHIPPING_PRICE = 39.9;
export const FREE_SHIPPING_SUBTOTAL_MINIMUM = 500.01;

const FREE_SHIPPING_THRESHOLD_CENTS = Math.round(FREE_SHIPPING_THRESHOLD * 100);

/**
 * Regra comercial única da Agô: o frete grátis depende somente do subtotal
 * dos produtos. R$ 500,00 ainda recebe o frete fixo; R$ 500,01 ou mais recebe
 * frete grátis. O valor do próprio frete nunca entra no cálculo do benefício.
 */
export function shouldOfferFreeShipping(subtotal: number): boolean {
  const subtotalCents = Math.round(Number(subtotal) * 100);
  if (!Number.isFinite(subtotalCents)) return false;
  return subtotalCents > FREE_SHIPPING_THRESHOLD_CENTS;
}

export function getShippingPrice(subtotal: number): number {
  return shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
}
