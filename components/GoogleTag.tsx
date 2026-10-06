// One global loader shared by Google Ads and the optional GA4 destination.
// Keep the existing basic consent behavior: no Google requests before opt-in.
export default function GoogleTag() {
  const candidate = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';
  const ga4 = /^G-[A-Z0-9]+$/.test(candidate) ? candidate : '';
  const script = `
(function () {
  if (window.__agoGoogleTag) return;
  window.__agoGoogleTag = true;
  var started = false;
  var ga4 = ${JSON.stringify(ga4)};
  function sync(event) {
    var choice = event && event.detail;
    if (choice !== 'all' && choice !== 'essential') {
      try { choice = localStorage.getItem('ago_privacy_consent_v1'); } catch (_) {}
    }
    if (choice !== 'all') {
      if (started) window.gtag('consent', 'update', {
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
  window.addEventListener('ago:privacy-consent', sync);
  sync();
})();`;
  return <script id="ago-google-tag" dangerouslySetInnerHTML={{ __html: script }} />;
}
