// QA for automatic PT/EN localization without changing layout or commerce rules.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = 'http://127.0.0.1:3104';
const widths = [320, 390, 820, 1440, 1920];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3104'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;

async function waitForServer() {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Next server timeout')), 30000);
    server.stdout.on('data', data => {
      if (data.toString().includes('Ready')) { clearTimeout(timeout); resolve(); }
    });
    server.on('exit', code => reject(new Error(`Server exited ${code}`)));
  });
}

async function noOverflow(page, label, width) {
  const state = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  assert.ok(state.scrollWidth <= width + 1, `${label}@${width} horizontal overflow: ${JSON.stringify(state)}`);
}

async function waitEnglish(page) {
  await page.waitForFunction(() => document.documentElement.lang === 'en', null, { timeout: 10000 });
}

async function run() {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
  });

  // Device/browser language automatically selects English and must not change layout geometry.
  for (const width of widths) {
    const context = await browser.newContext({
      locale: 'en-US',
      viewport: { width, height: width < 600 ? 844 : 1000 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('ago_privacy_consent_v1', 'essential');
      localStorage.removeItem('ago_locale_preference_v1');
    });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await waitEnglish(page);
    await page.getByRole('heading', { level: 1, name: 'Trancoso in ceramics.' }).waitFor();
    assert.match(await page.locator('.ago-cinematic-copy').innerText(), /Little churches, houses and keepsakes from the Square\./);
    assert.equal((await page.locator('.ago-language-toggle').innerText()).trim(), 'PT');
    await noOverflow(page, 'english-home', width);
    await context.close();
  }

  // Explicit /en entry is shareable and stays English while navigating to products.
  {
    const context = await browser.newContext({ locale: 'pt-BR', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(base + '/en', { waitUntil: 'domcontentloaded' });
    await waitEnglish(page);
    await page.getByRole('heading', { level: 1, name: 'Trancoso in ceramics.' }).waitFor();
    await page.goto(base + '/produtos/miniatura-quadrado-trancoso', { waitUntil: 'domcontentloaded' });
    await waitEnglish(page);
    await page.getByRole('heading', { level: 1, name: 'Trancoso Historic Square Miniature for Hanging' }).waitFor();
    assert.match(await page.locator('.product-description').innerText(), /Made to hang on a wall or display on a shelf\./);
    await noOverflow(page, 'english-product', 390);
    await context.close();
  }

  // Manual preference wins over the device language.
  {
    const context = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('ago_locale_preference_v1', 'pt'));
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.lang === 'pt-BR');
    await page.getByRole('heading', { level: 1, name: 'Trancoso em cerâmica.' }).waitFor();
    assert.match(await page.locator('.ago-cinematic-copy').innerText(), /Igrejinhas, casinhas e lembranças do Quadrado\./);
    assert.equal((await page.locator('.ago-language-toggle').innerText()).trim(), 'EN');
    await context.close();
  }

  // Country is only a fallback when the device language is neither Portuguese nor English.
  {
    const context = await browser.newContext({ locale: 'es-ES', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.route('**/api/locale', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ country: 'US', acceptLanguage: 'es-ES' }) }));
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await waitEnglish(page);
    await page.getByRole('heading', { level: 1, name: 'Trancoso in ceramics.' }).waitFor();
    await context.close();
  }

  // Checkout remains the same flow, with English copy only; commercial values are untouched.
  {
    const context = await browser.newContext({ locale: 'en-US', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.addInitScript(() => {
      localStorage.setItem('ago_locale_preference_v1', 'en');
      localStorage.setItem('ago_privacy_consent_v1', 'essential');
      localStorage.setItem('agotrancoso_carrinho_v1', JSON.stringify([{ productId: 'miniatura-quadrado-trancoso', quantity: 1 }]));
    });
    await page.route('**/api/first-purchase/eligibility', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ available: false }) }));
    await page.goto(base + '/checkout', { waitUntil: 'domcontentloaded' });
    await waitEnglish(page);
    await page.getByRole('heading', { level: 1, name: 'Checkout' }).waitFor();
    const summary = await page.locator('.checkout-summary').innerText();
    assert.match(summary, /R\$\s?480,00/);
    assert.match(summary, /R\$\s?39,90/);
    assert.match(summary, /R\$\s?519,90/);
    await noOverflow(page, 'english-checkout', 390);
    await context.close();
  }

  console.log('PASS automatic PT/EN localization, manual override, /en entry, product and checkout parity at 320/390/820/1440/1920');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill();
});
