import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_DOMAIN } from '@/lib/config';
import { isEnglishRequest } from '@/lib/server-locale';

export async function generateMetadata(): Promise<Metadata> {
  const english = await isEnglishRequest();
  const title = english ? 'International Shipping | Agô Trancoso' : 'Envio internacional | Agô Trancoso';
  const description = english
    ? 'Request an international shipping quote for Agô Trancoso pieces. Destination availability, shipping cost and delivery estimate are confirmed before payment.'
    : 'Consulte frete e prazo para receber peças da Agô Trancoso fora do Brasil. O destino, valor do envio e prazo são confirmados antes do pagamento.';
  const canonical = english ? `${SITE_DOMAIN}/en/envio-internacional` : `${SITE_DOMAIN}/envio-internacional`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: {
        'pt-BR': `${SITE_DOMAIN}/envio-internacional`,
        en: `${SITE_DOMAIN}/en/envio-internacional`,
        'x-default': `${SITE_DOMAIN}/envio-internacional`,
      },
    },
    openGraph: { title, description, url: canonical, type: 'website', locale: english ? 'en_US' : 'pt_BR' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function InternationalShippingLayout({ children }: { children: ReactNode }) {
  return children;
}
