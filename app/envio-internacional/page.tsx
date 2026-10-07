import { headers } from 'next/headers';
import InternationalShippingPageClient from '@/components/InternationalShippingPageClient';

export default async function InternationalShippingPage() {
  const requestHeaders = await headers();
  const english = requestHeaders.get('x-ago-locale') === 'en';

  return <InternationalShippingPageClient english={english} />;
}
