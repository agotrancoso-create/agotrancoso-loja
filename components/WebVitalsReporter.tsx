'use client';

import { readPrivacyConsent } from '@/lib/privacy-consent';
import { useReportWebVitals } from 'next/web-vitals';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (typeof window === 'undefined') return;
    const value = metric.name === 'CLS' ? Math.round(metric.value * 1000) : Math.round(metric.value);
    const payload = {
      metric_id: metric.id,
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating,
      value,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'web_vitals', ...payload });
    const ga4 = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';
    if (readPrivacyConsent() === 'all' && /^G-[A-Z0-9]+$/.test(ga4)) window.gtag?.('event', 'web_vitals', {
      send_to: ga4,
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
      ...payload,
    });
  });
  return null;
}
