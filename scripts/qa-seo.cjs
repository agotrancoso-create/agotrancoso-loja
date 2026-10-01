// HTTP checks: crawlers must receive products and sharing metadata without running JS.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:3105';
const INDEXNOW_KEY = '7c9f4d6a3e2b1c8f5a0d9e6b4c7f2a31';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3105'], {stdio:['ignore','pipe','pipe']});
const ready = new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('SEO QA server timeout')),30000);
  server.stdout.on('data',data=>{if(data.toString().includes('Ready')){clearTimeout(timer);resolve();}});
  server.on('exit',code=>{clearTimeout(timer);reject(new Error(`SEO QA server exited ${code}`));});
});
async function response(path, headers={}){const res=await fetch(base+path,{headers});assert.equal(res.status,200,path);return res;}
async function html(path){return (await response(path,{'User-Agent':'Twitterbot/1.0'})).text();}
function meta(page, key){const tags=page.match(/<meta\b[^>]*>/g)||[];return tags.find(tag=>tag.includes(`property="${key}"`)||tag.includes(`name="${key}"`));}
(async()=>{
  await ready;
  const home=await html('/');
  const contact=await html('/contato');
  assert.ok(home.includes('https://wa.me/5573998558124?'), 'Home must use the complete business WhatsApp');
  assert.ok(home.includes('\"telephone\":\"+5573998558124\"'), 'Google must receive the same contact number');
  assert.ok(!contact.includes('46098-000'), 'Do not display the shipping-origin postal code as a store address');

  const googlebotMeta=meta(home,'googlebot')||'';
  assert.ok(googlebotMeta.includes('max-image-preview:large'),'Googlebot must be allowed large image previews');
  assert.ok(googlebotMeta.includes('max-snippet:-1'),'Googlebot must be allowed full snippets');
  assert.ok(googlebotMeta.includes('max-video-preview:-1'),'Googlebot must be allowed full video previews');

  const robots=await (await response('/robots.txt',{'User-Agent':'SEO-QA'})).text();
  for(const crawler of ['Googlebot','Googlebot-Image','Bingbot','OAI-SearchBot','ChatGPT-User']){
    assert.ok(robots.includes(`User-Agent: ${crawler}`)||robots.includes(`User-agent: ${crawler}`),`robots.txt must explicitly allow ${crawler}`);
  }
  assert.ok(robots.includes('https://www.agotrancoso.com.br/sitemap.xml'),'robots.txt must expose the canonical sitemap');
  assert.ok(robots.includes('https://www.agotrancoso.com.br/image-sitemap.xml'),'robots.txt must expose the image sitemap');

  const indexNowKey=(await (await response(`/${INDEXNOW_KEY}.txt`)).text()).trim();
  assert.equal(indexNowKey,INDEXNOW_KEY,'IndexNow ownership key must be publicly verifiable');

  const catalog=await html('/produtos');
  assert.equal((catalog.match(/<article\b/g)||[]).length,19,'Catalog must include 19 product cards in server HTML');
  assert.ok(catalog.includes('href="/produtos/estatueta-iemanja"'));
  const filtered=await html('/produtos?ate=150&categoria=decoracao');
  assert.equal((filtered.match(/<article\b/g)||[]).length,1,'Server filters must match the client');
  assert.ok(filtered.includes('href="/produtos/esfera-decorativa"'));
  const premium=await html('/produtos?ate=above-3000');
  assert.equal((premium.match(/<article\b/g)||[]).length,1,'Above R$ 3.000 filter must render server-side');
  assert.ok(premium.includes('href="/produtos/igreja-quadrado-gg"'));
  assert.ok(!premium.includes('href="/produtos/nossa-senhora-grande"'),'R$ 3.000 belongs to the up-to-R$3.000 range');
  for(const path of ['/decoracao-em-ceramica','/produtos','/nossa-essencia','/contato','/produtos/estatueta-iemanja','/produtos/miniatura-quadrado-trancoso']){
    const page=await html(path);
    assert.ok(meta(page,'og:image')?.includes('https://www.agotrancoso.com.br/'),`Missing absolute social image: ${path}`);
    assert.ok(meta(page,'twitter:image'),`Missing Twitter image: ${path}`);
    assert.ok(meta(page,'og:title'),`Missing social title: ${path}`);
    assert.ok(page.includes(`rel="canonical" href="https://www.agotrancoso.com.br${path}"`),`Canonical: ${path}`);
  }
  for(const id of ['estatueta-iemanja','miniatura-quadrado-trancoso']){
    const page=await html('/produtos/'+id);
    const scripts=[...page.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
    const product=scripts.flatMap(data=>data['@graph']||[data]).find(data=>data['@type']==='Product');
    assert.equal(product.offers.shippingDetails.shippingRate.value,'39.90',`Google shipping: ${id}`);
    assert.ok(page.includes('Adicionar à sacola'), `Purchase CTA must remain server-rendered: ${id}`);
    assert.ok(page.includes('Frete e prazo para seu CEP'), `CEP estimator must remain visible: ${id}`);
    assert.ok(!page.includes('Compartilhar esta peça'), `Legacy share copy must stay removed: ${id}`);
    assert.ok(!page.includes('Dúvidas sobre a compra'), `Legacy purchase FAQ must stay removed: ${id}`);
    assert.ok(!page.includes('International shipping'), `Legacy international card must stay removed: ${id}`);
  }
  console.log('PASS global crawler access, IndexNow ownership, server-rendered catalog, filters, social images, canonical URLs, clean PDP and Google shipping metadata');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.kill());
