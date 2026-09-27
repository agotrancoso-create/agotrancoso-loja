'use client';

import Script from 'next/script';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY || 'TLfDBc';

export default function KlaviyoOnsite() {
  if (!PUBLIC_KEY) return null;
  return (
    <Script
      id="ago-klaviyo-onsite"
      src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(PUBLIC_KEY)}`}
      strategy="afterInteractive"
    />
  );
}
