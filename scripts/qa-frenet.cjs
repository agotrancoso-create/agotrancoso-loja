// Synthetic provider fixtures only: no external quote, payment or label purchase.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request,...rest) { return resolve.call(this,request.startsWith('@/')?path.join(root,request.slice(2)):request,...rest); };
require.extensions['.ts'] = (module,filename) => module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,filename);
const identityPath = path.join(root,'lib/first-purchase.ts');
require.cache[identityPath] = {id:identityPath,filename:identityPath,loaded:true,exports:{registerPurchaseOrder:async()=>true}};
const {quoteSedex,verifySedexQuote} = require('../lib/frenet-shipping.ts');
const {POST:checkout} = require('../app/api/create-checkout/route.ts');
const items = [{productId:'igreja-quadrado-p',quantity:1}];
let calls = 0, body, payment, outage = false;
let rates = [
  {Carrier:'Correios',ServiceCode:'test-pac',ServiceDescription:'PAC',ShippingPrice:'30.00',DeliveryTime:'8',Error:false},
  {Carrier:'Correios',ServiceCode:'test-sedex',ServiceDescription:'SEDEX',ShippingPrice:'50.00',DeliveryTime:'3',Error:false},
];
global.fetch = async (url,options) => {
  calls++;
  if (url.includes('infinitepay')) { payment = JSON.parse(options.body); return Response.json({url:'https://example.com/test-payment'}); }
  assert.equal(url,'https://api.frenet.com.br/shipping/quote');
  assert.equal(options.headers.token,'synthetic-test-token');
  body = JSON.parse(options.body);
  if(outage) throw new Error('Synthetic outage');
  return Response.json({ShippingSevicesArray:rates});
};
(async()=>{
  delete process.env.FRENET_TOKEN;
  assert.equal(await quoteSedex(items,'45818000',250),null);
  assert.equal(calls,0);
  Object.assign(process.env,{FRENET_TOKEN:'synthetic-test-token',FRENET_SELLER_CEP:'45818000',FRENET_PAC_SERVICE_CODE:'test-pac',FRENET_SEDEX_SERVICE_CODE:'test-sedex',FRENET_PACKAGES_JSON:'{}'});
  assert.equal(await quoteSedex(items,'45818000',250),null);
  assert.equal(calls,0);
  process.env.FRENET_PACKAGES_JSON=JSON.stringify({'igreja-quadrado-p':{weight:1,width:20,height:25,length:30}});
  const quote=await quoteSedex(items,'45818000',250);
  assert.equal(quote.price,59.9); assert.equal(quote.surcharge,20); assert.equal(quote.deadline,3);
  assert.equal(body.ShippingItemArray[0].Quantity,1);
  assert.equal(body.ShippingItemArray[0].Weight,1);
  assert.equal(body.ShipmentInvoiceValue,250);
  assert.equal(verifySedexQuote(quote.token,items,'45818000',250),59.9);
  assert.equal(verifySedexQuote(quote.token,items,'01001000',250),null);
  assert.equal(verifySedexQuote(quote.token,[{...items[0],quantity:2}],'45818000',250),null);
  assert.equal(verifySedexQuote(quote.token,items,'45818000',251),null);
  assert.equal(verifySedexQuote(quote.token+'x',items,'45818000',250),null);
  const now=Date.now; Date.now=()=>now()+16*60*1000;
  assert.equal(verifySedexQuote(quote.token,items,'45818000',250),null); Date.now=now;
  const free=await quoteSedex([{...items[0],quantity:2}],'45818000',500);
  assert.equal(free.price,20); assert.equal(free.surcharge,20);
  rates[1].ShippingPrice='20.00';
  assert.equal((await quoteSedex(items,'45818000',250)).price,39.9);
  rates[1].Error=true; assert.equal(await quoteSedex(items,'45818000',250),null);
  rates[1].Error=false; rates[1].ShippingPrice='NaN'; assert.equal(await quoteSedex(items,'45818000',250),null);
  rates[1].ShippingPrice='50.00'; outage=true; assert.equal(await quoteSedex(items,'45818000',250),null); outage=false;
  const customer={name:'Pessoa Teste',email:'teste@example.com',phone:'73999999999',document:'52998224725',address:{zip:'45818000',street:'Rua Teste',number:'10',neighborhood:'Centro',city:'Porto Seguro',state:'BA'}};
  async function pay(overrides={}) { return checkout(new Request('http://localhost/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,customer,shippingMethod:'SEDEX',shippingQuote:quote.token,shippingValue:0,...overrides})})); }
  let result=await pay(); assert.equal(result.status,200); assert.equal((await result.json()).shippingValue,59.9);
  assert.equal(payment.items.at(-1).price,5990); assert.equal(payment.items.at(-1).description,'Frete Correios SEDEX'); assert.match(payment.order_nsu,/AGO-SEDEX-/);
  const before=calls; assert.equal((await pay({shippingQuote:'forged'})).status,409); assert.equal(calls,before);
  assert.equal((await pay({shippingMethod:'unknown'})).status,400);
  result=await pay({shippingMethod:'PAC'}); assert.equal(result.status,200); assert.equal((await result.json()).shippingValue,39.9);
  console.log('PASS Frenet: missing config, actual parcels, PAC/SEDEX difference, free PAC, no negative surcharge, provider failures, quote tampering/expiry/cart/CEP binding and server-authoritative payment total');
})().catch(error=>{console.error(error);process.exitCode=1;});
