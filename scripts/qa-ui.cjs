// Production build QA. Uses installed Playwright and a provided Chromium binary.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const products = require('../data/products.json').products;
const widths = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : [320,360,375,390,430,768,820,1024,1280,1440,1600,1920];
const results = { widths, routes: [], interactions: [], errors: [], imageFailures: [] };
let browser;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--port','3100'], { stdio: ['ignore','pipe','pipe'] });
const base = 'http://127.0.0.1:3100';
const artifacts = process.env.QA_ARTIFACTS || '/tmp/ago-qa';
fs.mkdirSync(artifacts,{recursive:true});
async function run() {
  await new Promise((resolve,reject) => { server.stdout.on('data', d => { if (d.toString().includes('Ready')) resolve(); }); server.on('exit', c => reject(new Error(`Server exited ${c}`))); });
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--disable-gpu-sandbox'] });
  const p = await browser.newPage({ reducedMotion:'reduce' });
  await p.addInitScript(() => { localStorage.setItem('ago_primeira_compra_v3_vista','1'); });
  await p.route('**/api/first-purchase/eligibility', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(route.request().method()==='GET'?{available:true}:{eligible:true})}));
  p.on('pageerror', e => results.errors.push(e.message));
  async function visit(path) { await p.goto(base+path,{waitUntil:'domcontentloaded'}); await p.locator('h1').first().waitFor(); }
  async function checkLayout(name,width) {
    const overflow = await p.evaluate(() => ({ width:innerWidth, scroll:document.documentElement.scrollWidth, offenders:[...document.querySelectorAll('main *, header *, footer *')].filter(e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();return s.visibility!=='hidden'&&s.display!=='none'&&r.width>0&&(r.right>innerWidth+2||r.left< -2)&&!e.closest('[aria-hidden=true],.sr-only');}).slice(0,8).map(e=>e.className) }));
    assert.ok(overflow.scroll<=width+1,`${name}@${width}: ${JSON.stringify(overflow)}`);
    results.routes.push(`${name}@${width}`);
  }
  for (const width of widths) {
    const height = width<600?800:1000;
    await p.setViewportSize({width,height});
    for (const path of ['/','/produtos','/produtos/colar-igreja-quadrado','/contato','/nossa-essencia','/checkout','/termos','/privacidade']) {
      await visit(path); await checkLayout(path,width);
      if (path.includes('colar')) {
        const box=await p.locator('.product-gallery-main').boundingBox(); assert.ok(Math.abs(box.width-box.height)<2);
        const metrics=await p.locator('.product-gallery-main img').evaluate(e=>({fit:getComputedStyle(e).objectFit,padding:getComputedStyle(e).padding,border:getComputedStyle(e).borderWidth}));
        assert.equal(metrics.fit,'contain'); assert.equal(metrics.padding,'0px'); assert.equal(metrics.border,'0px');
      }
      if (path==='/contato') assert.ok(await p.locator('.contact-copy > p').last().evaluate(e=>parseFloat(getComputedStyle(e).lineHeight)>=28));
      if ([320,390,820,1440].includes(width)&&['/','/contato','/produtos/colar-igreja-quadrado'].includes(path)) await p.screenshot({path:`${artifacts}/${path==='/'?'home':path.split('/').pop()}-${width}.png`,fullPage:true});
    }
    // Bag count variants, quantities, shipping thresholds, narrow screens.
    for (const count of [1,4,9,10,12,99,100,120]) {
      // Use a known second ID from the actual catalogue, not a fixture name.
      await p.evaluate(({n,second})=>localStorage.setItem('agotrancoso_carrinho_v1',JSON.stringify(n<=99?[{productId:'igreja-quadrado-p',quantity:n}]:[{productId:'igreja-quadrado-p',quantity:99},{productId:second,quantity:n-99}])),{n:count,second:products.find(x=>x.price===50).id});
      await visit('/'); await p.locator('.cart-count').waitFor();
      assert.equal(await p.locator('.cart-count').innerText(),String(count));
      const badge=await p.locator('.cart-count').boundingBox(); assert.ok(badge.x+badge.width<=width);
      await p.getByRole('button',{name:new RegExp(`Abrir sacola com ${count} `)}).click();
      await p.locator('.cart-drawer[aria-hidden=false]').waitFor();
      const cta=await p.locator('.cart-checkout').boundingBox(); assert.ok(cta.y>=0&&cta.y+cta.height<=height,`CTA out of view ${width}/${count}`);
      if(count===1) assert.ok((await p.locator('.cart-total-row').innerText()).includes('289,90'));
      if(count===4) assert.ok((await p.locator('.cart-summary-row').last().innerText()).includes('Grátis'));
      if(count===12&&[320,390,820,1440].includes(width)) await p.screenshot({path:`${artifacts}/bag-${width}.png`});
      await p.keyboard.press('Escape');
    }
    await visit('/checkout'); await checkLayout('checkout-populated',width);
    if([320,390,820,1440].includes(width)) await p.screenshot({path:`${artifacts}/checkout-${width}.png`,fullPage:true});
    console.log('PASS layout and bag',width);
  }
  // All catalogue images, including third Pretos-Velhos photo, must decode.
  await p.setViewportSize({width:1440,height:1000});
  for (const product of products) {
    await visit('/produtos/'+product.id);
    for (let i=0;i<product.images.length;i++) {
      if (product.images.length>1) await p.getByRole('button',{name:`Ver foto ${i+1}`,exact:true}).click();
      await p.locator('.product-gallery-main img').evaluate(e=>e.decode());
      assert.ok(await p.locator('.product-gallery-main img').evaluate(e=>e.naturalWidth>0));
    }
  }
  results.interactions.push('19 product routes; every gallery photo decodes');
  await visit('/produtos');
  const search=p.getByLabel('Encontre uma peça'); await search.fill('i');
  await p.locator('.catalog-search-suggestion').first().waitFor();
  assert.ok((await p.locator('.catalog-search-suggestion strong').first().innerText()).toLowerCase().startsWith('i'));
  assert.ok(await p.locator('.catalog-search-suggestion img').count()>0);
  await search.press('ArrowDown'); assert.ok((await p.locator('.catalog-search-suggestion').first().evaluate(e=>e===document.activeElement)));
  await p.keyboard.press('Escape'); assert.equal(await p.locator('.catalog-search-suggestion').count(),0);
  await search.fill('zzzznotfound'); await p.locator('.catalog-empty').waitFor(); await p.getByRole('button',{name:'Ver toda a coleção'}).click();
  for (const c of require('../data/products.json').categories) { await p.getByRole('button',{name:c.name,exact:true}).click(); assert.ok(await p.locator('.catalog-grid .product-card').count()>0); }
  await p.getByRole('button',{name:'Todas',exact:true}).click();
  const sort=p.getByRole('button',{name:/Ordenar por:/}); await sort.press('ArrowDown'); await p.keyboard.press('End'); await p.keyboard.press('Enter'); assert.ok((await sort.innerText()).includes('Nome'));
  await sort.click(); await p.getByRole('option',{name:'Maior preço',exact:true}).click(); assert.equal(await p.locator('.catalog-grid .product-card').first().getAttribute('data-product-id'),products.reduce((a,b)=>a.price>b.price?a:b).id);
  await sort.click(); await p.getByRole('option',{name:'Menor preço',exact:true}).click(); assert.equal(await p.locator('.catalog-grid .product-card').first().getAttribute('data-product-id'),products.reduce((a,b)=>a.price<b.price?a:b).id);
  await sort.click(); await p.keyboard.press('Escape'); assert.equal(await p.locator('.catalog-sort-menu').count(),0);
  results.interactions.push('Predictive search, keyboard, no results, all categories, sort ascending/descending/name/Escape');
  await visit('/'); await p.locator('.ago-benefit-item').last().locator('summary').press('Enter'); assert.equal(await p.locator('.ago-benefit-item[open]').count(),1);
  await p.setViewportSize({width:390,height:844}); await p.getByRole('button',{name:'Abrir menu',exact:true}).click(); await p.getByLabel('Buscar na coleção').fill('i'); assert.ok(await p.locator('.mobile-search-suggestions img').count()>0); await p.keyboard.press('Escape');
  await visit('/produtos/casal-pretos-velhos'); await p.locator('.product-gallery-main').press('ArrowRight'); assert.ok((await p.locator('.product-gallery-counter').innerText()).startsWith('02'));
  await p.locator('.product-gallery-main').evaluate(e=>{for(const [type,x] of [['touchstart',250],['touchend',80]]){const ev=new Event(type,{bubbles:true});Object.defineProperty(ev,'changedTouches',{value:[{clientX:x,clientY:100}]});e.dispatchEvent(ev);}});
  await p.waitForFunction(()=>document.querySelector('.product-gallery-counter').textContent.startsWith('03'));
  // A new tap clears swipe suppression.
  await p.locator('.product-gallery-main').evaluate(e=>{const ev=new Event('touchstart',{bubbles:true});Object.defineProperty(ev,'changedTouches',{value:[{clientX:100,clientY:100}]});e.dispatchEvent(ev);});
  await p.getByRole('button',{name:/Ampliar foto de/}).click(); await p.locator('dialog[open]').waitFor(); await p.getByRole('button',{name:'Zoom +',exact:true}).click(); assert.equal(await p.locator('.ago-photo-canvas.is-zoomed').count(),1); await p.keyboard.press('Escape');
  results.interactions.push('Benefits keyboard expansion, mobile search with photos, gallery keyboard/swipe/zoom/Escape');
  // Complete checkout, without performing a real purchase or creating a live lead.
  await p.evaluate(()=>localStorage.setItem('agotrancoso_carrinho_v1',JSON.stringify([{productId:'igreja-quadrado-p',quantity:2}])));
  await visit('/checkout');
  assert.ok((await p.locator('.checkout-total').innerText()).includes('539,90'));
  await p.getByRole('button',{name:'Continuar para entrega'}).click(); assert.equal(await p.locator('#name').getAttribute('aria-invalid'),'true'); assert.ok(await p.locator('#name').evaluate(e=>e===document.activeElement));
  for (const [id,value] of Object.entries({name:'Pessoa Teste',email:'teste@example.com',phone:'73999999999'})) await p.locator('#'+id).fill(value);
  await p.getByRole('button',{name:'Continuar para entrega'}).click();
  for (const [id,value] of Object.entries({zip:'45818000',number:'10',street:'Rua de Teste',neighborhood:'Centro',city:'Porto Seguro',state:'ZZ'})) await p.locator('#'+id).fill(value);
  await p.getByRole('button',{name:'Continuar para benefício'}).click(); assert.equal(await p.locator('#state').getAttribute('aria-invalid'),'true');
  await p.locator('#state').fill('BA'); await p.getByRole('button',{name:'Continuar para benefício'}).click();
  const coupon=p.getByRole('textbox',{name:'Cupom de desconto'});await coupon.fill('INVALIDO');await p.getByRole('button',{name:'Aplicar',exact:true}).click();assert.ok((await p.locator('.checkout-coupon-message').innerText()).includes('não encontrado'));
  await coupon.fill('AGO3');assert.equal(await p.locator('.checkout-discount-row').count(),0);await p.getByRole('button',{name:'Aplicar',exact:true}).click();await p.getByRole('button',{name:'Continuar com benefício'}).waitFor();assert.ok((await p.locator('.checkout-total').innerText()).includes('524,90'));await p.getByRole('button',{name:'Continuar com benefício'}).click();
  await p.getByRole('button',{name:'Seus dados',exact:false}).first().click(); await p.locator('#email').fill('invalido'); assert.ok(await p.getByRole('button',{name:/Pagamento/}).first().isDisabled());
  await p.locator('#email').fill('teste@example.com');await p.getByRole('button',{name:'Continuar para entrega'}).click();await p.getByRole('button',{name:'Continuar para benefício'}).click();await p.getByRole('button',{name:'Continuar sem cupom'}).click();assert.ok((await p.locator('.checkout-payment-total').innerText()).includes('539,90'));
  let payload;
  await p.route('**/api/create-checkout',async route=>{payload=route.request().postDataJSON();await route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({error:'Falha simulada do pagamento. Tente novamente.'})});});
  await p.getByRole('button',{name:'Pagar com InfinitePay'}).click();await p.getByRole('alert').filter({hasText:'Falha simulada'}).waitFor();assert.ok(await p.getByRole('button',{name:'Pagar com InfinitePay'}).isEnabled());assert.equal(payload.coupon,'');assert.equal(payload.shippingValue,39.9);
  await p.unroute('**/api/create-checkout');
  await p.route('**/api/create-checkout',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({checkoutUrl:base+'/handoff-test'})}));
  await p.route('**/handoff-test',route=>route.fulfill({status:200,contentType:'text/html',body:'<h1>Payment handoff test</h1>'}));
  await p.getByRole('button',{name:'Pagar com InfinitePay'}).click();await p.waitForURL('**/handoff-test');
  results.interactions.push('Four checkout stages, field focus/errors, UF validation, gating after edits, manual coupon, skip coupon, R$500 threshold, payment error/retry and mocked successful handoff');
  assert.deepEqual(results.errors,[]);
  fs.writeFileSync(artifacts+'/results.json',JSON.stringify(results,null,2));console.log('PASS all',results.routes.length,'layout checks;',results.interactions.length,'interaction groups; no uncaught JS errors');
}
run().catch(error=>{console.error(error);fs.writeFileSync(artifacts+'/failure.json',JSON.stringify({error:String(error),results},null,2));process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill();});
