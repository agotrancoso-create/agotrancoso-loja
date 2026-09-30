// Browser QA for the exact R$ 480 Miniatura shipping contract.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = 'http://127.0.0.1:3102';
const widths = [320, 390, 820, 1440];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3102'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim();
}

async function waitForServer() {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Next server timeout')), 30000);
    server.stdout.on('data', data => {
      if (data.toString().includes('Ready')) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.on('exit', code => reject(new Error(`Server exited ${code}`)));
  });
}

async function run() {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
  });

  for (const width of widths) {
    const height = width < 600 ? 844 : 1000;
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('ago_primeira_compra_v3_vista', '1');
      localStorage.setItem('ago_privacy_consent_v1', 'essential');
      localStorage.setItem('agotrancoso_carrinho_v1', JSON.stringify([{ productId: 'miniatura-quadrado-trancoso', quantity: 1 }]));
    });
    await page.route('**/api/first-purchase/eligibility', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ available: false }) }));

    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Abrir sacola com 1 item/ }).first().click();
    const drawer = page.locator('.cart-drawer[aria-hidden=false]').first();
    await drawer.waitFor();

    const summaryRows = drawer.locator('.cart-summary-row');
    const subtotal = normalize(await summaryRows.filter({ hasText: 'Subtotal' }).first().innerText());
    const shipping = normalize(await summaryRows.filter({ hasText: 'Frete' }).first().innerText());
    const total = normalize(await drawer.locator('.cart-total-row').first().innerText());
    assert.match(subtotal, /^Subtotal R\$\s?480,00$/, `subtotal@${width}: ${subtotal}`);
    assert.equal(shipping, 'Frete Grátis', `shipping@${width}: ${shipping}`);
    assert.match(total, /^Total R\$\s?480,00$/, `total@${width}: ${total}`);

    await page.goto(base + '/checkout', { waitUntil: 'domcontentloaded' });
    await page.locator('.checkout-summary').first().waitFor();
    const checkoutText = normalize(await page.locator('.checkout-summary').first().innerText());
    assert.match(checkoutText, /Subtotal R\$\s?480,00/);
    assert.match(checkoutText, /Frete Grátis/);
    assert.match(checkoutText, /Total R\$\s?480,00/);

    await page.goto(base + '/produtos/miniatura-quadrado-trancoso', { waitUntil: 'domcontentloaded' });
    const purchaseText = normalize(await page.locator('.purchase-selection-summary').first().innerText());
    assert.match(purchaseText, /1 peça: R\$\s?480,00 · Frete grátis/);
    assert.match(purchaseText, /Esta seleção com frete: R\$\s?480,00/);

    await page.close();
  }

  console.log('PASS Miniatura R$ 480 => Subtotal R$ 480, Frete Grátis, Total R$ 480 at 320/390/820/1440 and checkout/PDP');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill();
});
