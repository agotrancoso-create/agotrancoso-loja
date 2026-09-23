import type { Metadata } from 'next';
import MarketingAnalytics from '@/components/MarketingAnalytics';
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
import './ago-catalog-controls-2026.css';
import './ago-polimento-editorial-2026.css';
import './ago-direcao-arte-final-2026.css';
import './ago-direcao-desktop-radical-2026.css';
import './ago-desktop-final-clean-2026.css';
import './ago-unificacao-humana-2026.css';
import './ago-tipografia-rodape-refinado-2026.css';
import './ago-carrinho-premium-final-2026.css';
import './ago-redesign-clean-2026.css';
import './ago-forca-verdadeira-2026.css';
import './ago-refinamento-senior-2026.css';
import './ago-work-final-refinement-2026.css';
import './ago-mobile-checkout-final-2026.css';
import './ago-benefits-lineart-2026.css';
import './ago-desktop-force-2026.css';
import './ago-structure-beautiful-2026.css';
import './ago-master-visual-2026.css';
import './ago-fashion-commerce-2026.css';
import './ago-brand-color-system-2026.css';
import './ago-final-art-direction-2026.css';
import './ago-alinhamento-final-sem-bordas-2026.css';
import './ago-simbolos-estrutura-editorial-2026.css';
import './ago-interacao-simbolos-centralizados-2026.css';
import './ago-cart-icon-transparent-final-2026.css';
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
  description: 'Cerâmicas e peças feitas à mão, inspirados na Bahia, nas formas de Trancoso e no jeito brasileiro de viver. Conheça a coleção da Agô Trancoso.',
  keywords: ['Agô Trancoso', 'cerâmica artesanal', 'peças feitas à mão', 'decoração artesanal', 'presentes artesanais', 'Trancoso', 'Bahia'],
  alternates: { canonical: SITE_DOMAIN },
  robots: { index: true, follow: true },
  openGraph: { title: 'Agô Trancoso | Cerâmicas e peças feitas à mão', description: 'Peças feitas à mão, inspiradas na Bahia, nas formas de Trancoso e no jeito brasileiro de viver.', url: SITE_DOMAIN, siteName: 'Agô Trancoso', locale: 'pt_BR', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Agô Trancoso | Cerâmicas e peças feitas à mão', description: 'Peças feitas à mão, inspiradas na Bahia e nas formas de Trancoso.' },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${SITE_DOMAIN}#organization`, name: 'Agô Trancoso', url: SITE_DOMAIN, sameAs: ['https://www.instagram.com/agotrancoso'] },
    { '@type': 'WebSite', '@id': `${SITE_DOMAIN}#website`, name: 'Agô Trancoso', url: SITE_DOMAIN, inLanguage: 'pt-BR', publisher: { '@id': `${SITE_DOMAIN}#organization` } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <MarketingAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <style id="ago-final-ui-fix" dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Lato:wght@400;700;900&display=swap');
          body, body button, body input, body select, body textarea { font-family: 'Lato', Arial, sans-serif !important; }
          .ago-home h1, .ago-home h2, .ago-home h3, .catalog-page h1, .catalog-page h2, .product-page h1, .product-page h2, .checkout-page h1, .checkout-page h2, .section-title, .visit-section-title, .hero-section h1, .product-detail-title, footer h3 { font-family: 'EB Garamond', Georgia, serif !important; font-weight: 600 !important; letter-spacing: -0.028em !important; text-rendering: optimizeLegibility; }
          .hero-section h1 { font-size: clamp(3rem, 5.2vw, 5.6rem) !important; line-height: .9 !important; }
          .ago-home .section-title, .ago-home .visit-section-title { font-size: clamp(2.35rem, 4vw, 4.05rem) !important; line-height: .94 !important; }
          .product-name, .product-price, .current-price, .product-add, .header-link, .header-search, .header-actions, .eyebrow, .category-pill, .hero-copy { font-family: 'Lato', Arial, sans-serif !important; }
          footer, .site-footer { background: #4B2B1E !important; color: #F7EDE3 !important; text-align: left !important; }
          footer .footer-shell, .site-footer .footer-shell { width: min(1180px, calc(100% - 48px)) !important; margin-inline: auto !important; padding: 62px 0 26px !important; text-align: left !important; }
          footer .footer-brand, .site-footer .footer-brand { display: flex !important; justify-content: flex-start !important; align-items: center !important; }
          footer .footer-grid, .site-footer .footer-grid { display: grid !important; grid-template-columns: 1.4fr .65fr .9fr !important; gap: 64px !important; justify-items: stretch !important; text-align: left !important; }
          footer .footer-grid > div, .site-footer .footer-grid > div { width: 100% !important; display: flex !important; flex-direction: column !important; align-items: flex-start !important; text-align: left !important; }
          footer h3, .site-footer h3 { color: #f8f2ea !important; }
          footer h4, .site-footer h4 { font-family: 'Lato', Arial, sans-serif !important; color: #b45d35 !important; text-align: left !important; }
          footer p, footer li, footer a, footer span, .site-footer p, .site-footer li, .site-footer a, .site-footer span { font-family: 'Lato', Arial, sans-serif !important; color: rgba(248,242,234,.75) !important; text-align: left !important; }
          footer ul, .site-footer ul { display: flex !important; flex-direction: column !important; align-items: flex-start !important; gap: 7px !important; }
          footer .footer-copyright, .site-footer .footer-copyright { display: block !important; width: 100% !important; margin-top: 34px !important; padding-top: 18px !important; border-top: 1px solid rgba(248,242,234,.12) !important; text-align: center !important; color: rgba(248,242,234,.50) !important; }
          /* AGÔ — PALETA RESPONSIVA UNIFICADA: mobile usa exatamente os mesmos fundos do desktop */
          :root {
            --ago-bg-paper: #F5EEE5;
            --ago-bg-cream: #FAF6EF;
            --ago-bg-sand: #DCC9B4;
            --ago-bg-beige: #EADDCB;
            --ago-bg-dark: #4B2B1E;
            --ago-bg-terra: #8E4B32;
          }
          html, body, body > div { background-color: var(--ago-bg-paper) !important; }
          .ago-clean-home { background: var(--ago-bg-paper) !important; }
          .ago-clean-collection { background: var(--ago-bg-paper) !important; }
          .ago-clean-category-nav { background: var(--ago-bg-sand) !important; }
          .ago-clean-hero { background: var(--ago-bg-dark) !important; }
          .ago-clean-edit { background: var(--ago-bg-beige) !important; }
          .ago-clean-benefits { background: var(--ago-bg-paper) !important; }
          .ago-clean-visit { background: var(--ago-bg-dark) !important; }
          .collection-more { background: var(--ago-bg-paper) !important; }
          .editorial-section { background: var(--ago-bg-sand) !important; }
          .how-section { background: var(--ago-bg-sand) !important; }
          .benefits-strip { background: var(--ago-bg-paper) !important; }
          .visit-section { background: var(--ago-bg-dark) !important; }
          .site-header { background: rgba(250,246,239,.98) !important; }
          footer, .site-footer { background: #2B1813 !important; }
          .product-image-wrap { background: var(--ago-bg-cream) !important; }
          .featured-products-grid .product-image-wrap,
          .ago-clean-product-grid .product-image-wrap { background: var(--ago-bg-cream) !important; }
          @media (max-width: 767px) {
            html, body, body > div { background-color: var(--ago-bg-paper) !important; }
            .ago-clean-home,
            .ago-clean-collection,
            .collection-more { background: var(--ago-bg-paper) !important; }
            .ago-clean-category-nav { background: var(--ago-bg-sand) !important; }
            .ago-clean-hero,
            .ago-clean-visit,
            .visit-section { background: var(--ago-bg-dark) !important; }
            .ago-clean-edit,
            .editorial-section,
            .how-section { background: var(--ago-bg-sand) !important; }
            .ago-clean-benefits,
            .benefits-strip { background: var(--ago-bg-paper) !important; }
            .site-header { background: rgba(252,252,250,.98) !important; }
            footer, .site-footer { background: #2B1813 !important; }
            .product-image-wrap,
            .featured-products-grid .product-image-wrap,
            .ago-clean-product-grid .product-image-wrap { background: var(--ago-bg-cream) !important; }
            .ago-clean-hero-overlay { background: linear-gradient(90deg,rgba(32,20,15,.84),rgba(64,37,29,.45) 48%,rgba(64,37,29,.08)) !important; }
          }
          @media (max-width: 767px) {
            .hero-section h1 { font-size: clamp(2.7rem, 13vw, 4.2rem) !important; line-height: .92 !important; }
            .ago-home .section-title, .ago-home .visit-section-title { font-size: 2.65rem !important; line-height: .96 !important; }
            footer .footer-shell, .site-footer .footer-shell { width: calc(100% - 32px) !important; padding: 48px 0 22px !important; }
            footer .footer-grid, .site-footer .footer-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
            footer .footer-grid > div:first-child, .site-footer .footer-grid > div:first-child { grid-column: auto !important; }
            footer h3, .site-footer h3 { font-size: 2rem !important; }
          }
        ` }} />
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
