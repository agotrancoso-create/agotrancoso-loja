// Browser QA for the exact R$ 480 Miniatura shipping contract and conversion cues.
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
    const hero = page.locator('.ago-cinematic-copy').first();
    const featured = page.locator('#pecas-em-destaque').first();
    const confidence = page.locator('section[aria-label="Por que escolher a Agô Trancoso"]').first();
    await hero.waitFor();
    await featured.waitFor();
    await confidence.waitFor();
    const order = await page.evaluate(() => {
      const heroNode = document.querySelector('.ago-cinematic-copy');
      const featuredNode = document.querySelector('#pecas-em-destaque');
      const confidenceNode = document.querySelector('section[aria-label="Por que escolher a Agô Trancoso"]');
      if (!heroNode || !featuredNode || !confidenceNode) return null;
      return {
        heroBeforeFeatured: Boolean(heroNode.compareDocumentPosition(featuredNode) & Node.DOCUMENT_POSITION_FOLLOWING),
        featuredBeforeConfidence: Boolean(featuredNode.compareDocumentPosition(confidenceNode) & Node.DOCUMENT_POSITION_FOLLOWING),
      };
    });
    assert.deepEqual(order, { heroBeforeFeatured: true, featuredBeforeConfidence: true }, `home hierarchy@${width}`);
    assert.equal(normalize(await hero.getByRole('heading', { level: 1 }).innerText()), 'Trancoso em cerâmica.');
    assert.match(normalize(await hero.innerText()), /Igrejinhas, casinhas e lembranças do Quadrado\./);
    assert.equal(await hero.getByRole('link', { name: 'Ver peças', exact: true }).getAttribute('href'), '#pecas-em-destaque');
    const confidenceText = normalize(await confidence.innerText());
    assert.match(confidenceText, /Feito à mão/i);
    assert.match(confidenceText, /peças para guardar/i);
    assert.match(confidenceText, /inspiração brasileira/i);
    assert.match(confidenceText, /envio internacional/i);

    await page.getByRole('button', { name: /Abrir sacola com 1 item/ }).first().click();
    const drawer = page.locator('.cart-drawer[aria-hidden=false]').first();
    await drawer.waitFor();

    const summaryRows = drawer.locator('.cart-summary-row');
    const subtotal = normalize(await summaryRows.filter({ hasText: 'Subtotal' }).first().innerText());
    const shipping = normalize(await summaryRows.filter({ hasText: 'Frete' }).first().innerText());
    const total = normalize(await drawer.locator('.cart-total-row').first().innerText());
    assert.match(subtotal, /^Subtotal R\$\s?480,00$/, `subtotal@${width}: ${subtotal}`);
    assert.match(shipping, /^Frete R\$\s?39,90$/, `shipping@${width}: ${shipping}`);
    assert.match(total, /^Total R\$\s?519,90$/, `total@${width}: ${total}`);

    await page.goto(base + '/produtos', { waitUntil: 'domcontentloaded' });
    const catalog = page.locator('.catalog-grid').first();
    const miniaturaCard = catalog.locator('article[data-product-id="miniatura-quadrado-trancoso"]').first();
    const iemanjaCard = catalog.locator('article[data-product-id="estatueta-iemanja"]').first();
    const igrejaMCard = catalog.locator('article[data-product-id="igreja-quadrado-m"]').first();
    await miniaturaCard.waitFor();
    await iemanjaCard.waitFor();
    await igrejaMCard.waitFor();
    assert.doesNotMatch(normalize(await miniaturaCard.innerText()), /Frete grátis/i);
    assert.doesNotMatch(normalize(await iemanjaCard.innerText()), /Frete grátis/i);
    assert.doesNotMatch(normalize(await igrejaMCard.innerText()), /Frete grátis/i);

    await page.goto(base + '/checkout', { waitUntil: 'domcontentloaded' });
    await page.locator('.checkout-summary').first().waitFor();
    const checkoutText = normalize(await page.locator('.checkout-summary').first().innerText());
    assert.match(checkoutText, /Subtotal R\$\s?480,00/);
    assert.match(checkoutText, /Frete R\$\s?39,90/i);
    assert.match(checkoutText, /Total R\$\s?519,90/);

    await page.goto(base + '/produtos/miniatura-quadrado-trancoso', { waitUntil: 'domcontentloaded' });
    assert.equal(normalize(await page.getByRole('heading', { level: 1 }).innerText()), 'Miniatura do Quadrado de Trancoso para Pendurar');
    const purchaseText = normalize(await page.locator('.purchase-selection-summary').first().innerText());
    assert.match(purchaseText, /1 peça: R\$\s?480,00 · Frete: R\$\s?39,90/i);
    assert.match(purchaseText, /Esta seleção com frete: R\$\s?519,90/i);
    assert.match(normalize(await page.locator('.purchase-selection-help').first().innerText()), /Compra sem cadastro · Pagamento seguro pela InfinitePay/i);

    const deliveryForm = page.getByRole('form', { name: 'Consultar envio pelo CEP' });
    await deliveryForm.getByLabel('Frete e prazo para seu CEP').fill('30140-110');
    await deliveryForm.getByRole('button', { name: 'Consultar' }).click();
    const deliveryResult = page.locator('.product-delivery-result').first();
    await deliveryResult.getByText(/Frete R\$\s?39,90/i).waitFor();
    assert.match(normalize(await deliveryResult.innerText()), /Prazo online ainda não disponível para este CEP/i);

    // Quote responses must belong to the current CEP and quantity, including delayed replies.
    if (width === 390) {
      const cepInput = deliveryForm.getByLabel('Frete e prazo para seu CEP');
      const consult = deliveryForm.getByRole('button', { name: 'Consultar', exact: true });
      await cepInput.fill('00000-000');
      await consult.click();
      assert.equal(await cepInput.getAttribute('aria-invalid'), 'true');
      await deliveryResult.getByText('Informe um CEP válido com 8 dígitos.').waitFor();

      const quoteBody = (deadline, price = 39.9) => JSON.stringify({
        available: true, destinationCep: '30140110',
        options: [{ name: 'Frete', price, deadline, serviceId: 'test' }],
      });
      await page.route('**/api/frete', route => route.fulfill({
        status: 200, contentType: 'application/json', body: quoteBody('3–7'),
      }));
      await cepInput.fill('30140-110');
      await consult.click();
      await deliveryResult.getByText('Prazo estimado: 3–7 dias úteis').waitFor();
      assert.equal(await cepInput.getAttribute('aria-invalid'), null);
      await page.unroute('**/api/frete');

      for (const change of ['cep', 'quantity']) {
        let release;
        let markRequested;
        const requested = new Promise(resolve => { markRequested = resolve; });
        const held = new Promise(resolve => { release = resolve; });
        let markFinished;
        const finished = new Promise(resolve => { markFinished = resolve; });
        await page.route('**/api/frete', async route => {
          markRequested();
          await held;
          try {
            await route.fulfill({ status: 200, contentType: 'application/json', body: quoteBody(99) });
          } catch { /* Browser may have already cancelled this obsolete request. */ }
          finally { markFinished(); }
        });
        await consult.click();
        await requested;
        if (change === 'cep') await cepInput.fill('01001-000');
        else await page.getByRole('button', { name: 'Aumentar quantidade', exact: true }).click();
        assert.equal(await consult.isEnabled(), true);
        release();
        await finished;
        await page.waitForTimeout(150);
        assert.equal(normalize(await deliveryResult.innerText()), '', `obsolete ${change} quote appeared`);
        await page.unroute('**/api/frete');
      }
      assert.match(normalize(await page.locator('.purchase-selection-summary').innerText()), /2 peças: R\$\s?960,00 · Frete grátis/);
      await page.route('**/api/frete', route => route.fulfill({
        status: 502, contentType: 'application/json', body: JSON.stringify({ available: false, error: 'Envio indisponível neste momento.' }),
      }));
      await consult.click();
      await deliveryResult.getByText('Envio indisponível neste momento.').waitFor();
      await deliveryResult.getByRole('link', { name: 'Consultar envio com a Agô' }).waitFor();
      assert.equal(await consult.isEnabled(), true);
      await page.unroute('**/api/frete');
      await page.route('**/api/frete', route => route.fulfill({
        status: 200, contentType: 'application/json', body: quoteBody(1, 0),
      }));
      await consult.click();
      await deliveryResult.getByText('Prazo estimado: 1 dia útil').waitFor();
      await deliveryResult.getByText('Frete grátis', { exact: true }).waitFor();

      for (const invalidCep of ['00000000', '301401100']) {
        const response = await page.request.post(base + '/api/frete', { data: {
          cep: invalidCep, items: [{ productId: 'miniatura-quadrado-trancoso', quantity: 1 }],
        } });
        assert.equal(response.status(), 400);
      }
    }

    await page.close();
  }

  console.log('PASS essential conversion hierarchy + Miniatura title + R$ 480 shipping + on-page CEP consultation at 320/390/820/1440');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill();
});
