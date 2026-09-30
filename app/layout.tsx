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
import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import MarketingAnalytics from '@/components/MarketingAnalytics';
import KlaviyoOnsite from '@/components/KlaviyoOnsite';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import ConsentManager from '@/components/ConsentManager';
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
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
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
    title: 'Agô Trancoso | Igrejinhas do Quadrado e cerâmica em Trancoso',
    description: 'Cerâmica artesanal inspirada em Trancoso, disponível para compra online.',
    images: ['/produtos/igreja-quadrado-p.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-[#fcf9f4] text-[#35241d] antialiased">
        <CartProvider>
          <ConsentManager />
          <MarketingAnalytics />
          <KlaviyoOnsite />
          <WebVitalsReporter />
          <ImmersiveMotion />
          <CepAddressAutofill />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <SocialFloaters />
          {firstPurchaseAvailable && <FirstPurchaseOffer />}
        </CartProvider>
      </body>
    </html>
  );
}
