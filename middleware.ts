import { NextRequest, NextResponse } from 'next/server';

const LOCALE_COOKIE = 'ago_locale';

function remember(response: NextResponse, locale: 'pt' | 'en') {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: true,
    httpOnly: false,
  });
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

  /*
   * A URL principal é a versão brasileira/portuguesa e precisa permanecer
   * rastreável de forma estável. Não redirecionamos mais visitantes — nem
   * mecanismos de busca — por IP ou Accept-Language. A versão em inglês fica
   * disponível explicitamente em /en, evitando que um crawler localizado fora
   * do Brasil receba um 307 para a versão inglesa e perca os sinais da página PT.
   */
  const response = NextResponse.next();
  response.headers.set('x-ago-locale', 'pt');
  return remember(response, 'pt');
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|manifest.webmanifest|robots.txt|sitemap.xml|image-sitemap.xml|google-merchant.xml|.*\\.(?:txt|jpg|jpeg|png|webp|avif|svg|gif|ico|css|js|map|woff|woff2|ttf)$).*)',
  ],
};
