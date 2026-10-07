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
  const payload = JSON.parse(options.body);
  assert.equal(payload.handle, 'ago-trancoso');
  assert.ok(payload.order_nsu.startsWith('AGO-'));
  assert.equal(payload.transaction_nsu, 'transaction-123');
  assert.equal(payload.slug, 'invoice-123');
  requests++;
  return new Response(JSON.stringify(providerResponse), { status: 200 });
};

async function call(body, expectedStatus) {
  const response = await POST(new Request('http://localhost/api/verify-payment', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  }));
  assert.equal(response.status, expectedStatus);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  return response.json();
}

(async () => {
  assert.deepEqual(
    await call({ orderNsu: 'foreign', transactionNsu: 'transaction-123', slug: 'invoice-123' }, 400),
    { confirmed: false },
  );
  assert.equal(requests, 0);

  const details = { orderNsu: 'AGO-123', transactionNsu: 'transaction-123', slug: 'invoice-123' };
  assert.deepEqual(await call(details, 200), {
    confirmed: true,
    purchase: { transactionId: 'AGO-123', currency: 'BRL', value: 250 },
  });

  providerResponse = { success: true, paid: false };
  assert.deepEqual(await call(details, 200), { confirmed: false });

  providerResponse = { success: true, paid: true, amount: 25000 };
  expectedOrder = { expectedAmountCents: 25100 };
  assert.deepEqual(await call(details, 422), { confirmed: false });

  expectedOrder = {
    expectedAmountCents: 25000,
    analytics: {
      currency: 'BRL',
      valueCents: 25000,
      shippingCents: 0,
      items: [{ itemId: 'igreja-quadrado-p', itemName: 'Igreja do Quadrado (P)', unitPriceCents: 25000, quantity: 1, itemCategory: 'igrejinhas' }],
    },
  };
  assert.deepEqual(await call(details, 200), {
    confirmed: true,
    purchase: {
      transactionId: 'AGO-123',
      currency: 'BRL',
      value: 250,
      shipping: 0,
      items: [{ item_id: 'igreja-quadrado-p', item_name: 'Igreja do Quadrado (P)', price: 250, quantity: 1, item_category: 'igrejinhas' }],
    },
  });

  expectedOrder = null;
  const firstPurchase = { ...details, orderNsu: 'AGO-FP-123' };
  assert.deepEqual(await call(firstPurchase, 200), {
    confirmed: true,
    purchase: { transactionId: 'AGO-FP-123', currency: 'BRL', value: 250 },
  });

  providerResponse = { success: true, paid: true, amount: 'invalid' };
  assert.deepEqual(await call(details, 422), { confirmed: false });

  console.log('PASS payment return: only verified paid transactions produce authoritative BRL purchase values; stored orders enforce amount equality');
})().catch(error => { console.error(error); process.exitCode = 1; });
