export const FREE_SHIPPING_THRESHOLD = 500;
export const FIXED_SHIPPING_PRICE = 39.9;

export function shouldOfferFreeShipping(subtotal: number): boolean {
  const subtotalCents = Math.round(Number(subtotal) * 100);
  return Number.isFinite(subtotalCents) && subtotalCents > FREE_SHIPPING_THRESHOLD * 100;
}

export function getShippingPrice(subtotal: number): number {
  return shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
}
