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
import './ago-direcao-artesanal-2026.css';
import './ago-redesign-2026.css';
import './ago-centralizado-terra-final.css';
import './ago-layout-final-2026.css';
import './ago-direcao-proporcional-terra-2026.css';
import './ago-paleta-rodape-final.css';
import './ago-direcao-mestre-2026.css';
import './ago-sem-linhas-proporcional.css';
import './ago-ajuste-proporcao-final.css';
import './ago-mobile-preenchido-final.css';
import './ago-unificacao-total.css';
import './ago-force-final.css';
import './ago-auditoria-visual-final.css';
import './ago-rodape-tipografia-final.css';
import './ago-neuro-conversao-final.css';
import './ago-mestre-final-2026.css';
import './ago-visita-editorial.css';
import './ago-ajuste-pedido-final.css';
import './ago-palette-terrosa-2026.css';
import './ago-forca-total-2026.css';
import './ago-direcao-definitiva-viva-2026.css';
import './ago-viva-ajuste-final-2026.css';
import './ago-rodape-restaurado-2026.css';
import './ago-design-system-2026.css';
import './ago-ajuste-terroso-elegante-final-2026.css';
import './ago-social-floaters-final-2026.css';
import './ago-salvador-sertao-final.css';
import './ago-alinhamento-textual-final-2026.css';
import './ago-force-alinhamento-visual-2026.css';
import './ago-catalogo-editorial-final-2026.css';
import './ago-identidade-bahia-final-2026.css';
import './ago-responsive-unico-2026.css';
import './ago-visite-alinhamento-force-2026.css';
import './ago-alinhamento-global-2026.css';
import './ago-acessibilidade-proporcao-final-2026.css';
import './ago-ux-acessibilidade-final-2026.css';
import './ago-copyright-centralizado-final.css';
import './ago-direcao-designer-final-2026.css';
import './ago-brasilidade-2026.css';
import './ago-prompt-mestre-final-2026.css';
import './ago-experiencia-total-2026.css';
import './ago-oferta-checkout-legal-2026.css';
import './ago-alinhamento-total-final-2026.css';
import './ago-refinamento-visual-final-2026.css';
import './ago-redesign-forca-2026.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SocialFloaters from '@/components/SocialFloaters';
import FirstPurchaseOffer from '@/components/FirstPurchaseOffer';
import { SITE_DOMAIN } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_DOMAIN),
  title: { default: 'Agô Trancoso | Cerâmicas e peças feitas à mão', template: '%s | Agô Trancoso' },
  description: 'Cerâmicas e objetos feitos à mão, inspirados na Bahia, nas formas de Trancoso e no jeito brasileiro de viver. Conheça a coleção da Agô Trancoso.',
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
      sameAs: ['https://www.instagram.com/agotrancoso'],
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
    <html lang="pt-BR">
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <CartProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <CartDrawer />
          <SocialFloaters />
          <FirstPurchaseOffer />
        </CartProvider>
      </body>
    </html>
  );
}
