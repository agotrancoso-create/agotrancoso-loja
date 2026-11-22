'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/types';
import { getEffectivePrice } from '@/lib/products';
import { trackViewItem } from '@/lib/marketing-analytics';
import { CONSENT_EVENT, readPrivacyConsent } from '@/lib/privacy-consent';

const RECENT_KEY = 'ago:recent-products';

export default function ProductViewTracker({ product }: { product: Product }) {
  useEffect(() => {
    const item = {
      item_id: product.id,
      item_name: product.name,
      price: getEffectivePrice(product),
      quantity: 1,
      item_category: product.category,
    };
    let sentWithConsent = readPrivacyConsent() === 'all';
    trackViewItem(item);

    // If someone accepts analytics after entering the product page, its
    // original PageVisit was suppressed. Send it exactly once after consent.
    const onConsentChange = () => {
      const nowAllowed = readPrivacyConsent() === 'all';
      if (nowAllowed && !sentWithConsent) trackViewItem(item);
      sentWithConsent = nowAllowed;
    };
    window.addEventListener(CONSENT_EVENT, onConsentChange);

    try {
      const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) || '[]');
      const current = Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
      const next = [product.id, ...current.filter((id) => id !== product.id)].slice(0, 12);
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Browsing history is an enhancement only. Never block product viewing.
    }
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, [product]);
  return null;
}
