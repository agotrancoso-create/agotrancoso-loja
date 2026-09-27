'use client';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

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
    contents: items.map((item) => ({
      id: item.item_id,
      quantity: item.quantity,
      item_price: item.price,
    })),
  };
}

function track(event: string, ecommerce?: Record<string, unknown>) {
  pushDataLayer(event, ecommerce);
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, ecommerce || {});
  }

  if (typeof window.fbq === 'function') {
    const { payload, items, contents } = metaPayload(ecommerce);
    const shared = {
      content_ids: items.map((item) => item.item_id),
      content_type: 'product',
      contents,
      value: payload.value,
      currency: payload.currency || 'BRL',
    };

    if (event === 'view_item') {
      window.fbq('track', 'ViewContent', shared);
    } else if (event === 'add_to_cart') {
      window.fbq('track', 'AddToCart', shared);
    } else if (event === 'begin_checkout') {
      window.fbq('track', 'InitiateCheckout', {
        ...shared,
        num_items: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      });
    } else if (event === 'purchase') {
      window.fbq('track', 'Purchase', shared, { eventID: String(payload.transaction_id || '') });
    } else if (event === 'contact') {
      window.fbq('track', 'Contact', payload);
    }
  }
}

function money(value: number) {
  return Number(value.toFixed(2));
}

export function trackViewItem(item: MarketingItem) {
  track('view_item', {
    currency: 'BRL',
    value: money(item.price * item.quantity),
    items: [item],
  });
}

export function trackViewItemList(items: MarketingItem[], listName: string) {
  track('view_item_list', {
    item_list_name: listName,
    items: items.map((item) => ({ ...item, item_list_name: listName })),
  });
}

export function trackSelectItem(item: MarketingItem, listName: string) {
  track('select_item', {
    item_list_name: listName,
    items: [{ ...item, item_list_name: listName }],
  });
}

export function trackAddToCart(item: MarketingItem) {
  track('add_to_cart', {
    currency: 'BRL',
    value: money(item.price * item.quantity),
    items: [item],
  });
}

export function trackRemoveFromCart(item: MarketingItem) {
  track('remove_from_cart', {
    currency: 'BRL',
    value: money(item.price * item.quantity),
    items: [item],
  });
}

export function trackViewCart(items: MarketingItem[], value: number) {
  track('view_cart', {
    currency: 'BRL',
    value: money(value),
    items,
  });
}

export function trackBeginCheckout(items: MarketingItem[], value: number) {
  track('begin_checkout', {
    currency: 'BRL',
    value: money(value),
    items,
  });
}

export function trackAddShippingInfo(items: MarketingItem[], value: number, shippingTier: string) {
  track('add_shipping_info', {
    currency: 'BRL',
    value: money(value),
    shipping_tier: shippingTier,
    items,
  });
}

export function trackAddPaymentInfo(items: MarketingItem[], value: number, paymentType = 'InfinitePay') {
  track('add_payment_info', {
    currency: 'BRL',
    value: money(value),
    payment_type: paymentType,
    items,
  });
}

export function trackPurchase(input: {
  transactionId: string;
  items: MarketingItem[];
  value: number;
  shipping?: number;
  coupon?: string;
}) {
  if (typeof window !== 'undefined') {
    const storageKey = `ago_purchase_tracked_${input.transactionId}`;
    try {
      if (window.sessionStorage.getItem(storageKey) === '1') return;
      window.sessionStorage.setItem(storageKey, '1');
    } catch {}
  }

  track('purchase', {
    transaction_id: input.transactionId,
    currency: 'BRL',
    value: money(input.value),
    shipping: money(input.shipping || 0),
    ...(input.coupon ? { coupon: input.coupon } : {}),
    items: input.items,
  });
}

export function trackContact(method: string) {
  track('contact', { method });
}

export function trackProductInteraction(action: 'quick_view' | 'save_product' | 'unsave_product' | 'share_product', item: MarketingItem) {
  track(action, {
    currency: 'BRL',
    value: money(item.price * item.quantity),
    items: [item],
  });
}
