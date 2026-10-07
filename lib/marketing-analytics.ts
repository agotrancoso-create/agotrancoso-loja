'use client';

import { CONSENT_EVENT, readPrivacyConsent } from './privacy-consent';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _learnq?: Array<unknown>;
  }
}

const configuredGa4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';
const GA4_ID = /^G-[A-Z0-9]+$/.test(configuredGa4) ? configuredGa4 : '';

export type MarketingItem = {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category?: string;
  item_list_name?: string;
};

function pushDataLayer(event: string, ecommerce?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...(ecommerce ? { ecommerce } : {}) });
}

function metaPayload(ecommerce?: Record<string, unknown>) {
  const payload = ecommerce || {};
  const items = Array.isArray(payload.items) ? payload.items as Array<Record<string, unknown>> : [];
  return {
    payload,
    items,
    contents: items.map((item) => ({ id: item.item_id, quantity: item.quantity, item_price: item.price })),
  };
}

function buildRecoveryUrl(items: MarketingItem[]): string | undefined {
  if (typeof window === 'undefined' || !items.length) return undefined;
  const tokens = items.flatMap((item) => {
    const productId = String(item.item_id || '').trim();
    const quantity = Number(item.quantity);
    if (!/^[a-z0-9-]+$/.test(productId) || !Number.isInteger(quantity) || quantity < 1) return [];
    return [`${productId}:${Math.min(99, quantity)}`];
  });
  if (!tokens.length) return undefined;
  const url = new URL('/checkout', window.location.origin);
  url.searchParams.set('retomar', tokens.join(','));
  return url.toString();
}

function klaviyoTrack(event: string, ecommerce?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window._learnq = window._learnq || [];
  const { payload, items } = metaPayload(ecommerce);
  const eventNames: Record<string, string> = {
    view_item: 'Viewed Product',
    add_to_cart: 'Added to Cart',
    remove_from_cart: 'Removed from Cart',
    view_cart: 'Viewed Cart',
    begin_checkout: 'Started Checkout',
    add_shipping_info: 'Added Shipping Info',
    add_payment_info: 'Added Payment Info',
    purchase: 'Placed Order',
  };
  const mapped = eventNames[event];
  if (!mapped) return;
  window._learnq.push(['track', mapped, {
    Value: payload.value,
    Currency: payload.currency || 'BRL',
    TransactionID: payload.transaction_id,
    Coupon: payload.coupon,
    Shipping: payload.shipping,
    ShippingTier: payload.shipping_tier,
    PaymentType: payload.payment_type,
    RecoveryURL: payload.recovery_url,
    Items: items.map((item) => ({
      ProductID: item.item_id,
      ProductName: item.item_name,
      Price: item.price,
      Quantity: item.quantity,
      Category: item.item_category,
    })),
  }]);
}

function track(event: string, ecommerce?: Record<string, unknown>) {
  pushDataLayer(event, ecommerce);
  if (typeof window === 'undefined' || readPrivacyConsent() !== 'all') return;

  // Ecommerce/CRO events are sent explicitly to GA4 only. Google Ads purchase
  // conversions require their own conversion action label and must not be
  // inferred from a generic event sent to the AW destination.
  if (GA4_ID && typeof window.gtag === 'function') {
    window.gtag('event', event, { ...(ecommerce || {}), send_to: GA4_ID });
  }
  klaviyoTrack(event, ecommerce);

  if (typeof window.fbq === 'function') {
    const { payload, items, contents } = metaPayload(ecommerce);
    const shared = {
      content_ids: items.map((item) => item.item_id),
      content_type: 'product',
      contents,
      value: payload.value,
      currency: payload.currency || 'BRL',
    };

    if (event === 'view_item') window.fbq('track', 'ViewContent', shared);
    else if (event === 'add_to_cart') window.fbq('track', 'AddToCart', shared);
    else if (event === 'begin_checkout') window.fbq('track', 'InitiateCheckout', { ...shared, num_items: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0) });
    else if (event === 'purchase') window.fbq('track', 'Purchase', shared, { eventID: String(payload.transaction_id || '') });
    else if (event === 'contact') window.fbq('track', 'Contact', payload);
  }
}

function money(value: number) { return Number(value.toFixed(2)); }

/** Identifica o cliente no CRM sem inscrevê-lo automaticamente em marketing. */
export function identifyCRM(input: { email: string; phone?: string; firstName?: string }) {
  if (typeof window === 'undefined' || !input.email) return;
  window._learnq = window._learnq || [];
  window._learnq.push(['identify', {
    $email: input.email.trim().toLowerCase(),
    ...(input.phone ? { $phone_number: input.phone } : {}),
    ...(input.firstName ? { $first_name: input.firstName.trim().split(/\s+/)[0] } : {}),
  }]);
}

