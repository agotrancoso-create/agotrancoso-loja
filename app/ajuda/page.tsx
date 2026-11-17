import type { Metadata } from 'next';
import ShoppingHelp from './ShoppingHelp';
import './help.css';

export const metadata: Metadata = {
  title: 'Ajuda com sua compra',
  description: 'Informações sobre entrega, pagamento, peças artesanais e atendimento da Agô Trancoso.',
  alternates: { canonical: '/ajuda' },
};

export default function HelpPage() { return <ShoppingHelp />; }
