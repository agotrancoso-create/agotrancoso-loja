import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  return NextResponse.json(
    { country, acceptLanguage },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
  );
}
