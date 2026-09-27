'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MarketingAnalytics() {
  const pathname = usePathname();
  const firstMetaPageView = useRef(true);

  useEffect(() => {
    const pagePath = `${pathname}${window.location.search}`;
    const pageLocation = window.location.href;

    if (GA4_ID) {
      let attempts = 0;
      const sendGaPageView = () => {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: pageLocation,
            page_path: pagePath,
          });
          return;
        }
        attempts += 1;
        if (attempts < 8) window.setTimeout(sendGaPageView, 250);
      };
      sendGaPageView();
    }

    if (META_PIXEL_ID) {
      if (firstMetaPageView.current) {
        firstMetaPageView.current = false;
      } else {
        let attempts = 0;
        const sendMetaPageView = () => {
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'PageView');
            return;
          }
          attempts += 1;
          if (attempts < 8) window.setTimeout(sendMetaPageView, 250);
        };
        sendMetaPageView();
      }
    }
  }, [pathname]);

  return (
    <>
      {GA4_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ago-ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA4_ID}', { anonymize_ip: true, send_page_view: false });
            `}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <Script id="ago-meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
              t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
