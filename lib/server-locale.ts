import 'server-only';
import { headers } from 'next/headers';

export async function isEnglishRequest() {
  const requestHeaders = await headers();
  return requestHeaders.get('x-ago-locale') === 'en';
}
