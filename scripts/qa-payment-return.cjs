// Checks the payment return without creating a checkout or charging anyone.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  return resolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);

let expectedOrder = null;
const identityPath = path.join(root, 'lib/first-purchase.ts');
require.cache[identityPath] = {
  id: identityPath, filename: identityPath, loaded: true,
  exports: { getFirstPurchaseOrder: async () => expectedOrder },
};
const { POST } = require('../app/api/verify-payment/route.ts');
let requests = 0;
let providerResponse = { success: true, paid: true, amount: 25000 };
global.fetch = async (url, options) => {
  assert.equal(url, 'https://api.checkout.infinitepay.io/payment_check');
  assert.equal(options.cache, 'no-store');
  assert.deepEqual(JSON.parse(options.body), {
    handle: 'ago-trancoso', order_nsu: 'AGO-123', transaction_nsu: 'transaction-123', slug: 'invoice-123',
  });
  requests++;
  return new Response(JSON.stringify(providerResponse), { status: 200 });
};

async function check(body, status, confirmed) {
  const response = await POST(new Request('http://localhost/api/verify-payment', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }));
  assert.equal(response.status, status);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.deepEqual(await response.json(), { confirmed });
}

(async () => {
  await check({ orderNsu: 'foreign', transactionNsu: 'transaction-123', slug: 'invoice-123' }, 400, false);
  assert.equal(requests, 0);
  const details = { orderNsu: 'AGO-123', transactionNsu: 'transaction-123', slug: 'invoice-123' };
  await check(details, 200, true);
  providerResponse = { success: true, paid: false };
  await check(details, 200, false);
  assert.equal(requests, 2);

  const firstPurchase = { ...details, orderNsu: 'AGO-FP-123' };
  global.fetch = async (_url, options) => {
    assert.equal(JSON.parse(options.body).order_nsu, firstPurchase.orderNsu);
    return new Response(JSON.stringify({ success: true, paid: true, amount: 25000 }), { status: 200 });
  };
  await check(firstPurchase, 422, false);
  expectedOrder = { expectedAmountCents: 25100 };
  await check(firstPurchase, 422, false);
  expectedOrder.expectedAmountCents = 25000;
  await check(firstPurchase, 200, true);
  console.log('PASS payment return: invalid order, paid, pending, first-purchase missing/wrong/correct amount');
})().catch(error => { console.error(error); process.exitCode = 1; });
