export const FIRST_PURCHASE_COUPON = 'AGO3';
export const FIRST_PURCHASE_DISCOUNT_RATE = 0.03;

export function normalizeCoupon(code: unknown) {
  return String(code ?? '').trim().toUpperCase();
}

export function isFirstPurchaseCoupon(code: unknown) {
  return normalizeCoupon(code) === FIRST_PURCHASE_COUPON;
}

export function calculateCouponDiscount(subtotal: number, code: unknown) {
  if (!isFirstPurchaseCoupon(code)) return 0;
  return Number((subtotal * FIRST_PURCHASE_DISCOUNT_RATE).toFixed(2));
}
