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
      localStorage.setItem('agotrancoso_carrinho_v1', JSON.stringify([{productId:'miniatura-quadrado-trancoso',quantity:1}]));
    });
    await page.route('**/api/first-purchase/eligibility',route=>route.fulfill({json:{available:false}}));
    await page.route('**/api/create-checkout',route=>route.abort());
    for (const locale of ['pt','en']) {
      await context.clearCookies();
      await context.addCookies([{name:'ago_locale',value:locale,url:base}]);
      const prefix=locale==='en'?'/en':'';
      await page.goto(base+prefix+'/',{waitUntil:'networkidle'});
      await layout(page);
      const first=page.locator('.ago-premium-product-grid-featured .product-card').first();
      assert.match(await first.innerText(),locale==='en'?/Miniature/:/Miniatura/);
      await first.scrollIntoViewIfNeeded();
      assert.ok(await page.evaluate(()=>scrollY>0),'page scroll');
      await page.screenshot({path:`${artifacts}/${name}-${locale}-home.png`});
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
      results.push({device:name,locale,status:'passed'});
    }
    assert.deepEqual(errors,[],`${name} runtime errors`);
    await context.close();await browser.close();browser=null;
  }
  fs.writeFileSync(`${artifacts}/mobile-checkout-results.json`,JSON.stringify(results,null,2));
  console.log('PASS iPhone WebKit + Android Chromium: PT/EN validation, CPF routing, delivery estimate, scrolling, overflow and touch form sizes');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>{await browser?.close();server.kill();});
