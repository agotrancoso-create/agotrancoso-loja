// Tests monetary rules and the server's actual InfinitePay payload with a fake provider.
// Does not call external services, persist customer identities or create live payments.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname,'..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request,...rest) { return resolve.call(this,request.startsWith('@/')?path.join(root,request.slice(2)):request,...rest); };
require.extensions['.ts'] = (module,filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,filename);
let eligible = true, releases = 0;
const identityPath = path.join(root,'lib/first-purchase.ts');
require.cache[identityPath] = {
  id: identityPath,
  filename: identityPath,
  loaded: true,
  exports: {
    reserveFirstPurchaseIdentity: async () => ({ eligible, reason: 'Benefício já utilizado.' }),
    releaseFirstPurchaseReservation: async () => { releases++; return true; },
    registerPurchaseOrder: async () => true,
  },
};
const {POST} = require('../app/api/create-checkout/route.ts');
const {getAllProducts} = require('../lib/products.ts');
const {shouldOfferFreeShipping} = require('../lib/shipping.ts');
const {isValidCPF,isValidCNPJ,getBrazilianDocumentType} = require('../lib/checkout-validation.ts');
let payload, fail=false;
global.fetch = async(url,options) => {
  assert.equal(url,'https://api.checkout.infinitepay.io/links');
  payload=JSON.parse(options.body);
  return new Response(JSON.stringify(fail?{message:'Provider test failure'}:{url:'https://checkout.infinitepay.io/test-only'}),{status:fail?502:200});
};
const customer = { name:'Pessoa Teste',email:'teste@example.com',phone:'73999999999',document:'52998224725',address:{zip:'45818000',street:'Rua Teste',number:'10',neighborhood:'Centro',city:'Porto Seguro',state:'BA'} };
async function checkout(items,coupon='',overrides={}) {
  const response=await POST(new Request('http://localhost/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,coupon,customer,...overrides})}));
  return {status:response.status,data:await response.json()};
}
(async()=>{
  assert.equal(isValidCPF('529.982.247-25'),true);
  assert.equal(getBrazilianDocumentType('529.982.247-25'),'CPF');
  assert.equal(isValidCPF('111.111.111-11'),false);
  assert.equal(isValidCNPJ('11.222.333/0001-81'),true);
  assert.equal(getBrazilianDocumentType('11.222.333/0001-81'),'CNPJ');
  assert.equal(isValidCNPJ('12.ABC.345/01DE-35'),true);
  // Primeiro CNPJ alfanumérico oficial gerado pela Receita Federal em 31/07/2026.
  assert.equal(isValidCNPJ('00.000.000/E08G-12'),true);
  assert.equal(getBrazilianDocumentType('00.000.000/E08G-12'),'CNPJ');
  assert.equal(isValidCNPJ('00.000.000/E08G-13'),false);
  assert.equal(shouldOfferFreeShipping(500),false);assert.equal(shouldOfferFreeShipping(500.01),true);
  let cases=0;
  for (const price of [50,250,8500]) for (const quantity of [1,4,12]) for(const coupon of ['', 'AGO3']) {
    const product=getAllProducts().find(p=>p.price===price);assert.ok(product);
    const {status,data}=await checkout([{productId:product.id,quantity}],coupon,{shippingValue:0});
    assert.equal(status,200);const subtotal=(product.promotionalPrice??price)*quantity;const discount=coupon?Number((subtotal*.03).toFixed(2)):0;
    assert.equal(data.subtotal,subtotal);assert.equal(data.discount,discount);assert.equal(data.shippingValue,subtotal>500?0:39.9);
    assert.equal(payload.items.reduce((sum,i)=>sum+i.quantity*i.price,0),Math.round((subtotal-discount+data.shippingValue)*100));
    assert.equal(payload.customer.phone_number,'+5573999999999');assert.equal(payload.address.complement,'CPF/CNPJ: 52998224725');assert.ok(payload.redirect_url.includes('/confirmacao?pedido='));assert.ok(payload.webhook_url.endsWith('/api/webhooks/infinitepay'));
    cases++;
  }
  const id=getAllProducts()[0].id;
  assert.equal((await checkout([{productId:id,quantity:2}])).data.total,539.9);
  assert.equal((await checkout([{productId:id,quantity:2}],'AGO3')).data.total,524.9);
  assert.equal((await checkout([{productId:id,quantity:0}])).status,400);
  assert.equal((await checkout([{productId:'not-real',quantity:1}])).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'NOPE')).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'',{customer:{...customer,email:'bad'}})).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'',{customer:{...customer,document:'11111111111'}})).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'',{customer:{...customer,address:{...customer.address,state:'ZZ'}}})).status,400);
  const alpha = await checkout([{productId:id,quantity:1}],'',{customer:{...customer,document:'00.000.000/E08G-12'}});
  assert.equal(alpha.status,200);assert.equal(payload.address.complement,'CPF/CNPJ: 00000000E08G12');
  eligible=false;assert.equal((await checkout([{productId:id,quantity:1}],'AGO3')).status,409);eligible=true;
  fail=true;assert.equal((await checkout([{productId:id,quantity:1}],'AGO3')).status,502);assert.equal(releases,1);
  console.log(`PASS ${cases} price/quantity/coupon combinations, CPF/CNPJ validation, official alphanumeric CNPJ, cent allocation, shipping boundary, identity rejection, invalid data, provider failure`);
})().catch(error=>{console.error(error);process.exitCode=1});