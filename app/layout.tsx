import './globals.css';
import './commerce.css';
import './product-photo-integrity.css';
import './responsive-parity.css';
import './conversion-experience.css';
import './premium-experience.css';
import './quality-pass.css';
import './immersive-experience.css';
import './confirmation-experience.css';
import './calm-experience.css';
import './bahia-immersive.css';
import './luxury-polish.css';
import './final-overrides.css';
import './premium-contrast.css';
import './bahia-luxury-system.css';
import './signature-commerce.css';
import './privacy-consent.css';
import './flagship-system.css';
import './proportion-fix.css';
import './offer-premium.css';
import './purchase-clarity.css';
import './visual-refinement.css';
import './site-growth-consistency.css';
import './reference-terracotta.css';
import './home-self-selling.css';
import './home-map.css';
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import MarketingAnalytics from '@/components/MarketingAnalytics';
import KlaviyoOnsite from '@/components/KlaviyoOnsite';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import ConsentManager from '@/components/ConsentManager';
import ImmersiveMotion from '@/components/ImmersiveMotion';
import CepAddressAutofill from '@/components/CepAddressAutofill';
import { LocaleProvider } from '@/components/LocaleProvider';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SocialFloaters from '@/components/SocialFloaters';
import FirstPurchaseOffer from '@/components/FirstPurchaseOffer';
import { SITE_DOMAIN, WHATSAPP_NUMBER } from '@/lib/config';

const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], display: 'swap', variable: '--font-display', weight: ['500', '600', '700'] });
const firstPurchaseAvailable = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
  (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);
const buildVersion = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || '';

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#68483a', colorScheme: 'light' };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  manifest: '/manifest.webmanifest',
  title: {
    default: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso',
    template: '%s | Agô Trancoso',
  },
  description: 'Igrejinhas de Trancoso em cerâmica, peças inspiradas na Igreja do Quadrado e uma seleção de artesanato em cerâmica disponível na Agô, no Quadrado de Trancoso, Bahia.',
  alternates: { languages: { 'pt-BR': '/', en: '/en' } },
  keywords: [
    'Agô Trancoso',
    'igrejinha de Trancoso',
    'Igreja do Quadrado',
    'Igreja de São João Batista Trancoso',
    'cerâmica Trancoso',
    'cerâmica artesanal Trancoso',
    'artesanato Trancoso',
    'lembrança de Trancoso',
    'Quadrado de Trancoso',
    'Bahia',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso',
    description: 'Cerâmica artesanal disponível na Agô Trancoso, com igrejinhas e peças inspiradas em um dos símbolos mais reconhecidos da vila.',
    url: SITE_DOMAIN,
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/produtos/igreja-quadrado-p.jpg', width: 960, height: 960, alt: 'Igrejinha do Quadrado de Trancoso em cerâmica' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica',
    description: 'Igrejinhas de Trancoso e cerâmica artesanal disponíveis na Agô, no Quadrado de Trancoso, Bahia.',
    images: ['/produtos/igreja-quadrado-p.jpg'],
  },
};

const mapsUrl = 'https://www.google.com/maps/place/Ag%C3%B4+Trancoso/@-16.5895579,-39.0958675,17z/data=!3m1!4b1!4m6!3m5!1s0x7369d0ea9a6df93a:0xe2f24a89022d4d4f!8m2!3d-16.5895579!4d-39.0958675!16s%2Fg%2F11zfrzkcvk?entry=ttu';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'Store'],
      '@id': `${SITE_DOMAIN}#organization`,
      name: 'Agô Trancoso',
      url: SITE_DOMAIN,
      logo: `${SITE_DOMAIN}/logo.png`,
      image: `${SITE_DOMAIN}/produtos/igreja-quadrado-p.jpg`,
      description: 'Loja de cerâmica artesanal no Quadrado de Trancoso, Bahia, com peças inspiradas na vila, na Igreja de São João Batista e em outras referências brasileiras.',
      foundingDate: '2016',
      areaServed: { '@type': 'Country', name: 'Brasil' },
      telephone: `+${WHATSAPP_NUMBER}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Quadrado de Trancoso',
        addressLocality: 'Trancoso',
        addressRegion: 'BA',
        addressCountry: 'BR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -16.5895579,
        longitude: -39.0958675,
      },
      hasMap: mapsUrl,
      sameAs: [
        'https://www.instagram.com/agotrancoso',
        'https://www.tiktok.com/@agotrancoso',
        mapsUrl,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_DOMAIN}#website`,
      name: 'Agô Trancoso',
      url: SITE_DOMAIN,
      inLanguage: ['pt-BR', 'en'],
      publisher: { '@id': `${SITE_DOMAIN}#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_DOMAIN}/produtos?busca={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

const versionGuardScript = `
(function () {
  var current = ${JSON.stringify(buildVersion)};
  if (!current) return;
  var checking = false;
  var reloading = false;

  function cleanVersionParam() {
    try {
      var url = new URL(window.location.href);
      if (url.searchParams.get('__ago_v') === current) {
        url.searchParams.delete('__ago_v');
        history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      }
    } catch (_) {}
  }

  async function checkVersion() {
    if (checking || reloading || document.visibilityState === 'hidden') return;
    // Never interrupt a purchase or discard an unfinished form after a deploy.
    if (/^\\/(checkout|confirmacao)(\\/|$)/.test(window.location.pathname)) return;
    var focused = document.activeElement;
    if (focused && (focused.matches('input, textarea, select') || focused.isContentEditable)) return;
    checking = true;
    try {
      var response = await fetch('/api/health?build=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) return;
      var data = await response.json();
      var live = data && data.version;
      if (live && live !== current) {
        reloading = true;
        var next = new URL(window.location.href);
        next.searchParams.set('__ago_v', live);
        window.location.replace(next.toString());
      }
    } catch (_) {
    } finally {
      checking = false;
    }
  }

  cleanVersionParam();
  window.addEventListener('focus', checkVersion);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') checkVersion();
  });
  window.setInterval(checkVersion, 30000);
  window.setTimeout(checkVersion, 1500);
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${cormorant.variable}`} data-build-version={buildVersion || undefined}>
      <body>
        <LocaleProvider>
          <a href="#conteudo-principal" className="ago-skip-link">Ir para o conteúdo</a>
          <MarketingAnalytics />
          <KlaviyoOnsite />
          <WebVitalsReporter />
          <ImmersiveMotion />
          <CepAddressAutofill />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
          <CartProvider>
            <Header firstPurchaseAvailable={firstPurchaseAvailable} />
            <main id="conteudo-principal" className="min-h-[60vh]" tabIndex={-1}>{children}</main>
            <Footer />
            <CartDrawer />
            <SocialFloaters />
            {firstPurchaseAvailable && <FirstPurchaseOffer />}
          </CartProvider>
          <ConsentManager />
          <script id="ago-version-guard" dangerouslySetInnerHTML={{ __html: versionGuardScript }} />
        </LocaleProvider>
      </body>
    </html>
  );
}