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
let eligible = true, releases = 0, capturedSnapshot;
const identityPath = path.join(root,'lib/first-purchase.ts');
require.cache[identityPath] = {
  id: identityPath,
  filename: identityPath,
  loaded: true,
  exports: {
    reserveFirstPurchaseIdentity: async input => { capturedSnapshot = input.analytics; return { eligible, reason: 'Benefício já utilizado.' }; },
    releaseFirstPurchaseReservation: async () => { releases++; return true; },
    registerPurchaseOrder: async input => { capturedSnapshot = input.analytics; return true; },
  },
};
const {POST} = require('../app/api/create-checkout/route.ts');
const {getAllProducts} = require('../lib/products.ts');
const {shouldOfferFreeShipping, getShippingPrice} = require('../lib/shipping.ts');
const {POST: quoteShipping} = require('../app/api/frete/route.ts');
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
  const { productSearchScore } = require('../lib/product-search.ts');
  const { cartEnglish } = require('../lib/cart-copy.ts');
  for (const product of getAllProducts()) {
    assert.ok(productSearchScore(product, product.name) > 0, `Portuguese search: ${product.name}`);
    if (cartEnglish[product.name]) assert.ok(productSearchScore(product, cartEnglish[product.name]) > 0, `English search: ${cartEnglish[product.name]}`);
  }
  const house = getAllProducts().find(product => product.name === 'Casinha Luminária');
  for (const query of ['house', 'luminary', 'h', 'casinha', 'CASINHA LUMINÁRIA']) assert.ok(productSearchScore(house, query) > 0, `House search: ${query}`);
  assert.equal(productSearchScore(house, 'unrelated nonexistent item'), 0);
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

  // Somente o subtotal dos produtos define o frete, nunca o total com entrega.
  for (const subtotal of [0, 460.09, 460.10, 480, 499.99]) {
    assert.equal(shouldOfferFreeShipping(subtotal), false);
    assert.equal(getShippingPrice(subtotal), 39.9);
  }
  for (const subtotal of [500, 500.01, 960]) assert.equal(getShippingPrice(subtotal), 0);
  for (const subtotal of [NaN, Infinity, -1]) assert.equal(shouldOfferFreeShipping(subtotal), false);
  for (const productId of ['estatueta-iemanja', 'miniatura-quadrado-trancoso']) {
    const items = [{productId, quantity:1}];
    const quote = await quoteShipping(new Request('http://localhost/api/frete', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({cep:'45818000', items})}));
    const quoted = await quote.json();
    assert.equal(quoted.freeShipping, false);
    assert.equal(quoted.options[0].price, 39.9);
    const {status, data} = await checkout(items, '', {shippingValue:0});
    assert.equal(status, 200);
    assert.equal(data.subtotal, 480);
    assert.equal(data.shippingValue, 39.9);
    assert.equal(data.total, 519.9);
    assert.equal(payload.items.reduce((sum, item)=>sum+item.quantity*item.price,0), 51990);
    assert.equal(payload.items.at(-1).description,'Frete de entrega do pedido');
  }

  let cases=0;
  for (const price of [50,250,8500]) for (const quantity of [1,4,12]) for(const coupon of ['', 'AGO3']) {
    const product=getAllProducts().find(p=>p.price===price);assert.ok(product);
    const {status,data}=await checkout([{productId:product.id,quantity}],coupon,{shippingValue:0});
    assert.equal(status,200);const subtotal=(product.promotionalPrice??price)*quantity;const discount=coupon?Number((subtotal*.03).toFixed(2)):0;
    assert.equal(data.subtotal,subtotal);assert.equal(data.discount,discount);assert.equal(data.shippingValue,shouldOfferFreeShipping(subtotal)?0:39.9);
    assert.equal(payload.items.reduce((sum,i)=>sum+i.quantity*i.price,0),Math.round((subtotal-discount+data.shippingValue)*100));
    assert.equal(payload.customer.name,'Pessoa Teste');assert.equal(payload.customer.phone_number,'+5573999999999');assert.equal(payload.address.complement,'Destinatário: Pessoa Teste · CPF/CNPJ: 52998224725');assert.ok(payload.redirect_url.includes('/confirmacao?pedido='));assert.ok(payload.webhook_url.endsWith('/api/webhooks/infinitepay'));
    assert.equal(capturedSnapshot.valueCents, Math.round(data.total * 100));
    assert.equal(capturedSnapshot.items.reduce((sum,item)=>sum+item.unitPriceCents*item.quantity,0)+capturedSnapshot.shippingCents, capturedSnapshot.valueCents, 'snapshot must use charged discounted unit prices');
    assert.equal(capturedSnapshot.currency, 'BRL');
    cases++;
  }
  const id=getAllProducts()[0].id;
  assert.equal((await checkout([{productId:id,quantity:2}])).data.total,500);
  assert.equal((await checkout([{productId:id,quantity:2}],'AGO3')).data.total,485);
  assert.equal((await checkout([{productId:id,quantity:0}])).status,400);
  assert.equal((await checkout([{productId:'not-real',quantity:1}])).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'NOPE')).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'',{customer:{...customer,email:'bad'}})).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'',{customer:{...customer,document:'11111111111'}})).status,400);
  assert.equal((await checkout([{productId:id,quantity:1}],'',{customer:{...customer,address:{...customer.address,state:'ZZ'}}})).status,400);
  const alpha = await checkout([{productId:id,quantity:1}],'',{customer:{...customer,document:'00.000.000/E08G-12'}});
  assert.equal(alpha.status,200);assert.equal(payload.address.complement,'Destinatário: Pessoa Teste · CPF/CNPJ: 00000000E08G12');
  eligible=false;assert.equal((await checkout([{productId:id,quantity:1}],'AGO3')).status,409);eligible=true;
  fail=true;assert.equal((await checkout([{productId:id,quantity:1}],'AGO3')).status,502);assert.equal(releases,1);
  // Prazo deve vir da transportadora; ausência/falha não pode inventar dias.
  const {getShippingDeadlineQuote, getShippingDeadlineProviderState} = require('../lib/shipping-deadline.ts');
  for (const key of ['CORREIOS_TOKEN','CORREIOS_ACCESS_KEY','FRENET_TOKEN','SHIP_FROM_CEP','FRENET_SELLER_CEP','CORREIOS_SERVICE_CODE']) delete process.env[key];
  assert.equal(getShippingDeadlineProviderState().correiosConfigured, false);
  assert.equal(getShippingDeadlineProviderState().frenetConfigured, false);
  assert.equal(getShippingDeadlineProviderState().provider, 'Estimativa Agô');
  assert.equal((await getShippingDeadlineQuote({destinationCep:'01310100',subtotal:480})).estimated, true);
  process.env.CORREIOS_TOKEN = 'test-only';
  global.fetch = async (url) => {
    assert.equal(url.searchParams.get('cepOrigem'), '46098000');
    assert.equal(url.searchParams.get('cepDestino'), '01310100');
    return new Response(JSON.stringify({prazoEntrega:7,coProduto:'03298'}));
  };
  assert.equal((await getShippingDeadlineQuote({destinationCep:'01310100',subtotal:480})).deadline, 7);
  global.fetch = async () => new Response('{}', {status:503});
  assert.equal((await getShippingDeadlineQuote({destinationCep:'01310100',subtotal:480})).estimated, true);
  delete process.env.CORREIOS_TOKEN;
  process.env.FRENET_TOKEN = 'test-only';
  global.fetch = async () => new Response(JSON.stringify({ShippingSevicesArray:[
    {Carrier:'Outra transportadora',ServiceDescription:'Express',DeliveryTime:1},
    {Carrier:'Correios',ServiceDescription:'PAC',DeliveryTime:12},
    {Carrier:'Correios',ServiceDescription:'SEDEX',DeliveryTime:3},
    {Carrier:'Correios',ServiceDescription:'SEDEX',DeliveryTime:3,Error:true},
  ]}));
  const correiosViaFrenet = await getShippingDeadlineQuote({destinationCep:'01310100',subtotal:480});
  assert.equal(correiosViaFrenet.deadline, 12);
  assert.equal(correiosViaFrenet.serviceName, 'PAC');
  global.fetch = async () => new Response(JSON.stringify({ShippingSevicesArray:[
    {Carrier:'Correios',ServiceDescription:'SEDEX',DeliveryTime:3},
  ]}));
  assert.equal((await getShippingDeadlineQuote({destinationCep:'01310100',subtotal:480})).estimated, true, 'SEDEX must not be presented as a PAC deadline');
  console.log('PASS Correios origin/destination, provider outage without fabricated deadlines, and Correios-only Frenet services');
  console.log(`PASS ${cases} price/quantity/coupon combinations, recipient + CPF/CNPJ payload, official alphanumeric CNPJ, R$500 products-only shipping boundary, Iemanjá and Miniatura R$519.90 totals, clear shipping line, cent allocation, identity rejection, invalid data, provider failure`);
})().catch(error=>{console.error(error);process.exitCode=1});
