import type { Metadata } from 'next';
import './globals.css';
import './ago-editorial.css';
import './ago-terrosa-final.css';
import './ago-paleta-final.css';
import './ago-beneficios-referencia.css';
import './ago-hero-sem-borda.css';
import './ago-proporcao-final.css';
import './ago-ajuste-mestre.css';
import './ago-direcao-estrategica-final.css';
import './ago-final-polish.css';
import './ago-composicao-final.css';
import './ago-checkout-premium.css';
import './ago-social-mobile.css';
import './ago-professional-final.css';
import './ago-composicao-definitiva.css';
import './ago-responsive-final.css';
import './ago-final-device-audit.css';
import './ago-ajuste-final-sessoes.css';
import './ago-paleta-coesa-final.css';
import './ago-direcao-final.css';
import './ago-sem-verde-final.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SocialFloaters from '@/components/SocialFloaters';
import { SITE_DOMAIN } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: { default: 'Agô Trancoso | Cerâmicas e peças artesanais', template: '%s | Agô Trancoso' },
  description: 'Cerâmicas, lembranças e detalhes especiais para decorar, presentear e guardar memórias. Conheça a coleção da Agô Trancoso.',
  keywords: ['artesanato em Trancoso','cerâmica em Trancoso','artesanato de Trancoso','cerâmica artesanal','decoração artesanal','peças artesanais','presentes de Trancoso'],
  alternates: { canonical: SITE_DOMAIN },
  openGraph: { title: 'Agô Trancoso', description: 'Trancoso em forma de cerâmica.', url: SITE_DOMAIN, type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className="font-sans"><CartProvider><Header /><main className="min-h-[60vh]">{children}</main><Footer /><CartDrawer /><SocialFloaters /></CartProvider></body></html>;
}
