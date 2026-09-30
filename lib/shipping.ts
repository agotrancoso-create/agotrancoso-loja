export const FREE_SHIPPING_THRESHOLD = 500;
export const FIXED_SHIPPING_PRICE = 39.9;
export const FREE_SHIPPING_SUBTOTAL_MINIMUM = FREE_SHIPPING_THRESHOLD;

const FREE_SHIPPING_SUBTOTAL_MINIMUM_CENTS = Math.round(FREE_SHIPPING_THRESHOLD * 100);

/**
 * Frete grátis a partir de R$ 500,00 em produtos, antes de cupons.
 * O frete não entra no cálculo do benefício: R$ 480,00 paga R$ 39,90.
 * Comparamos centavos para manter a mesma regra no catálogo e no pagamento.
 */
export function shouldOfferFreeShipping(subtotal: number): boolean {
  const subtotalCents = Math.round(Number(subtotal) * 100);
  if (!Number.isFinite(subtotalCents)) return false;
  return subtotalCents >= FREE_SHIPPING_SUBTOTAL_MINIMUM_CENTS;
}

export function getShippingPrice(subtotal: number): number {
  return shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
}
