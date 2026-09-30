export const FREE_SHIPPING_THRESHOLD = 500;
export const FIXED_SHIPPING_PRICE = 39.9;
export const FREE_SHIPPING_SUBTOTAL_MINIMUM = 460.10;

const FREE_SHIPPING_SUBTOTAL_MINIMUM_CENTS = 46010;

/**
 * Regra comercial única da Agô:
 * o frete fixo é R$ 39,90 e o benefício entra quando o total potencial
 * (produtos + frete) chegaria a R$ 500,00. Isso equivale a R$ 460,10
 * ou mais em produtos. Ex.: R$ 480,00 em produtos => frete grátis.
 *
 * A comparação é feita somente em centavos para não depender de ponto flutuante.
 */
export function shouldOfferFreeShipping(subtotal: number): boolean {
  const subtotalCents = Math.round(Number(subtotal) * 100);
  if (!Number.isFinite(subtotalCents)) return false;
  return subtotalCents >= FREE_SHIPPING_SUBTOTAL_MINIMUM_CENTS;
}

export function getShippingPrice(subtotal: number): number {
  return shouldOfferFreeShipping(subtotal) ? 0 : FIXED_SHIPPING_PRICE;
}
