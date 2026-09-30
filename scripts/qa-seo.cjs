// HTTP checks: crawlers must receive products and sharing metadata without running JS.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:3105';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3105'], {stdio:['ignore','pipe','pipe']});
const ready = new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('SEO QA server timeout')),30000);
  server.stdout.on('data',data=>{if(data.toString().includes('Ready')){clearTimeout(timer);resolve();}});
  server.on('exit',code=>{clearTimeout(timer);reject(new Error(`SEO QA server exited ${code}`));});
});
async function html(path){const response=await fetch(base+path,{headers:{'User-Agent':'Twitterbot/1.0'}});assert.equal(response.status,200,path);return response.text();}
function meta(page, key){const tags=page.match(/<meta\b[^>]*>/g)||[];return tags.find(tag=>tag.includes(`property="${key}"`)||tag.includes(`name="${key}"`));}
(async()=>{
  await ready;
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
    assert.ok(page.includes('Compartilhar esta peça'));
  }
  console.log('PASS server-rendered catalog, complete price ranges and filters; social images, canonical URLs, product sharing and Google shipping metadata');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>server.kill());
