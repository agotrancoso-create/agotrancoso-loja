const INDEXNOW_KEY = '7c9f4d6a3e2b1c8f5a0d9e6b4c7f2a31';

export function GET() {
  return new Response(`${INDEXNOW_KEY}\n`, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
