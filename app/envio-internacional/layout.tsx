import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_DOMAIN } from '@/lib/config';

const title = 'Envio internacional | International Shipping | Agô Trancoso';
const description = 'Compre peças da Agô Trancoso para entrega fora do Brasil. International shipping quotes are available for customers abroad, with destination, cost and delivery estimate confirmed before payment.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE_DOMAIN}/envio-internacional` },
  openGraph: { title, description, url: `${SITE_DOMAIN}/envio-internacional`, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function InternationalShippingLayout({ children }: { children: ReactNode }) {
  return children;
}
