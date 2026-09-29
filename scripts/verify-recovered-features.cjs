const assert = require('node:assert/strict');
const fs = require('node:fs');
const products = fs.readFileSync('lib/products.ts','utf8');
const merch = fs.readFileSync('lib/merchandising.ts','utf8');
const shipping = fs.readFileSync('lib/shipping.ts','utf8');
const trancoso = fs.readFileSync('app/trancoso/page.tsx','utf8');
const footer = fs.readFileSync('components/Footer.tsx','utf8');
const pretos = fs.readFileSync('scripts/fix-pretos-velhos-images.mjs','utf8');
const popup = fs.readFileSync('components/FirstPurchaseOffer.tsx','utf8');
const firstPurchase = fs.readFileSync('lib/first-purchase.ts','utf8');
const checkoutValidation = fs.readFileSync('lib/checkout-validation.ts','utf8');
const paymentCss = fs.readFileSync('app/offer-premium.css','utf8');

const pBlock = products.match(/'igreja-quadrado-p': \[(.*?)\],/s)?.[1] ?? '';
const luminariaBlock = products.match(/'igrejinha-luminaria-trancoso': \[(.*?)\],/s)?.[1] ?? '';
const merchPBlock = merch.match(/'igreja-quadrado-p': \[(.*?)\],/s)?.[1] ?? '';
const merchLuminariaBlock = merch.match(/'igrejinha-luminaria-trancoso': \[(.*?)\],/s)?.[1] ?? '';

// Associação VISUAL aprovada: os nomes históricos dos dois arquivos estão invertidos.
assert.ok(pBlock.includes("/produtos/igrejinha-luminaria-trancoso.jpg"));
assert.ok(!pBlock.includes("/produtos/igreja-quadrado-p.jpg"));
assert.ok(luminariaBlock.includes("/produtos/igreja-quadrado-p.jpg"));
assert.ok(!luminariaBlock.includes("/produtos/igrejinha-luminaria-trancoso.jpg"));
assert.ok(merchPBlock.includes("/produtos/igrejinha-luminaria-trancoso.jpg"));
assert.ok(merchLuminariaBlock.includes("/produtos/igreja-quadrado-p.jpg"));

assert.ok(products.includes('Miniatura do Quadrado de Trancoso para Pendurar'));
assert.ok(products.includes('miniatura-quadrado-trancoso-6.webp'));
assert.ok(products.includes('miniatura-quadrado-trancoso-7.webp'));
assert.ok(products.includes('Casal de Pretos-Velhos em cerâmica artesanal da Agô Trancoso, Bahia'));
assert.ok(merch.indexOf("'casal-pretos-velhos'") < merch.indexOf("'casinha-luminaria'"));
assert.ok(shipping.includes('subtotalCents + FIXED_SHIPPING_PRICE_CENTS > FREE_SHIPPING_THRESHOLD_CENTS'));
assert.ok(trancoso.includes('Artesanato e Cerâmica em Trancoso'));
assert.ok(footer.includes('href="/trancoso"'));

// Pretos-Velhos: mostrar a peça inteira, centralizada e sem recorte por cover.
assert.ok(pretos.includes("fit: 'contain'"));
assert.ok(pretos.includes("position: 'centre'"));
assert.ok(pretos.includes('top: 50'));
assert.ok(!pretos.includes("fit: 'cover'"));

assert.ok(popup.includes('Seu primeiro pedido merece um benefício especial.'));
assert.ok(firstPurchase.includes('documentKey'));
assert.ok(checkoutValidation.includes('isValidCNPJ'));
assert.ok(paymentCss.includes('Pix Copia e Cola'));
console.log('PASS recovered failed-deploy intentions, visual mappings and current business rules');
