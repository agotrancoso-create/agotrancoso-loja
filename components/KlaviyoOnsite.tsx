'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, readPrivacyConsent } from '@/lib/privacy-consent';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY || 'TLfDBc';

export default function KlaviyoOnsite() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(readPrivacyConsent() === 'all');
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!PUBLIC_KEY || !allowed) return null;
  return (
    <Script
      id="ago-klaviyo-onsite"
      src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(PUBLIC_KEY)}`}
      strategy="afterInteractive"
    />
  );
}
