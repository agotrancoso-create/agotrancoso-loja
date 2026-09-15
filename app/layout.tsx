import type { Metadata } from 'next';
import './globals.css';
import './ago-editorial.css';
import './ago-terrosa-final.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { SITE_DOMAIN } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: {
    default: 'Agô Trancoso | Cerâmicas e peças artesanais',
    template: '%s | Agô Trancoso',
  },
  description:
    'Cerâmicas, lembranças e detalhes especiais para decorar, presentear e guardar memórias. Conheça a coleção da Agô Trancoso.',
  keywords: [
    'artesanato em Trancoso',
    'cerâmica em Trancoso',
    'artesanato de Trancoso',
    'cerâmica artesanal',
    'decoração artesanal',
    'peças artesanais',
    'presentes de Trancoso',
  ],
  alternates: { canonical: SITE_DOMAIN },
  openGraph: {
    title: 'Agô Trancoso',
    description: 'Trancoso em forma de cerâmica.',
    url: SITE_DOMAIN,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <CartProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
