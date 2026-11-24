'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CONSENT_EVENT, readPrivacyConsent } from '@/lib/privacy-consent';

const METRICOOL_HASH = '10632cb3985d7bcf60f687780c5a1d0f';
const METRICOOL_SCRIPT_URL = 'https://tracker.metricool.com/resources/be.js';
const SCRIPT_ID = 'ago-metricool-web-tracker';

declare global {
  interface Window {
    beTracker?: { t: (options: { hash: string }) => void };
  }
}

/**
 * Site-wide Metricool web analytics.
 * The official Metricool loader is added only after explicit analytics consent.
 * Client-side Next.js navigation triggers another page view without duplicating
 * the script or counting the same route twice.
 */
export default function MetricoolWebTracker() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const lastTrackedRoute = useRef('');

  useEffect(() => {
    const sync = () => {
      const consentGranted = readPrivacyConsent() === 'all';
      setAllowed(consentGranted);
      if (!consentGranted) lastTrackedRoute.current = '';
    };
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!allowed || !pathname) return;

    const route = pathname + window.location.search;
    const track = () => {
      if (readPrivacyConsent() !== 'all' || !window.beTracker?.t) return;
      if (lastTrackedRoute.current === route) return;
      window.beTracker.t({ hash: METRICOOL_HASH });
      lastTrackedRoute.current = route;
    };

    if (window.beTracker?.t) {
      track();
      return;
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'text/javascript';
      script.src = METRICOOL_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', track);
    return () => script?.removeEventListener('load', track);
  }, [allowed, pathname]);

  return null;
}
