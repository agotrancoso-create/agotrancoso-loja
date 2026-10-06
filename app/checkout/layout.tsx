import type { Metadata } from 'next';
import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const english = requestHeaders.get('x-ago-locale') === 'en';

  return {
    title: english ? 'Complete purchase' : 'Finalizar compra',
    description: english ? 'Complete your order with Agô Trancoso.' : 'Finalize seu pedido na Agô Trancoso.',
    alternates: { canonical: english ? '/en/checkout' : '/checkout' },
    robots: { index: false, follow: false },
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
