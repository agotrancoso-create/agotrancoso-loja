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
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import MarketingAnalytics from '@/components/MarketingAnalytics';
import ImmersiveMotion from '@/components/ImmersiveMotion';
import CepAddressAutofill from '@/components/CepAddressAutofill';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SocialFloaters from '@/components/SocialFloaters';
import FirstPurchaseOffer from '@/components/FirstPurchaseOffer';
import { SITE_DOMAIN } from '@/lib/config';

const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], display: 'swap', variable: '--font-display', weight: ['500', '600', '700'] });
const firstPurchaseAvailable = Boolean(
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
  (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN),
);

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#875038', colorScheme: 'light' };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  manifest: '/manifest.webmanifest',
  title: {
    default: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso',
    template: '%s | Agô Trancoso',
  },
  description: 'Igrejinhas de Trancoso em cerâmica, peças inspiradas na Igreja do Quadrado e uma seleção de artesanato em cerâmica disponível na Agô, no Quadrado de Trancoso, Bahia.',
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
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso',
    description: 'Cerâmica artesanal disponível na Agô Trancoso, com igrejinhas e peças inspiradas em um dos símbolos mais reconhecidos da vila.',
    url: SITE_DOMAIN,
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/hero.jpg', alt: 'Seleção de cerâmica disponível na Agô Trancoso' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica',
    description: 'Igrejinhas de Trancoso e cerâmica artesanal disponíveis na Agô, no Quadrado de Trancoso, Bahia.',
    images: ['/hero.jpg'],
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
      image: `${SITE_DOMAIN}/hero.jpg`,
      description: 'Loja de cerâmica artesanal no Quadrado de Trancoso, Bahia, com peças inspiradas na vila, na Igreja de São João Batista e em outras referências brasileiras.',
      telephone: '+55 73 9855-8124',
      address: {
        '@type': 'PostalAddress',
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
      inLanguage: 'pt-BR',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        <a href="#conteudo-principal" className="ago-skip-link">Ir para o conteúdo</a>
        <MarketingAnalytics />
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
      </body>
    </html>
  );
}
