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