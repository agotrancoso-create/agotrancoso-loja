// Production interaction QA for Agô Trancoso.
// Runs against a real production build, but mocks only external payment/eligibility services.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const products = require('../data/products.json').products;
const widths = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : [320,390,820,1440,1920];
const artifacts = process.env.QA_ARTIFACTS || '/tmp/ago-qa';
const base = 'http://127.0.0.1:3100';
const results = { widths, routes: [], interactions: [], errors: [] };
fs.mkdirSync(artifacts, { recursive: true });

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3100'], { stdio: ['ignore', 'pipe', 'pipe'] });
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

async function run() {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
  });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('ago_primeira_compra_v3_vista', '1');
    localStorage.setItem('ago_privacy_consent_v1', 'essential');
    localStorage.setItem('agotrancoso_carrinho_v1', JSON.stringify([{ productId: 'igreja-quadrado-p', quantity: 2 }]));
  });
  await page.route('**/api/first-purchase/eligibility', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(route.request().method() === 'GET' ? { available: true } : { eligible: true }),
  }));
  page.on('pageerror', error => {
    const message = `${page.url()}: ${error.message}`;
    results.errors.push(message);
    console.error('QA_PAGE_ERROR', message);
  });

  async function visit(path) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    await page.waitForFunction(() => document.documentElement.dataset.agoHydrated === 'true');
  }

  async function assertNoOverflow(label, width) {
    const state = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.ok(state.scrollWidth <= width + 1, `${label}@${width} horizontal overflow: ${JSON.stringify(state)}`);
    results.routes.push(`${label}@${width}`);
  }

  async function visibleCatalogCardCount() {
    return page.locator('.catalog-grid article:visible').count();
  }

  async function waitForVisibleCatalogCards(expected) {
    await page.waitForFunction(expectedCount => {
      const cards = [...document.querySelectorAll('.catalog-grid article')];
      const visible = cards.filter(card => {
        const style = getComputedStyle(card);
        const rect = card.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
      });
      return visible.length === expectedCount;
    }, expected, { timeout: 10000 });
  }

  // Mobile e desktop são superfícies de release diferentes, mas mantêm a mesma identidade.
  for (const width of widths) {
    const height = width < 600 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    for (const route of ['/', '/produtos', '/produtos/colar-igreja-quadrado', '/checkout', '/contato', '/nossa-essencia']) {
      await visit(route);
      await assertNoOverflow(route, width);
      if (route === '/') {
        const storyImage = page.locator('.ago-story-static-photo').first();
        const storyStyle = await storyImage.evaluate(node => ({ fit: getComputedStyle(node).objectFit, transform: getComputedStyle(node).transform, border: getComputedStyle(node).borderWidth, radius: getComputedStyle(node).borderRadius }));
        assert.equal(storyStyle.fit, 'contain');
        assert.equal(storyStyle.transform, 'none');
        assert.equal(storyStyle.border, '0px');
        assert.equal(storyStyle.radius, '18px');
        const photoGeometry = await storyImage.evaluate(node => {
          const box = node.getBoundingClientRect();
          const frame = node.parentElement.getBoundingClientRect();
          return {ratio: box.width / box.height, naturalRatio: node.naturalWidth / node.naturalHeight, frameRatio: frame.width / frame.height};
        });
        assert.ok(Math.abs(photoGeometry.ratio - 1) < .01, `Photo must fill its rounded square frame at ${width}`);
        assert.ok(Math.abs(photoGeometry.frameRatio - 1) < .01, `No letterboxing inside frame at ${width}`);

        const heroTitle = page.locator('.ago-cinematic-copy h1').first();
        const heroStyle = await heroTitle.evaluate(node => ({ color: getComputedStyle(node).color, shadow: getComputedStyle(node).textShadow }));
        assert.notEqual(heroStyle.shadow, 'none');
      }
      if (route === '/produtos') {
        const budgets = page.getByRole('group', {name:'Faixa de preço', exact:true});
        await budgets.waitFor();
        assert.equal(await budgets.getByRole('button').count(), 8);
        const priceButton = budgets.getByRole('button', {name:'Até R$ 150', exact:true});
        await priceButton.click();
        await page.getByText('3 peças encontradas', {exact:true}).waitFor();
        await waitForVisibleCatalogCards(3);
        assert.equal(await priceButton.getAttribute('aria-pressed'), 'true');
        assert.equal(await visibleCatalogCardCount(), 3);

        await page.getByRole('group', {name:'Filtrar por categoria'}).getByRole('button', {name:'Decoração', exact:true}).click();
        await page.getByText('1 peça encontrada', {exact:true}).waitFor();
        await waitForVisibleCatalogCards(1);
        await page.getByRole('button', {name:'Limpar filtros', exact:true}).click();
        await page.getByText('19 peças encontradas', {exact:true}).waitFor();
        await waitForVisibleCatalogCards(19);
        assert.equal(await budgets.getByRole('button', {name:'Todos os valores'}).getAttribute('aria-pressed'), 'true');

        const premiumButton = budgets.getByRole('button', {name:'Acima de R$ 3.000', exact:true});
        await premiumButton.click();
        await page.getByText('1 peça encontrada', {exact:true}).waitFor();
        await waitForVisibleCatalogCards(1);
        assert.equal(await premiumButton.getAttribute('aria-pressed'), 'true');
        assert.equal(await visibleCatalogCardCount(), 1);
        assert.equal(await page.locator('.catalog-grid article:visible').first().getAttribute('data-product-id'), 'igreja-quadrado-gg');
        await page.getByRole('button', {name:'Limpar filtros', exact:true}).click();
        await page.getByText('19 peças encontradas', {exact:true}).waitFor();
        await waitForVisibleCatalogCards(19);
        await assertNoOverflow('catalog price filters', width);
      }
      if (route.includes('colar-igreja-quadrado')) {
        const gallery = page.locator('.product-gallery-main').first();
        const box = await gallery.boundingBox();
        assert.ok(box && Math.abs(box.width - box.height) < 3, `Product gallery must stay square at ${width}`);
        const image = gallery.locator('img').first();
        const style = await image.evaluate(node => ({ fit: getComputedStyle(node).objectFit, border: getComputedStyle(node).borderWidth }));
        assert.equal(style.fit, 'contain');
        assert.equal(style.border, '0px');
      }
    }

    // Sacola: R$ 500,00 em produtos já qualifica para frete grátis.
    await visit('/');
    const cartButton = page.getByRole('button', { name: /Abrir sacola com 2/ }).first();
    await cartButton.click();
    const drawer = page.locator('.cart-drawer[aria-hidden=false]').first();
    await drawer.waitFor();
    assert.match(await drawer.locator('.cart-shipping-message').innerText(), /frete grátis/i);
    const shippingRow = drawer.locator('.cart-summary-row').filter({ hasText: 'Frete' }).first();
    assert.match(await shippingRow.innerText(), /Grátis/i);
    const checkoutCta = drawer.locator('.cart-checkout').first();
    const ctaBox = await checkoutCta.boundingBox();
    assert.ok(ctaBox && ctaBox.y >= 0 && ctaBox.y + ctaBox.height <= height + 1, `Cart CTA outside viewport at ${width}`);
    await page.keyboard.press('Escape');

    if ([320, 390, 820, 1440].includes(width)) {
      await page.screenshot({ path: `${artifacts}/home-${width}.png`, fullPage: true });
      await visit('/produtos/colar-igreja-quadrado');
      await page.screenshot({ path: `${artifacts}/pdp-${width}.png`, fullPage: true });
      await visit('/checkout');
      await page.screenshot({ path: `${artifacts}/checkout-${width}.png`, fullPage: true });
    }
  }
  results.interactions.push('Responsive home/catalog/PDP/cart/checkout verified at 320, 390, 820, 1440 and 1920');

  // All 19 product pages and every visible gallery photo must decode.
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const product of products) {
    await visit(`/produtos/${product.id}`);
    const gallery = page.locator('.product-gallery-main').first();
    await gallery.locator('img').first().evaluate(img => img.decode());
    assert.ok(await gallery.locator('img').first().evaluate(img => img.naturalWidth > 0), `${product.id}: main image failed`);
    const thumbs = page.locator('.product-gallery-thumbs').first().locator('.product-gallery-thumb');
    const count = await thumbs.count();
    for (let i = 0; i < count; i++) {
      await thumbs.nth(i).click();
      await gallery.locator('img').first().evaluate(img => img.decode());
      assert.ok(await gallery.locator('img').first().evaluate(img => img.naturalWidth > 0), `${product.id}: gallery photo ${i + 1} failed`);
    }
  }
  results.interactions.push('19 product routes and every rendered gallery image decode');

  // Header autocomplete: unfinished words and colloquial aliases must resolve
  // to the intended product before the user has to submit a full search.
  await visit('/');
  const headerSearch = page.getByLabel('Buscar uma peça').first();
  await headerSearch.fill('casinh');
  await page.locator('#ago-search-suggestion-casinha-luminaria').waitFor();
  assert.equal(
    await page.locator('#ago-search-suggestions .ago-search-suggestion').first().getAttribute('id'),
    'ago-search-suggestion-casinha-luminaria',
    'partial "casinh" should rank Casinha Luminária first'
  );
  await page.locator('#ago-search-suggestion-casinha-luminaria').click();
  await page.waitForURL('**/produtos/casinha-luminaria');

  // Catalog discovery: search relevance, no-results recovery, categories and sorting.
  await visit('/produtos');
  const search = page.getByLabel('Encontre uma peça').first();

  for (const [term, expectedId] of [
    ['casinh', 'casinha-luminaria'],
    ['casnha', 'casinha-luminaria'],
    ['house', 'casinha-luminaria'],
    ['igrejinha luminaria', 'igrejinha-luminaria-trancoso'],
    ['preto velho', 'casal-pretos-velhos'],
    ['aparecida', 'nossa-senhora-aparecida'],
  ]) {
    await search.fill(term);
    await page.locator('.catalog-search-suggestion').first().waitFor();
    assert.equal(
      (await page.locator('.catalog-search-suggestion').first().getAttribute('href'))?.split('/').pop(),
      expectedId,
      `Wrong first search suggestion for "${term}"`
    );
    assert.equal(
      await page.locator('.catalog-grid .product-card:visible').first().getAttribute('data-product-id'),
      expectedId,
      `Wrong first catalog result for "${term}"`
    );
  }

  await search.fill('igreja');
  await page.locator('.catalog-search-suggestion').first().waitFor();
  assert.ok(await page.locator('.catalog-search-suggestion img').count() > 0);
  await search.fill('zzzznotfound');
  await page.locator('.catalog-empty').first().waitFor();
  await page.getByRole('button', { name: 'Ver toda a coleção' }).first().click();
  for (const category of require('../data/products.json').categories) {
    await page.getByRole('button', { name: category.name, exact: true }).first().click();
    assert.ok(await page.locator('.catalog-grid .product-card:visible').count() > 0, `Empty category: ${category.id}`);
  }
  await page.getByRole('button', { name: 'Todas', exact: true }).first().click();
  const sort = page.getByRole('button', { name: /Ordenar por:/ }).first();
  await sort.click();
  await page.getByRole('option', { name: 'Maior preço', exact: true }).first().click();
  const mostExpensive = products.reduce((a, b) => (a.price > b.price ? a : b)).id;
  assert.equal(await page.locator('.catalog-grid .product-card:visible').first().getAttribute('data-product-id'), mostExpensive);
  await sort.click();
  await page.getByRole('option', { name: 'Menor preço', exact: true }).first().click();
  const cheapest = products.reduce((a, b) => (a.price < b.price ? a : b)).id;
  assert.equal(await page.locator('.catalog-grid .product-card:visible').first().getAttribute('data-product-id'), cheapest);
  assert.equal(new URL(page.url()).searchParams.get('ordem'), 'price-asc');
  await search.fill('luminária');
  await search.press('Escape');
  assert.equal(new URL(page.url()).searchParams.get('busca'), 'luminária');
  const filteredIds = await page.locator('.catalog-grid .product-card:visible').evaluateAll(cards => cards.map(card => card.dataset.productId));
  assert.ok(filteredIds.length > 0);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.catalog-grid .product-card:visible').first().waitFor();
  assert.equal(await search.inputValue(), 'luminária');
  assert.equal(await sort.getAttribute('aria-label'), 'Ordenar por: Menor preço');
  assert.deepEqual(await page.locator('.catalog-grid .product-card:visible').evaluateAll(cards => cards.map(card => card.dataset.productId)), filteredIds);
  await page.getByRole('button', {name:'Limpar filtros', exact:true}).click();
  assert.equal(new URL(page.url()).search, '');
  await visit('/produtos?categoria=inexistente&ordem=invalida');
  await waitForVisibleCatalogCards(products.filter(product => product.available).length);
  assert.equal(await visibleCatalogCardCount(), products.filter(product => product.available).length);
  results.interactions.push('Catalog search and sorting survive reload; invalid category and sort recover to the full collection');
  results.interactions.push('Predictive search handles partial words, bilingual aliases and relevance ranking; complete price ranges, no-results recovery, every category and sorting verified');

  // Modern gallery: keyboard navigation + full-piece lightbox + zoom + reset + Escape.
  await page.setViewportSize({ width: 390, height: 844 });
  await visit('/produtos/casal-pretos-velhos');
  const mobileGallery = page.locator('.product-gallery-main').first();
  await mobileGallery.press('ArrowRight');
  assert.match(await page.locator('.product-gallery-counter').first().innerText(), /^02/);
  await page.getByRole('button', { name: /Ampliar foto de/ }).first().click();
  const dialog = page.locator('dialog[open]').first();
  await dialog.waitFor();
  assert.match(await dialog.locator('.ago-photo-zoom-value').innerText(), /100%/);
  const zoomImage = dialog.locator('.ago-photo-image').first();
  assert.ok((await zoomImage.getAttribute('src'))?.includes('/zoom/produtos/'));
  await dialog.getByRole('button', { name: 'Aumentar zoom' }).click();
  assert.equal(await dialog.locator('.ago-photo-stage.is-zoomed').count(), 1);
  await dialog.getByRole('button', { name: 'Ver peça inteira' }).click();
  assert.match(await dialog.locator('.ago-photo-zoom-value').innerText(), /100%/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  const pretosThumbs = page.locator('.product-gallery-thumbs .product-gallery-thumb');
  await pretosThumbs.nth(2).click();
  assert.match(await page.locator('.product-gallery-counter').first().innerText(), /^03/);
  assert.equal(await mobileGallery.getAttribute('data-photo-index'), '3');
  const thirdPretos = mobileGallery.locator('img').first();
  const thirdStyle = await thirdPretos.evaluate(node => ({ fit: getComputedStyle(node).objectFit, border: getComputedStyle(node).borderWidth, radius: getComputedStyle(node).borderRadius }));
  assert.equal(thirdStyle.fit, 'contain');
  assert.equal(thirdStyle.border, '0px');
  assert.equal(thirdStyle.radius, '0px');
  results.interactions.push('Gallery keyboard navigation, original-master zoom, Pretos-Velhos photo 3 and Escape verified');

  // Checkout contract in the real UI; external provider handoff is mocked to avoid charging money.
  await visit('/checkout');
  assert.ok((await page.locator('.checkout-total').first().innerText()).includes('500,00'));
  await page.getByRole('button', { name: 'Continuar para entrega' }).first().click();
  assert.equal(await page.locator('#name').getAttribute('aria-invalid'), 'true');
  assert.equal(await page.locator('#document').getAttribute('aria-invalid'), 'true');
  for (const [id, value] of Object.entries({ name: 'Pessoa Teste', email: 'teste@example.com', phone: '73999999999', document: '52998224725' })) await page.locator('#' + id).fill(value);
  await page.getByRole('button', { name: 'Continuar para entrega' }).first().click();
  // Trocar para um CEP geral não pode reaproveitar rua e bairro do CEP anterior.
  await page.route('**/api/cep?cep=*', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify(route.request().url().includes('46098000')
      ? {found:true,street:'',neighborhood:'',city:'Mucugê',state:'BA'}
      : {found:true,street:'Rua de Teste',neighborhood:'Centro',city:'Porto Seguro',state:'BA'}),
  }));
  await page.locator('#zip').fill('01310100');
  await page.waitForFunction(() => document.getElementById('street')?.value === 'Rua de Teste');
  await page.locator('#zip').fill('46098000');
  await page.waitForFunction(() => document.getElementById('city')?.value === 'Mucugê');
  assert.equal(await page.locator('#street').inputValue(), '');
  assert.equal(await page.locator('#neighborhood').inputValue(), '');
  await page.locator('#zip').fill('46098');
  assert.equal(await page.locator('#zip').getAttribute('aria-busy'), null);
  results.interactions.push('CEP change clears outdated street/neighborhood and lookup busy state');
  for (const [id, value] of Object.entries({ zip: '45818000', number: '10', street: 'Rua de Teste', neighborhood: 'Centro', city: 'Porto Seguro', state: 'BA' })) await page.locator('#' + id).fill(value);
  await page.getByRole('button', { name: 'Continuar para benefício' }).first().click();
  const coupon = page.getByRole('textbox', { name: 'Cupom de desconto' }).first();
  await coupon.fill('AGO3');
  await page.getByRole('button', { name: 'Aplicar', exact: true }).first().click();
  await page.getByRole('button', { name: 'Continuar com benefício' }).first().waitFor();
  assert.ok((await page.locator('.checkout-total').first().innerText()).includes('485,00'));
  await page.getByRole('button', { name: 'Continuar com benefício' }).first().click();

  let checkoutPayload;
  await page.route('**/api/create-checkout', async route => {
    checkoutPayload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ checkoutUrl: base + '/handoff-test' }) });
  });
  await page.route('**/handoff-test', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Payment handoff test</h1>' }));
  await page.getByRole('button', { name: 'Pagar com InfinitePay' }).first().click();
  await page.waitForURL('**/handoff-test');
  assert.equal(checkoutPayload.coupon, 'AGO3');
  assert.equal(checkoutPayload.shippingValue, 0);
  assert.equal(checkoutPayload.customer.document, '529.982.247-25');
  results.interactions.push('Checkout validation, CPF/CNPJ, R$500 shipping threshold, coupon, totals and successful mocked InfinitePay handoff verified');

  assert.deepEqual(results.errors, [], `Uncaught JS errors: ${results.errors.join('; ')}`);
  fs.writeFileSync(`${artifacts}/results.json`, JSON.stringify(results, null, 2));
  console.log(`PASS ${results.routes.length} layout checks; ${results.interactions.length} interaction groups; no uncaught JS errors`);
}

run().catch(error => {
  console.error(error);
  fs.writeFileSync(`${artifacts}/failure.json`, JSON.stringify({ error: String(error), results }, null, 2));
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill();
});
