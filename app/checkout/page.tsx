import { headers } from 'next/headers';
import CheckoutPageClient from '@/components/CheckoutPageClient';

export default async function CheckoutPage() {
  const requestHeaders = await headers();
  const english = requestHeaders.get('x-ago-locale') === 'en';

  return <CheckoutPageClient english={english} />;
}
