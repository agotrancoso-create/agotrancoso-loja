'use client';

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
    window.gtag?.('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
      ...payload,
    });
  });
  return null;
}
