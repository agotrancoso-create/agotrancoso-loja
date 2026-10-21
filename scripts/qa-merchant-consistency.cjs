// Read-only validation against the production build or QA_BASE_URL. No payment calls.
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const resolve=Module._resolveFilename;
Module._resolveFilename=function(request,...rest){return resolve.call(this,request.startsWith('@/')?path.join(process.cwd(),request.slice(2)):request,...rest);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {getAllProducts,getEffectivePrice}=require('../lib/products.ts');
const {getAttentionOrderedImages}=require('../lib/merchandising.ts');
const {getShippingPrice}=require('../lib/shipping.ts');
const domain='https://www.agotrancoso.com.br';
const base=process.env.QA_BASE_URL || 'http://127.0.0.1:3114';
const server=process.env.QA_BASE_URL?null:spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3114'],{stdio:['ignore','pipe','pipe']});
const decode=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
const field=(xml,name)=>decode(xml.match(new RegExp(`<g:${name}>([\\s\\S]*?)</g:${name}>`))?.[1] || '');
async function get(route){const r=await fetch(base+route,{headers:{'User-Agent':'Twitterbot/1.0'}});assert.equal(r.status,200,route);return r.text();}
(async()=>{
 if(server) await new Promise((ok,no)=>{const timer=setTimeout(()=>no(new Error('Server timeout')),30000);server.stdout.on('data',d=>{if(d.toString().includes('Ready')){clearTimeout(timer);ok();}});server.on('exit',c=>no(new Error(`Server exit ${c}`)));});
 const xml=await get('/google-merchant.xml');
 const entries=xml.match(/<item>[\s\S]*?<\/item>/g)||[];
 const products=getAllProducts();assert.equal(entries.length,products.length);assert.equal(new Set(entries.map(e=>field(e,'id'))).size,products.length);
 const report=[];
 for(const p of products){
  const entry=entries.find(e=>field(e,'id')===p.id);assert.ok(entry,p.id);
  const url=`${domain}/produtos/${p.id}`;
  const effective=getEffectivePrice(p);
  const shipping=getShippingPrice(effective);
  for(const key of ['title','description','image_link','brand','material','google_product_category','product_type']) assert.ok(field(entry,key),`${p.id}: ${key}`);
  assert.equal(field(entry,'link'),url);assert.equal(field(entry,'mobile_link'),url);
  assert.equal(field(entry,'availability'),p.available?'in_stock':'out_of_stock');assert.equal(field(entry,'condition'),'new');
  assert.equal(field(entry,'price'),`${p.price.toFixed(2)} BRL`);
  assert.equal(field(entry,'sale_price'),p.promotionalPrice != null && p.promotionalPrice<p.price?`${p.promotionalPrice.toFixed(2)} BRL`:'');
  assert.equal(field(entry,'brand'),'Agô Trancoso');assert.equal(field(entry,'material'),'Cerâmica');
  const shippingXml=entry.match(/<g:shipping>([\s\S]*?)<\/g:shipping>/)[1];
  assert.equal(field(shippingXml,'country'),'BR');assert.equal(field(shippingXml,'price'),`${shipping.toFixed(2)} BRL`);
  const page=await get(`/produtos/${p.id}`);
  const scripts=[...page.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const product=scripts.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Product');assert.ok(product,p.id);
  assert.equal(product.name,p.name);assert.equal(product.description,p.description);assert.equal(product.sku,p.id);assert.equal(product.url,url);
  assert.equal(product.brand.name,'Agô Trancoso');assert.equal(product.offers.priceCurrency,'BRL');assert.equal(Number(product.offers.price),effective);
  assert.equal(product.offers.availability,`https://schema.org/${p.available?'InStock':'OutOfStock'}`);assert.equal(product.offers.itemCondition,'https://schema.org/NewCondition');assert.equal(product.offers.seller['@id'],`${domain}#organization`);
  assert.equal(Number(product.offers.shippingDetails.shippingRate.value),shipping);
  const images=getAttentionOrderedImages(p).map(image=>domain+image);
  assert.deepEqual(product.image,images);assert.equal(field(entry,'image_link'),images[0]);
  assert.deepEqual([...entry.matchAll(/<g:additional_image_link>(.*?)<\/g:additional_image_link>/g)].map(m=>decode(m[1])),images.slice(1,10));
  assert.ok(page.includes(`rel="canonical" href="${url}"`),`${p.id}: canonical`);
  assert.ok(page.includes(`property="og:url" content="${url}"`),`${p.id}: OG URL`);
  const priceBlock=page.match(/class="product-current-price"[^>]*>([\s\S]*?)<\/[^>]+>/)?.[1] || '';
  assert.ok(priceBlock.includes(effective.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})),`${p.id}: rendered price`);
  report.push({id:p.id,price:effective,availability:field(entry,'availability'),feedTitle:field(entry,'title'),pageName:product.name,ok:true});
 }
 const churchEntry=(id)=>{const entry=entries.find(e=>field(e,'id')===id);assert.ok(entry,id);return entry;};
 const pChurch=churchEntry('igreja-quadrado-p');
 const mChurch=churchEntry('igreja-quadrado-m');
 const ggChurch=churchEntry('igreja-quadrado-gg');
 const lightChurch=churchEntry('igrejinha-luminaria-trancoso');
 // Only genuine size variants are grouped. GG has an additional luminaire function.
 assert.equal(field(pChurch,'item_group_id'),'igreja-quadrado-trancoso');
 assert.equal(field(mChurch,'item_group_id'),'igreja-quadrado-trancoso');
 assert.equal(field(pChurch,'size'),'P');
 assert.equal(field(mChurch,'size'),'M');
 assert.equal(field(ggChurch,'item_group_id'),'');
 assert.equal(field(lightChurch,'item_group_id'),'');
 for(const [id,entry] of [['igreja-quadrado-p',pChurch],['igreja-quadrado-m',mChurch],['igreja-quadrado-gg',ggChurch],['igrejinha-luminaria-trancoso',lightChurch]]){
  const original=products.find(p=>p.id===id);assert.ok(original);
  assert.ok(field(entry,'title').includes('Quadrado de Trancoso'),id+': complete descriptive title');
  assert.ok(field(entry,'description').length>150,id+': substantive product description');
  assert.ok(entry.includes('<g:product_detail>'),id+': dimensions present');
  assert.ok(entry.includes('<g:attribute_value>'+original.dimensions+'</g:attribute_value>'),id+': dimensions match catalog');
 }
 assert.match(field(ggChurch,'title'),/Luminária/);
 assert.match(field(lightChurch,'title'),/Luminária/);
 for(const id of ['presepio-em-ceramica','terco-em-ceramica','rosario-trancoso','casal-pretos-velhos','estatueta-iemanja']) assert.ok(report.some(p=>p.id===id));
 fs.mkdirSync('/tmp/ago-qa',{recursive:true});fs.writeFileSync('/tmp/ago-qa/merchant-consistency.json',JSON.stringify(report,null,2));
 console.log(`PASS ${report.length} products: catalog/feed/page/JSON-LD prices, availability, images, shipping, canonical and religious pieces`);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>server?.kill());
