const SITE = 'https://www.agotrancoso.com.br';
const INDEXNOW_KEY = '7c9f4d6a3e2b1c8f5a0d9e6b4c7f2a31';
const KEY_LOCATION = `${SITE}/${INDEXNOW_KEY}.txt`;

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1].replace(/&amp;/g, '&').trim())
    .filter((url) => url.startsWith(`${SITE}/`) || url === SITE);
}

async function main() {
  const sitemapResponse = await fetch(`${SITE}/sitemap.xml?indexnow=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' },
  });

  if (!sitemapResponse.ok) {
    throw new Error(`Não foi possível ler sitemap.xml: HTTP ${sitemapResponse.status}`);
  }

  const urls = [...new Set(extractLocs(await sitemapResponse.text()))];
  if (!urls.length) throw new Error('sitemap.xml não retornou URLs canônicas da Agô.');

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'www.agotrancoso.com.br',
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`IndexNow respondeu HTTP ${response.status}${body ? `: ${body}` : ''}`);
  }

  console.log(`[IndexNow] ${urls.length} URLs canônicas enviadas com sucesso (HTTP ${response.status}).`);
}

main().catch((error) => {
  console.error('[IndexNow]', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
