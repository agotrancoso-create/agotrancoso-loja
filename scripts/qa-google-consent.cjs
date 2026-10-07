// Isolated fake GA4 destination: never contacts Google or enters a production build.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('lib/marketing-analytics.ts', 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const storage = new Map();
let consent = 'essential';
function runtime(id) {
  const calls = [], listeners = [];
  const window = {location:{origin:'https://example.test'},dataLayer:[],gtag:(...args)=>calls.push(args),localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},addEventListener:(event,fn)=>listeners.push(fn)};
  const exports = {};
  vm.runInNewContext(code, {exports,window,URL,process:{env:{NEXT_PUBLIC_GA4_MEASUREMENT_ID:id}},require:()=>({CONSENT_EVENT:'ago:privacy-consent',readPrivacyConsent:()=>consent})});
  return {exports,window,calls,grant(){consent='all';listeners.forEach(fn=>fn());}};
}
const purchase = {transactionId:'AGO-QA-CONSENT',value:519.9,shipping:39.9,items:[{item_id:'miniatura',item_name:'Miniatura',price:480,quantity:1}]};
let r = runtime('G-QATESTONLY');
r.exports.trackPurchase(purchase);
assert.equal(r.calls.length,0,'essential must send no GA4 request');
assert.equal(r.window.dataLayer.filter(e=>e.event==='purchase').length,1,'verified local receipt is recorded once');
assert.ok(!storage.has('ago_purchase_ga4_v1_G-QATESTONLY_AGO-QA-CONSENT'),'an unsent receipt must not be marked delivered');
r.grant();
assert.equal(r.calls.filter(c=>c[1]==='purchase').length,1);
assert.equal(r.calls[0][2].send_to,'G-QATESTONLY');
r.exports.trackPurchase(purchase);
assert.equal(r.calls.length,1,'same-document repeat');
r = runtime('G-QATESTONLY');
r.exports.trackPurchase(purchase);
assert.equal(r.calls.length,0,'reload repeat');
consent='essential';
r.exports.trackAddToCart(purchase.items[0]);
assert.equal(r.calls.length,0,'revocation blocks ecommerce');
consent='all';
r.exports.trackAddToCart(purchase.items[0]);
assert.equal(r.calls[0][2].send_to,'G-QATESTONLY');
for (const id of ['', 'AW-18232525092','invalid']) {
 const unconfigured=runtime(id);
 unconfigured.exports.trackPurchase({...purchase,transactionId:`AGO-QA-${id || 'EMPTY'}`});
 unconfigured.exports.trackBeginCheckout(purchase.items,519.9);
 assert.equal(unconfigured.calls.length,0,'no fallback to AW or fictitious GA4');
}
console.log('PASS GA4 destination, consent/revocation, delayed purchase consent, persistent dedupe and missing/invalid GA4');
