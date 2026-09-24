import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import MarketingAnalytics from '@/components/MarketingAnalytics';
import './globals.css';
import './product-purchase-control.css';
import './attention-architecture.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SocialFloaters from '@/components/SocialFloaters';
import FirstPurchaseOffer from '@/components/FirstPurchaseOffer';
import InteractiveEnhancements from '@/components/InteractiveEnhancements';
import { SITE_DOMAIN } from '@/lib/config';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f1e8',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: { default: 'Agô Trancoso | Objetos brasileiros em cerâmica', template: '%s | Agô Trancoso' },
  description: 'Objetos brasileiros em cerâmica para casa, fé e presente. Trancoso é o maior repertório da Agô — e o começo de uma coleção que vai além.',
  keywords: ['Agô Trancoso', 'cerâmica brasileira', 'decoração em cerâmica', 'presentes artesanais', 'Trancoso', 'Bahia', 'fé e devoção'],
  alternates: { canonical: SITE_DOMAIN },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Agô Trancoso | Objetos brasileiros em cerâmica',
    description: 'Trancoso é o maior repertório da Agô. Descubra objetos para casa, fé, presente e outras referências brasileiras.',
    url: SITE_DOMAIN,
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agô Trancoso | Objetos brasileiros em cerâmica',
    description: 'Objetos para casa, fé e presente, com o Brasil sempre por perto.',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_DOMAIN}#organization`,
      name: 'Agô Trancoso',
      url: SITE_DOMAIN,
      sameAs: ['https://www.instagram.com/agotrancoso', 'https://www.tiktok.com/@agotrancoso'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_DOMAIN}#website`,
      name: 'Agô Trancoso',
      url: SITE_DOMAIN,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_DOMAIN}#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${cormorant.variable}`}>
      <body>
        <MarketingAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <CartProvider>
          <InteractiveEnhancements />
          <Header />
          <main id="conteudo-principal">{children}</main>
          <Footer />
          <CartDrawer />
          <SocialFloaters />
          <FirstPurchaseOffer />
        </CartProvider>
      </body>
    </html>
  );
}
