// Validates the analytics contract in a real production build without requiring a live GA4 account.
// Every marketing helper always mirrors its event into window.dataLayer, so this catches semantic
// regressions, duplicate PDP views and missing ecommerce events before deployment.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const port = 3102;
const base = `http://127.0.0.1:${port}`;
const artifacts = process.env.QA_ARTIFACTS || '/tmp/ago-qa';
fs.mkdirSync(artifacts, { recursive: true });
const report = { assertions: [], events: [] };
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;

async function ready() {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Analytics QA server timeout')), 30000);
    server.stdout.on('data', data => {
      if (data.toString().includes('Ready')) { clearTimeout(timer); resolve(); }
    });
    server.on('exit', code => reject(new Error(`Analytics QA server exited ${code}`)));
  });
}

async function run() {
  await ready();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  // Google Ads shares one head loader with GA4, gated by the existing consent choice.
  const tagContext = await browser.newContext();
  const tagPage = await tagContext.newPage();
  const tagErrors = [];
  tagPage.on('pageerror', error => tagErrors.push(error.message));
  await tagPage.route('https://www.googletagmanager.com/**', route => route.fulfill({contentType:'application/javascript', body:''}));
  await tagPage.addInitScript(() => localStorage.setItem('ago_primeira_compra_v3_vista', '1'));
  await tagPage.goto(base + '/en/produtos', {waitUntil:'networkidle'});
  assert.equal(await tagPage.locator('head #ago-google-tag').count(), 1);
  assert.equal(await tagPage.locator('script[src*="googletagmanager.com/gtag/js"]').count(), 0);
  await tagPage.locator('.ago-consent-accept').click();
  await tagPage.waitForFunction(() => (window.dataLayer || []).some(x => x[0] === 'event' && x[1] === 'page_view'));
  assert.equal(await tagPage.locator('head script[src*="googletagmanager.com/gtag/js?id=AW-18232525092"]').count(), 1);

  // "Ver rota" is a click-only Google Ads conversion. It must not fire on load
  // or on unrelated links, and each real route click must enqueue exactly once.
  await tagPage.goto(base + '/en', {waitUntil:'domcontentloaded'});
  await tagPage.locator('[data-google-ads-route="true"]').first().waitFor();
  const routeConversionCount = () => tagPage.evaluate(() => (window.dataLayer || []).filter(x =>
    x && x[0] === 'event' && x[1] === 'conversion' && x[2]?.send_to === 'AW-18232525092/YuEBCPGawsIcEKSC-fVD'
  ).length);
  assert.equal(await routeConversionCount(), 0, 'route conversion must not fire on page load');
  const ordinaryLink = tagPage.locator('a[href^="/en/produtos"]').first();
  await ordinaryLink.evaluate(el => el.addEventListener('click', event => event.preventDefault(), {once:true}));
  await ordinaryLink.click();
  assert.equal(await routeConversionCount(), 0, 'unrelated links must not fire route conversion');

  const routeLink = tagPage.locator('[data-google-ads-route="true"]').first();
  assert.match(await routeLink.getAttribute('href'), /^https:\/\/www\.google\.com\/maps\//);
  assert.equal(await routeLink.getAttribute('target'), '_blank');
  await routeLink.evaluate(el => el.addEventListener('click', event => event.preventDefault(), {once:true}));
  await routeLink.click();
  assert.equal(await routeConversionCount(), 1, 'desktop route click must enqueue exactly one conversion');

  await tagPage.setViewportSize({width:390,height:844});
  const mobileRouteLink = tagPage.locator('[data-google-ads-route="true"]').nth(1);
  await mobileRouteLink.evaluate(el => el.addEventListener('click', event => event.preventDefault(), {once:true}));
  await mobileRouteLink.click();
  assert.equal(await routeConversionCount(), 2, 'mobile route click must enqueue exactly one additional conversion');

  await tagPage.goto(base + '/en/produtos', {waitUntil:'domcontentloaded'});
  await tagPage.locator('.product-card-main').first().click();
  await tagPage.waitForURL('**/produtos/*');
  await tagPage.waitForFunction(() => (window.dataLayer || []).filter(x => x[0] === 'event' && x[1] === 'page_view').length === 2);
  assert.equal(await tagPage.locator('script[src*="googletagmanager.com/gtag/js"]').count(), 1);
  assert.equal(await tagPage.evaluate(() => window.dataLayer.filter(x => x[0] === 'config' && x[1] === 'AW-18232525092').length), 1);
  await tagPage.reload({waitUntil:'networkidle'});
  assert.equal(await tagPage.locator('head #ago-google-tag-loader').count(), 1);
  assert.equal(await tagPage.evaluate(() => window.dataLayer.filter(x => x[0] === 'config' && x[1] === 'AW-18232525092').length), 1);
  await tagPage.evaluate(() => {
    localStorage.setItem('ago_privacy_consent_v1','essential');
    window.dispatchEvent(new CustomEvent('ago:privacy-consent',{detail:'essential'}));
  });
  assert.equal(await tagPage.evaluate(() => Array.from(window.dataLayer).filter(x => x[0] === 'consent').at(-1)[2].ad_storage), 'denied');
  await tagPage.reload({waitUntil:'networkidle'});
  assert.equal(await tagPage.locator('#ago-google-tag-loader').count(), 0);
  assert.deepEqual(tagErrors, []);
  await tagContext.close();
  console.log('PASS Google Ads head placement, consent, route-click conversion, navigation and no duplicate loader/config');
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('ago_primeira_compra_v3_vista', '1');
    localStorage.setItem('ago_privacy_consent_v1', 'essential');
  });
  await page.route('**/api/first-purchase/eligibility', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(route.request().method() === 'GET' ? { available: true } : { eligible: true }),
  }));

  async function events(name) {
    return page.evaluate((wanted) => (window.dataLayer || []).filter(entry => entry && entry.event === wanted), name);
  }
  async function waitFor(name, count = 1) {
    await page.waitForFunction(({ eventName, expected }) => (window.dataLayer || []).filter(entry => entry && entry.event === eventName).length >= expected, { eventName: name, expected: count });
  }
  function pass(message) { report.assertions.push(message); console.log('PASS', message); }

  await page.goto(base + '/produtos', { waitUntil: 'domcontentloaded' });
  await page.locator('h1').first().waitFor();
  await waitFor('view_item_list');
  const initialList = await events('view_item_list');
  assert.ok(initialList[0].ecommerce.items.length >= 1);
  pass('view_item_list carries rendered ecommerce items');

  const search = page.getByLabel('Encontre uma peça').first();
  await search.fill('igreja');
  await waitFor('search');
  const searches = await events('search');
  assert.equal(searches.at(-1).ecommerce.search_term, 'igreja');
  assert.ok(Number.isInteger(searches.at(-1).ecommerce.result_count));
  pass('catalog search records term and result count');

  await search.press('Escape');
  await page.getByRole('button', { name: 'Presentes', exact: true }).first().click();
  await waitFor('catalog_filter');
  const filters = await events('catalog_filter');
  assert.equal(filters.at(-1).ecommerce.filter_value, 'Presentes');
  pass('category filter is measurable for CRO');

  await page.getByRole('button', { name: 'Todas', exact: true }).first().click();
  const sort = page.getByRole('button', { name: /Ordenar por:/ }).first();
  await sort.click();
  await page.getByRole('option', { name: 'Menor preço', exact: true }).first().click();
  await waitFor('catalog_sort');
  assert.equal((await events('catalog_sort')).at(-1).ecommerce.sort_value, 'price-asc');
  pass('sort behavior is measurable for CRO');

  const card = page.locator('.catalog-grid .product-card').first();
  const selectedId = await card.getAttribute('data-product-id');
  await card.locator('.product-card-main').click();
  await page.waitForURL('**/produtos/*');
  await waitFor('select_item');
  await waitFor('view_item');
  const selected = await events('select_item');
  const viewed = await events('view_item');
  assert.equal(selected.at(-1).ecommerce.items[0].item_id, selectedId);
  assert.equal(viewed.at(-1).ecommerce.items[0].item_id, selectedId);
  assert.equal(viewed.length, 1, 'PDP should emit one view_item in production navigation');
  pass('select_item and exactly one PDP view_item are semantically distinct');

  const add = page.locator('.product-purchase .product-primary-cta').first();
  await add.click();
  await waitFor('add_to_cart');
  assert.equal((await events('add_to_cart')).at(-1).ecommerce.items[0].item_id, selectedId);
  pass('add_to_cart carries product identity');

  const cartDrawer = page.locator('.cart-drawer').first();
  const cartButton = page.getByRole('button', { name: /Abrir sacola/ }).first();
  if ((await cartDrawer.getAttribute('aria-hidden')) !== 'false') {
    await cartButton.click();
  }
  await waitFor('view_cart');
  const viewCart = (await events('view_cart')).at(-1);
  assert.ok(viewCart.ecommerce.value > 0);
  assert.ok(viewCart.ecommerce.items.length >= 1);
  pass('view_cart records value and line items when drawer opens');

  await page.locator('.cart-checkout').first().click();
  await page.waitForURL('**/checkout');
  await waitFor('begin_checkout');
  const begin = (await events('begin_checkout')).at(-1);
  assert.ok(begin.ecommerce.value > 0);
  assert.ok(begin.ecommerce.items.length >= 1);
  const recoveryUrl = new URL(begin.ecommerce.recovery_url);
  assert.equal(recoveryUrl.origin, base);
  assert.match(recoveryUrl.searchParams.get('retomar') || '', new RegExp(`${selectedId}:1`));
  pass('begin_checkout includes a canonical recovery URL without prices or personal data');

  // Simula a abertura do e-mail em outro aparelho: sem localStorage de carrinho.
  await page.evaluate(() => localStorage.removeItem('agotrancoso_carrinho_v1'));
  await page.goto(recoveryUrl.toString(), { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Finalizar compra' }).waitFor();
  await page.waitForFunction(() => !new URL(location.href).searchParams.has('retomar'));
  await waitFor('begin_checkout');
  const recoveredBegin = (await events('begin_checkout')).at(-1);
  assert.equal(recoveredBegin.ecommerce.items[0].item_id, selectedId);
  assert.equal(recoveredBegin.ecommerce.items[0].quantity, 1);
  assert.ok(recoveredBegin.ecommerce.value > 0);
  pass('recovery URL rebuilds the cart from canonical catalog data on a fresh device');

  for (const [id, value] of Object.entries({ name: 'Pessoa Teste', email: 'qa-analytics@example.com', phone: '73999999999', document: '52998224725' })) await page.locator('#' + id).fill(value);
  await page.getByRole('button', { name: 'Continuar para entrega' }).first().click();
  for (const [id, value] of Object.entries({ zip: '45818000', number: '10', street: 'Rua Teste', neighborhood: 'Centro', city: 'Porto Seguro', state: 'BA' })) await page.locator('#' + id).fill(value);
  await page.getByRole('button', { name: 'Continuar para benefício' }).first().click();
  await waitFor('add_shipping_info');
  const shipping = (await events('add_shipping_info')).at(-1);
  assert.match(shipping.ecommerce.shipping_tier, /Frete/);
  pass('add_shipping_info fires only after valid delivery data');

  await page.getByRole('button', { name: 'Continuar sem cupom' }).first().click();
  await page.route('**/api/create-checkout', route => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'QA stop before external payment' }) }));
  await page.getByRole('button', { name: 'Pagar com InfinitePay' }).first().click();
  await waitFor('add_payment_info');
  const payment = (await events('add_payment_info')).at(-1);
  assert.equal(payment.ecommerce.payment_type, 'InfinitePay');
  pass('add_payment_info is emitted at payment handoff attempt');

  const all = await page.evaluate(() => window.dataLayer || []);
  report.events = all.filter(entry => entry?.event).map(entry => entry.event);
  fs.writeFileSync(`${artifacts}/analytics.json`, JSON.stringify(report, null, 2));
  console.log('Analytics contract:', report.events.join(' -> '));
}

run().catch(error => {
  console.error(error);
  fs.writeFileSync(`${artifacts}/analytics-failure.json`, JSON.stringify({ error: String(error), report }, null, 2));
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill();
});
