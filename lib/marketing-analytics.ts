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
};

function pushDataLayer(event: string, ecommerce?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...(ecommerce ? { ecommerce } : {}) });
}

function track(event: string, ecommerce?: Record<string, unknown>) {
  pushDataLayer(event, ecommerce);
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, ecommerce || {});
  }

  if (typeof window.fbq === 'function') {
    const payload = ecommerce || {};
    const items = Array.isArray(payload.items) ? payload.items as Array<Record<string, unknown>> : [];
    const contents = items.map((item) => ({
      id: item.item_id,
      quantity: item.quantity,
      item_price: item.price,
    }));

    if (event === 'view_item') {
      window.fbq('track', 'ViewContent', {
        content_ids: items.map((item) => item.item_id),
        content_type: 'product',
        contents,
        value: payload.value,
        currency: payload.currency || 'BRL',
      });
    } else if (event === 'add_to_cart') {
      window.fbq('track', 'AddToCart', {
        content_ids: items.map((item) => item.item_id),
        content_type: 'product',
        contents,
        value: payload.value,
        currency: payload.currency || 'BRL',
      });
    } else if (event === 'begin_checkout') {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map((item) => item.item_id),
        content_type: 'product',
        contents,
        num_items: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        value: payload.value,
        currency: payload.currency || 'BRL',
      });
    } else if (event === 'contact') {
      window.fbq('track', 'Contact', payload);
    }
  }
}

export function trackViewItem(item: MarketingItem) {
  track('view_item', {
    currency: 'BRL',
    value: Number((item.price * item.quantity).toFixed(2)),
    items: [item],
  });
}

export function trackAddToCart(item: MarketingItem) {
  track('add_to_cart', {
    currency: 'BRL',
    value: Number((item.price * item.quantity).toFixed(2)),
    items: [item],
  });
}

export function trackRemoveFromCart(item: MarketingItem) {
  track('remove_from_cart', {
    currency: 'BRL',
    value: Number((item.price * item.quantity).toFixed(2)),
    items: [item],
  });
}

export function trackBeginCheckout(items: MarketingItem[], value: number) {
  track('begin_checkout', {
    currency: 'BRL',
    value: Number(value.toFixed(2)),
    items,
  });
}

export function trackContact(method: string) {
  track('contact', { method });
}
