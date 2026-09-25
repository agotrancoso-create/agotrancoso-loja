import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar compra',
  description: 'Finalize seu pedido na Agô Trancoso.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
