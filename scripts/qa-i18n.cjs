const { spawn } = require('node:child_process');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const port = 3105;
const base = `http://127.0.0.1:${port}`;
const widths = [320, 390, 820, 1440];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Next server timeout')), 30000);
    server.stdout.on('data', (data) => {
      if (data.toString().includes('Ready')) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.on('exit', (code) => reject(new Error(`Server exited ${code}`)));
  });
}

function requestWithHeaders(headers) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, path: '/', method: 'GET', headers }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location || '' }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function assertNoOverflow(page, label) {
  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert.ok(layout.scrollWidth <= layout.clientWidth + 1, `${label}: horizontal overflow ${layout.scrollWidth} > ${layout.clientWidth}`);
}

async function run() {
  await waitForServer();

  const automaticEn = await requestWithHeaders({ Host: 'www.agotrancoso.com.br', 'Accept-Language': 'en-US,en;q=0.9' });
  assert.equal(automaticEn.status, 200, 'Canonical Portuguese URL must stay stable for crawlers regardless of browser language');
  assert.ok(!automaticEn.location, 'English browser must not be redirected away from the canonical URL');

  const automaticPt = await requestWithHeaders({ Host: 'www.agotrancoso.com.br', 'Accept-Language': 'pt-BR,pt;q=0.9' });
  assert.notEqual(automaticPt.status, 307, 'Portuguese browser must not be redirected to English');

  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
  });

  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 1000 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('ago_primeira_compra_v3_vista', '1');
      localStorage.setItem('ago_privacy_consent_v1', 'essential');
    });

    await page.goto(base + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR', `pt lang@${width}`);
    assert.equal((await page.locator('.ago-cinematic-copy > p:not(.eyebrow)').first().innerText()).trim(), 'Igrejinhas, casinhas e lembranças do Quadrado.', `approved hero copy@${width}`);
    await page.locator('.ago-language-switcher').waitFor();
    await assertNoOverflow(page, `pt@${width}`);

    await page.goto(base + '/en', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await page.waitForFunction(() => document.title === 'Ceramics in Trancoso | Agô Trancoso');
    assert.equal((await page.getByRole('heading', { level: 1 }).first().innerText()).trim(), 'Trancoso in ceramic.', `english hero@${width}`);
    assert.match((await page.locator('.ago-footer-place').innerText()).trim(), /Brazil$/, `english footer country@${width}`);
    assert.match((await page.locator('.ago-cinematic-copy').first().innerText()), /Churches, little houses and keepsakes from the Quadrado\./, `english hero support@${width}`);
    assert.equal(await page.locator('.ago-language-switcher button[aria-pressed="true"]').innerText(), 'EN', `english switch@${width}`);
    await assertNoOverflow(page, `en-home@${width}`);

    const collectionHref = await page.getByRole('link', { name: /View full collection/i }).first().getAttribute('href');
    assert.ok(collectionHref && collectionHref.startsWith('/en/'), `English internal link must keep locale@${width}: ${collectionHref}`);

    if (width === 1440) {
      const search = page.getByRole('searchbox', { name: 'Search for a piece', exact: true });
      await search.fill('house');
      await page.getByRole('button', { name: /Ceramic House Luminary/ }).waitFor();
      assert.match(await page.locator('#ago-search-suggestions').innerText(), /View results for/);
      await search.press('Enter');
      await page.waitForURL('**/en/produtos?busca=house');
      await page.getByRole('heading', { name: 'Ceramic House Luminary', exact: true }).waitFor();
      await page.goto(base + '/en/produtos/nonexistent-quality-check', { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'We couldn’t find this page.', exact: true }).waitFor();
      assert.equal(await page.getByRole('link', { name: 'View collection', exact: true }).getAttribute('href'), '/en/produtos');
    }

    await page.goto(base + '/en/produtos/miniatura-quadrado-trancoso', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await page.waitForFunction(() => document.title === 'Hanging Miniature of the Trancoso Quadrado | Agô Trancoso');
    assert.equal((await page.getByRole('heading', { level: 1 }).innerText()).trim(), 'Hanging Miniature of the Trancoso Quadrado', `English product title@${width}`);
    assert.match((await page.locator('.product-description').innerText()).trim(), /Quadrado in miniature/i, `English product description@${width}`);
    assert.match((await page.locator('.product-buybox').innerText()), /Measurements/i, `English product facts@${width}`);
    await assertNoOverflow(page, `en-product@${width}`);
    assert.match(await page.locator('.purchase-selection-summary').innerText(), /This selection with shipping/);
    await page.getByRole('button', { name: 'Check shipping', exact: true }).click();
    assert.equal(await page.locator('.product-delivery-error').innerText(), 'Enter a valid 8-digit Brazilian postal code.');
    await page.getByRole('button', { name: /Enlarge photo of/ }).click();
    await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
    assert.match(await page.locator('.ago-photo-help').innerText(), /Drag to explore details/);
    await page.getByRole('button', { name: 'Close enlarged view', exact: true }).click();
    if (width === 1440) {
      await page.getByRole('button', { name: /^Add to bag: 1 unit of/ }).click();
      await page.getByRole('button', { name: 'International', exact: true }).click();
      await page.getByRole('button', { name: 'Close bag', exact: true }).click();
      const summary = await page.locator('.purchase-selection-summary').innerText();
      assert.match(summary, /International shipping quoted separately/);
      assert.doesNotMatch(summary, /39[,.]90|519[,.]90/);
      assert.equal(await page.locator('.product-delivery-estimator').count(), 0);
      await page.getByRole('button', { name: 'Open bag with 1 item', exact: true }).click();
      await page.getByRole('button', { name: 'Brazil', exact: true }).click();
      await page.getByRole('button', { name: 'Close bag', exact: true }).click();
      assert.match(await page.locator('.purchase-selection-summary').innerText(), /519,90/);
    }

    await page.goto(base + '/en/checkout', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await page.waitForFunction(() => document.title === 'Complete purchase | Agô Trancoso');
    await assertNoOverflow(page, `en-checkout@${width}`);

    await page.close();
  }

  console.log('PASS automatic locale detection + PT/EN switch + English storefront parity at 320/390/820/1440');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill();
});
