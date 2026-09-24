import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import MarketingAnalytics from '@/components/MarketingAnalytics';
import './globals.css';
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

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f1e8',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: { default: 'Agô Trancoso | Cerâmicas e peças feitas à mão', template: '%s | Agô Trancoso' },
  description: 'Cerâmicas e peças feitas à mão, inspiradas na Bahia, nas formas de Trancoso e no jeito brasileiro de viver. Conheça a coleção da Agô Trancoso.',
  keywords: ['Agô Trancoso', 'cerâmica artesanal', 'peças feitas à mão', 'decoração artesanal', 'presentes artesanais', 'Trancoso', 'Bahia'],
  alternates: { canonical: SITE_DOMAIN },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Agô Trancoso | Cerâmicas e peças feitas à mão',
    description: 'Peças feitas à mão, inspiradas na Bahia, nas formas de Trancoso e no jeito brasileiro de viver.',
    url: SITE_DOMAIN,
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agô Trancoso | Cerâmicas e peças feitas à mão',
    description: 'Peças feitas à mão, inspiradas na Bahia e nas formas de Trancoso.',
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
    <html lang="pt-BR" className={`${manrope.variable} ${fraunces.variable}`}>
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
