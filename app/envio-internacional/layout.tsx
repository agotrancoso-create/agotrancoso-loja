import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_DOMAIN } from '@/lib/config';

const title = 'Envio internacional de cerâmica artesanal | Agô Trancoso';
const description = 'Receba as cerâmicas artesanais da Agô Trancoso no exterior. Consulte destinos atendidos pelos Correios e solicite frete e prazo antes do pagamento.';

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
