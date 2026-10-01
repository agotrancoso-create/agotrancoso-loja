import { NextRequest, NextResponse } from 'next/server';

const LOCALE_COOKIE = 'ago_locale';
const PORTUGUESE_COUNTRIES = new Set(['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL']);

function preferredLocale(request: NextRequest): 'pt' | 'en' {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved === 'pt' || saved === 'en') return saved;

  const hostname = request.nextUrl.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') return 'pt';

  const accepted = request.headers.get('accept-language') ?? '';
  const ranked = accepted
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().toLowerCase().split(';');
      const qParam = params.find((part) => part.trim().startsWith('q='));
      const q = qParam ? Number(qParam.split('=')[1]) : 1;
      return { tag, q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const language of ranked) {
    if (language.tag === 'pt' || language.tag.startsWith('pt-')) return 'pt';
    if (language.tag === 'en' || language.tag.startsWith('en-')) return 'en';
  }

  const country = (request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || '').toUpperCase();
  if (country && PORTUGUESE_COUNTRIES.has(country)) return 'pt';
  if (country) return 'en';

  return 'pt';
}

function remember(response: NextResponse, locale: 'pt' | 'en') {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: true,
    httpOnly: false,
  });
  response.headers.set('Vary', 'Accept-Language, x-vercel-ip-country');
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const explicitEnglish = pathname === '/en' || pathname.startsWith('/en/');

  if (explicitEnglish) {
    const target = request.nextUrl.clone();
    target.pathname = pathname === '/en' ? '/' : pathname.slice(3) || '/';
    const response = NextResponse.rewrite(target);
    response.headers.set('x-ago-locale', 'en');
    return remember(response, 'en');
  }

  const locale = preferredLocale(request);
  if (locale === 'en') {
    const target = request.nextUrl.clone();
    target.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
    return remember(NextResponse.redirect(target, 307), 'en');
  }

  const response = NextResponse.next();
  response.headers.set('x-ago-locale', 'pt');
  return remember(response, 'pt');
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|manifest.webmanifest|robots.txt|sitemap.xml|image-sitemap.xml|google-merchant.xml|.*\\.(?:jpg|jpeg|png|webp|avif|svg|gif|ico|css|js|map|woff|woff2|ttf)$).*)',
  ],
};
