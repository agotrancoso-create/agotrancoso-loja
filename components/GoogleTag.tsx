import Script from 'next/script';

// One global loader shared by Google Ads and the optional GA4 destination.
// Keep the existing basic consent behavior: no Google requests before opt-in.
// beforeInteractive makes Next.js place this script in <head> without a manual
// <head> element in RootLayout, avoiding a hydration mismatch at the document root.
export default function GoogleTag() {
  const candidate = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';
  const ga4 = /^G-[A-Z0-9]+$/.test(candidate) ? candidate : '';
  const script = `
(function () {
  if (window.__agoGoogleTag) return;
  window.__agoGoogleTag = true;
  var started = false;
  var allowed = false;
  var ga4 = ${JSON.stringify(ga4)};
  function sync(event) {
    var choice = event && event.detail;
    if (choice !== 'all' && choice !== 'essential') {
      try { choice = localStorage.getItem('ago_privacy_consent_v1'); } catch (_) {}
    }
    allowed = choice === 'all';
    if (!allowed) {
      if (started && typeof window.gtag === 'function') window.gtag('consent', 'update', {
        ad_storage: 'denied', analytics_storage: 'denied',
        ad_user_data: 'denied', ad_personalization: 'denied'
      });
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', started ? 'update' : 'default', {
      ad_storage: 'granted', analytics_storage: 'granted',
      ad_user_data: 'granted', ad_personalization: 'granted'
    });
    if (started) return;
    started = true;
    window.gtag('js', new Date());
    window.gtag('config', 'AW-18232525092', { send_page_view: false });
    if (ga4) window.gtag('config', ga4, { anonymize_ip: true, send_page_view: false });
    if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
      var tag = document.createElement('script');
      tag.id = 'ago-google-tag-loader';
      tag.async = true;
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18232525092';
      document.head.appendChild(tag);
    }
  }
  window.gtag_report_conversion = function (url) {
    var callback = function () {
      if (typeof(url) != 'undefined') {
        window.location = url;
      }
    };
    if (!allowed || typeof window.gtag !== 'function') {
      callback();
      return false;
    }
    window.gtag('event', 'conversion', {
      'send_to': 'AW-18232525092/YuEBCPGawsIcEKSC-fVD',
      'event_callback': callback
    });
    return false;
  };

  document.addEventListener('click', function (event) {
    var element = event.target instanceof Element ? event.target.closest('a[data-google-ads-route="true"]') : null;
    if (!element) return;
    try {
      var destination = new URL(element.href);
      if (destination.protocol !== 'https:' || destination.hostname !== 'www.google.com' || !destination.pathname.startsWith('/maps/')) return;
    } catch (_) { return; }
    if (element.dataset.agoRouteConversionSent === '1') return;
    element.dataset.agoRouteConversionSent = '1';
    window.setTimeout(function () { delete element.dataset.agoRouteConversionSent; }, 0);
    window.gtag_report_conversion();
  }, true);

  window.addEventListener('ago:privacy-consent', sync);
  sync();
})();`;

  return (
    <Script id="ago-google-tag" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