export function trackViewItem(item: MarketingItem) {
  track('view_item', { currency: 'BRL', value: money(item.price * item.quantity), items: [item] });
}
export function trackViewItemList(items: MarketingItem[], listName: string) {
  track('view_item_list', { item_list_name: listName, items: items.map((item) => ({ ...item, item_list_name: listName })) });
}
export function trackSelectItem(item: MarketingItem, listName: string) {
  track('select_item', { item_list_name: listName, items: [{ ...item, item_list_name: listName }] });
}
export function trackAddToCart(item: MarketingItem) {
  track('add_to_cart', { currency: 'BRL', value: money(item.price * item.quantity), items: [item] });
}
export function trackRemoveFromCart(item: MarketingItem) {
  track('remove_from_cart', { currency: 'BRL', value: money(item.price * item.quantity), items: [item] });
}
export function trackViewCart(items: MarketingItem[], value: number) {
  track('view_cart', { currency: 'BRL', value: money(value), items });
}
export function trackBeginCheckout(items: MarketingItem[], value: number) {
  track('begin_checkout', {
    currency: 'BRL',
    value: money(value),
    recovery_url: buildRecoveryUrl(items),
    items,
  });
}
export function trackAddShippingInfo(items: MarketingItem[], value: number, shippingTier: string) {
  track('add_shipping_info', { currency: 'BRL', value: money(value), shipping_tier: shippingTier, items });
}
export function trackAddPaymentInfo(items: MarketingItem[], value: number, paymentType = 'InfinitePay') {
  track('add_payment_info', { currency: 'BRL', value: money(value), payment_type: paymentType, items });
}
type PurchaseInput = { transactionId: string; items?: MarketingItem[]; value: number; shipping?: number; coupon?: string };
const pendingPurchases = new Map<string, PurchaseInput>();
const recordedPurchases = new Set<string>();
let purchaseConsentListener = false;

function recordOnce(key: string, send: () => void) {
  if (recordedPurchases.has(key)) return;
  try { if (window.localStorage.getItem(key) === '1') return; } catch {}
  send();
  recordedPurchases.add(key);
  try { window.localStorage.setItem(key, '1'); } catch {}
}

/** Call only with an authoritative receipt returned by verify-payment. */
export function trackPurchase(input: PurchaseInput) {
  if (typeof window === 'undefined') return;
  const transactionId = input.transactionId.trim();
  if (!/^AGO-/.test(transactionId) || !Number.isFinite(input.value) || input.value <= 0) return;
  const payload = {
    transaction_id: transactionId,
    currency: 'BRL',
    value: money(input.value),
    ...(input.shipping != null && Number.isFinite(input.shipping) && input.shipping >= 0 ? { shipping: money(input.shipping) } : {}),
    ...(input.coupon ? { coupon: input.coupon } : {}),
    ...(input.items?.length ? { items: input.items } : {}),
  };

  // A local diagnostic is distinct from delivery to a configured destination.
  // Refusing consent must never permanently mark an unsent GA4 purchase as sent.
  recordOnce(`ago_purchase_tracked_v2_${transactionId}`, () => pushDataLayer('purchase', payload));
  if (readPrivacyConsent() !== 'all') {
    pendingPurchases.set(transactionId, input);
    if (!purchaseConsentListener) {
      purchaseConsentListener = true;
      window.addEventListener(CONSENT_EVENT, () => {
        if (readPrivacyConsent() === 'all') {
          for (const purchase of pendingPurchases.values()) trackPurchase(purchase);
        }
      });
    }
    return;
  }
  pendingPurchases.delete(transactionId);
  if (GA4_ID && typeof window.gtag === 'function') {
    recordOnce(`ago_purchase_ga4_v1_${GA4_ID}_${transactionId}`, () => {
      window.gtag!('event', 'purchase', { ...payload, send_to: GA4_ID });
    });
  }
  if (typeof window.fbq === 'function') {
    recordOnce(`ago_purchase_meta_v1_${transactionId}`, () => {
      const { items, contents } = metaPayload(payload);
      window.fbq!('track', 'Purchase', { content_ids: items.map(item => item.item_id), content_type: 'product', contents, value: payload.value, currency: 'BRL' }, { eventID: transactionId });
    });
  }
  recordOnce(`ago_purchase_crm_v1_${transactionId}`, () => klaviyoTrack('purchase', payload));
}
export function trackContact(method: string) { track('contact', { method }); }
export function trackProductInteraction(action: 'quick_view' | 'save_product' | 'unsave_product' | 'share_product', item: MarketingItem) {
  track(action, { currency: 'BRL', value: money(item.price * item.quantity), items: [item] });
}

/** Eventos de comportamento para CRO. Não são conversões e não alimentam Meta/Klaviyo. */
export function trackCatalogSearch(searchTerm: string, resultCount: number) {
  const term = searchTerm.trim();
  if (!term) return;
  track('search', { search_term: term, result_count: resultCount });
}

export function trackCatalogFilter(filterName: string, filterValue: string, resultCount: number) {
  track('catalog_filter', { filter_name: filterName, filter_value: filterValue, result_count: resultCount });
}

export function trackCatalogSort(sortValue: string, resultCount: number) {
  track('catalog_sort', { sort_value: sortValue, result_count: resultCount });
}

export function trackGalleryInteraction(input: {
  productId: string;
  action: 'open' | 'next' | 'previous' | 'thumbnail' | 'zoom_in' | 'zoom_out' | 'fit';
  photoIndex: number;
  totalPhotos: number;
  scale?: number;
}) {
  track('product_gallery_interaction', {
    product_id: input.productId,
    gallery_action: input.action,
    photo_index: input.photoIndex,
    total_photos: input.totalPhotos,
    ...(input.scale != null ? { zoom_scale: Number(input.scale.toFixed(2)) } : {}),
  });
}
