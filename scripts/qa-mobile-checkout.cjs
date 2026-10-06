// Exercise both browser engines, touch layouts and checkout failures without placing orders.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium, webkit, devices } = require('playwright');
const base = 'http://127.0.0.1:3134';
const artifacts = process.env.QA_ARTIFACTS || '/tmp/ago-qa';
fs.mkdirSync(artifacts, { recursive: true });
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', process.env.QA_MOBILE_DEV === '1' ? 'dev' : 'start', '--port', '3134'], {stdio:['ignore','pipe','pipe']});
let browser;
const results = [];
async function layout(page) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'horizontal overflow');
}
(async () => {
  await new Promise((resolve,reject) => {
    const timeout = setTimeout(() => reject(new Error('server timeout')),30000);
    server.stdout.on('data', d => { if(d.toString().includes('Ready')) {clearTimeout(timeout);resolve();} });
    server.once('exit', code => reject(new Error(`server exited ${code}`)));
  });
  for (const [name, engine, device] of [
    ['iphone-se', webkit, 'iPhone SE'], ['iphone-13', webkit, 'iPhone 13'],
    ['android-pixel', chromium, 'Pixel 7'], ['android-small', chromium, 'Galaxy S9+'],
  ]) {
    browser = await engine.launch({headless:true});
    const context = await browser.newContext({...devices[device], reducedMotion:'reduce'});
    const page = await context.newPage();
    const errors=[];
    page.on('pageerror', e => { errors.push(`${page.url()}: ${e.message}`); console.error('MOBILE_PAGE_ERROR',page.url(),e.message); });
    await context.addInitScript(() => {
      localStorage.setItem('ago_privacy_consent_v1','essential');
      localStorage.setItem('ago_primeira_compra_v3_vista','1');
      if (!location.search.includes('qa-empty=1')) localStorage.setItem('agotrancoso_carrinho_v1', JSON.stringify([{productId:'miniatura-quadrado-trancoso',quantity:1}]));
    });
    await page.route('**/api/first-purchase/eligibility',route=>route.fulfill({json:{available:false}}));
    await page.route('**/api/create-checkout',route=>route.abort());
    for (const locale of ['pt','en']) {
      await context.clearCookies();
      await context.addCookies([{name:'ago_locale',value:locale,url:base}]);
      const prefix=locale==='en'?'/en':'';
      if (locale === 'en') {
        await page.goto(base+'/en/checkout?qa-empty=1',{waitUntil:'domcontentloaded'});
        await page.evaluate(() => localStorage.removeItem('agotrancoso_carrinho_v1'));
        await page.reload({waitUntil:'domcontentloaded'});
        await page.locator('.checkout-empty').waitFor();
        assert.equal(await page.locator('.checkout-empty .eyebrow').innerText(), 'Your bag');
        assert.equal(await page.locator('.checkout-empty .checkout-title').innerText(), 'Your bag is empty.');
        assert.equal(await page.locator('.checkout-empty .text-link').innerText(), 'Explore collection');
        assert.equal(await page.locator('.checkout-empty .text-link').getAttribute('href'), '/en/produtos');
        await page.waitForFunction(() => document.title === 'Complete purchase | Agô Trancoso');
      }
      await page.goto(base+prefix+'/',{waitUntil:'networkidle'});
      await layout(page);
      const benefits = page.locator('.ago-benefits-reference');
      const resume = page.locator('.resume-cart');
      if (locale === 'en') {
        assert.deepEqual(await benefits.locator('.ago-benefit-icon-copy strong').allTextContents(), ['Handmade','Exclusive pieces','Brazilian inspiration','Shipping across Brazil and abroad']);
        assert.doesNotMatch(await benefits.innerText(), /Feito à|Peças|Inspiração|Envios|Cuidado|Escolhas|Cores|Receba/);
        assert.match(await resume.innerText(), /Your selection is still here/);
        assert.match(await resume.innerText(), /1 piece in your bag/);
        assert.equal(await resume.locator('a').getAttribute('href'), '/en/checkout');
        assert.match(await page.locator('.ago-banca-photo').innerText(), /View pieces from our stall/);
        assert.match(await page.locator('.ago-home-final-cta').innerText(), /View keepsakes/);
      } else {
        assert.match(await benefits.innerText(), /Feito à mão/);
        assert.match(await resume.innerText(), /Sua seleção continua aqui/);
      }
      const first=page.locator('.ago-premium-product-grid-featured .product-card').first();
      assert.match(await first.innerText(),locale==='en'?/Miniature/:/Miniatura/);
      await first.scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(()=>scrollY>0),'page scroll');
      await page.screenshot({path:`${artifacts}/${name}-${locale}-home.png`});
      await page.getByRole('button', {name: locale==='en' ? /Open bag/ : /Abrir sacola/}).first().click();
      const bag=page.locator('.cart-drawer[aria-hidden="false"]');
      await bag.waitFor();
      async function checkBag() {
        if (locale==='en') {
          assert.doesNotMatch(await bag.innerText(), /Faltam|frete|Frete|fixo|Grátis|Remover|\/ un\./);
          assert.match(await bag.locator('.cart-item-info p').first().innerText(), /\/ unit/);
          assert.match(await bag.locator('.cart-shipping-progress-labels').innerText(), /Fixed shipping/);
          assert.equal(await bag.locator('.cart-checkout').getAttribute('href'), '/en/checkout');
        }
      }
      await checkBag();
      assert.match(await bag.locator('.cart-shipping-message').innerText(),locale==='en'?/Add .*20,00 more for free shipping/:/Faltam .*20,00/);
      await bag.getByRole('button',{name:locale==='en'?/Increase quantity of/:/Aumentar quantidade de/}).first().click();
      await bag.locator('.cart-shipping-message.is-free').waitFor({state:'attached'});
      assert.match(await resume.innerText(), locale==='en' ? /2 pieces in your bag/ : /2 peças na sacola/);
      await checkBag();
      await bag.getByRole('button',{name:locale==='en'?/Decrease quantity of/:/Diminuir quantidade de/}).first().click();
      await bag.locator('.cart-shipping-message:not(.is-free)').waitFor({state:'attached'});
      // Add a suggestion when the responsive layout displays it, then remove it.
      if (await bag.locator('.cart-complementary-add').first().isVisible()) {
        await bag.locator('.cart-complementary-add').first().click();
        assert.equal(await bag.locator('.cart-item').count(),2);
        await checkBag();
        await bag.locator('.cart-item').last().locator('.cart-remove').click();
      }
      await bag.locator('.cart-close').click();
      await page.getByRole('button', {name:locale==='en'?/Open bag/:/Abrir sacola/}).first().click();
      await checkBag();
      await page.screenshot({path:`${artifacts}/${name}-${locale}-bag.png`,fullPage:false});
      await bag.locator('.cart-close').click();
      await page.goto(base+prefix+'/checkout',{waitUntil:'networkidle'});
      await page.locator('#name').waitFor();
      await layout(page);
      await page.locator('.checkout-next-step').click();
      await page.locator('#name-error').waitFor();
      assert.equal(await page.locator('#name-error').innerText(),locale==='en'?'Enter your full name.':'Informe seu nome completo.');
      assert.equal(await page.locator('#email-error').innerText(),locale==='en'?'Enter a valid email address.':'Informe um e-mail válido.');
      assert.ok(await page.locator('#document-error').isVisible(), 'domestic CPF required');
      const fontSize=await page.locator('#email').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
      assert.ok(fontSize>=16,'prevent iOS input auto-zoom');
      await page.locator('.checkout-customer-mode input').nth(1).check();
      await page.locator('.checkout-assisted').waitFor();
      assert.equal(await page.locator('#document').count(),0,'no CPF field for assisted foreign order');
      const contact=await page.locator('.checkout-assisted a').getAttribute('href');
      assert.match(contact,/^https:\/\/wa.me\//);
      assert.match(decodeURIComponent(contact),/Miniatura/);
      assert.match(await page.locator('.checkout-total').innerText(),/480/);
      await layout(page);
      await page.screenshot({path:`${artifacts}/${name}-${locale}-foreign.png`,fullPage:true});
      await page.locator('.checkout-customer-mode input').nth(0).check();
      await page.locator('#name').fill('Pessoa Teste');
      await page.locator('#email').fill('test@example.com');
      await page.locator('#phone').fill('73999999999');
      await page.locator('#document').fill('52998224725');
      await page.locator('.checkout-next-step').click();
      await page.locator('#zip').waitFor();
      await page.locator('.checkout-next-step').click();
      assert.equal(await page.locator('#street-error').innerText(),locale==='en'?'Enter the street name.':'Informe a rua ou avenida.');
      await page.locator('#zip').fill('01310100');
      await page.getByText(locale==='en'?'Store estimate: 5–10 business days':'Estimativa da loja: 5–10 dias úteis',{exact:false}).waitFor();
      await layout(page);
      if (locale === 'en') {
        assert.equal(await page.locator('.checkout-shipping-note').innerText().then(t => /Frete|grátis|fixo/.test(t)), false, 'shipping copy fully English');
        assert.match(await page.locator('.ago-clean-summary-bottom').innerText(), /Shipping/);
      }
      await page.screenshot({path:`${artifacts}/${name}-${locale}-checkout.png`,fullPage:true});
      // International quotes must never inherit domestic shipping or free-shipping incentives.
      await page.goto(base+prefix+'/envio-internacional',{waitUntil:'networkidle'});
      if (locale === 'en') {
        assert.doesNotMatch(await page.locator('.checkout-page').innerText(), /Escolha|Informe|Frete|Peças|Destino|cotação/);
        await page.locator('.checkout-submit').click();
        assert.equal(await page.locator('.checkout-form-panel').getByRole('alert').innerText(), 'Enter your full name.');
      }
      await page.getByRole('button',{name:locale==='en'?/Open bag/:/Abrir sacola/}).first().click();
      assert.equal(await bag.locator('select').inputValue(), 'international');
      assert.doesNotMatch(await bag.locator('.cart-summary').innerText(), /39,90|519,90|frete grátis|free shipping/);
      assert.match(await bag.locator('.cart-total-row').innerText(), /480,00/);
      assert.equal(await bag.locator('.cart-checkout').getAttribute('href'), prefix+'/envio-internacional');
      await bag.getByRole('button',{name:locale==='en'?/Increase quantity of/:/Aumentar quantidade de/}).first().click();
      assert.doesNotMatch(await bag.locator('.cart-summary').innerText(), /free shipping|frete grátis/);
      await bag.getByRole('button',{name:locale==='en'?/Decrease quantity of/:/Diminuir quantidade de/}).first().click();
      await bag.locator('select').selectOption('brazil');
      assert.match(await bag.locator('.cart-total-row').innerText(), /519,90/);
      await bag.locator('.cart-close').click();
      if (locale === 'en') {
        await page.goto(base+'/en/produtos',{waitUntil:'networkidle'});
        await page.getByLabel('Find a piece',{exact:true}).fill('zzzznonexistent');
        assert.match(await page.locator('.catalog-empty').innerText(), /No pieces matched/);
        assert.doesNotMatch(await page.locator('.catalog-interface').innerText(), /Encontre|Ordenar|Nenhum|Limpar|Todas|Faixa/);
        assert.match(page.url(), /\/en\/produtos/);
        await page.getByRole('button',{name:'Clear filters',exact:true}).click();
        await page.getByRole('button',{name:'Sort by: Featured',exact:true}).click();
        await page.getByRole('option',{name:'Lowest price',exact:true}).click();
        assert.match(await page.locator('.catalog-results-meta').innerText(), /pieces found/);
      }
      results.push({device:name,locale,status:'passed'});
    }
    assert.deepEqual(errors,[],`${name} runtime errors`);
    await context.close();await browser.close();browser=null;
  }
  fs.writeFileSync(`${artifacts}/mobile-checkout-results.json`,JSON.stringify(results,null,2));
  console.log('PASS iPhone WebKit + Android Chromium: PT/EN validation, CPF routing, delivery estimate, scrolling, overflow and touch form sizes');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill();});
