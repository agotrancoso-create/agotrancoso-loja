const assert = require('node:assert/strict');
const fs = require('node:fs');
const products = fs.readFileSync('lib/products.ts','utf8');
const merch = fs.readFileSync('lib/merchandising.ts','utf8');
const shipping = fs.readFileSync('lib/shipping.ts','utf8');
const trancoso = fs.readFileSync('app/trancoso/page.tsx','utf8');
const home = fs.readFileSync('app/page.tsx','utf8');
const header = fs.readFileSync('components/Header.tsx','utf8');
const footer = fs.readFileSync('components/Footer.tsx','utf8');
const checkout = fs.readFileSync('app/checkout/page.tsx','utf8');
const productPage = fs.readFileSync('app/produtos/[id]/page.tsx','utf8');
const addToCart = fs.readFileSync('app/produtos/[id]/AddToCart.tsx','utf8');
const deadline = fs.readFileSync('lib/shipping-deadline.ts','utf8');
const pretos = fs.readFileSync('scripts/fix-pretos-velhos-images.mjs','utf8');
const normalizer = fs.readFileSync('scripts/normalize-product-images.mjs','utf8');
const gallery = fs.readFileSync('components/ProductGallery.tsx','utf8');
const lightbox = fs.readFileSync('components/PhotoLightbox.tsx','utf8');
const cart = fs.readFileSync('components/CartDrawer.tsx','utf8');
const finalCss = fs.readFileSync('app/final-overrides.css','utf8');
// Whitespace is not a visual contract: accept expanded or compact CSS.
const finalLastCss = fs.readFileSync('app/purchase-clarity.css','utf8').replace(/:\s*/g, ': ').replace(/\s*!important/g, ' !important');
const popup = fs.readFileSync('components/FirstPurchaseOffer.tsx','utf8');
const firstPurchase = fs.readFileSync('lib/first-purchase.ts','utf8');
const checkoutValidation = fs.readFileSync('lib/checkout-validation.ts','utf8');
const paymentCss = fs.readFileSync('app/offer-premium.css','utf8');

const pBlock = products.match(/'igreja-quadrado-p': \[(.*?)\],/s)?.[1] ?? '';
const luminariaBlock = products.match(/'igrejinha-luminaria-trancoso': \[(.*?)\],/s)?.[1] ?? '';
const merchPBlock = merch.match(/'igreja-quadrado-p': \[(.*?)\],/s)?.[1] ?? '';
const merchLuminariaBlock = merch.match(/'igrejinha-luminaria-trancoso': \[(.*?)\],/s)?.[1] ?? '';

// Associação VISUAL aprovada: os nomes históricos dos dois arquivos estão invertidos.
assert.ok(pBlock.includes('/produtos/igrejinha-luminaria-trancoso.jpg'));
assert.ok(!pBlock.includes('/produtos/igreja-quadrado-p.jpg'));
assert.ok(luminariaBlock.includes('/produtos/igreja-quadrado-p.jpg'));
assert.ok(!luminariaBlock.includes('/produtos/igrejinha-luminaria-trancoso.jpg'));
assert.ok(merchPBlock.includes('/produtos/igrejinha-luminaria-trancoso.jpg'));
assert.ok(merchLuminariaBlock.includes('/produtos/igreja-quadrado-p.jpg'));

// Miniatura: título, uso e duas fotos novas devem permanecer no catálogo.
assert.ok(products.includes('Miniatura do Quadrado de Trancoso para Pendurar'));
const miniatura = JSON.parse(fs.readFileSync('data/products.json', 'utf8')).products.find(product => product.id === 'miniatura-quadrado-trancoso');
assert.equal(miniatura.name, 'Miniatura do Quadrado de Trancoso para Pendurar');
assert.match(miniatura.description, /pendurar na parede/i);
assert.match(miniatura.description, /apoiar/i);
assert.ok(products.includes('miniatura-quadrado-trancoso-6.avif'));
assert.ok(products.includes('miniatura-quadrado-trancoso-7.avif'));
assert.ok(products.includes('Comprimento: 19 cm · Altura com a cruz da igrejinha do meio: 6,5 cm'));

// Pretos-Velhos: somente a foto 3 recebe reenquadramento especial e fica sem borda.
assert.ok(products.includes('Casal de Pretos-Velhos em cerâmica artesanal da Agô Trancoso, Bahia'));
assert.ok(pretos.includes('casal-pretos-velhos-3.jpg'));
assert.ok(!pretos.includes('casal-pretos-velhos-1.jpg'));
assert.ok(!pretos.includes('casal-pretos-velhos-2.jpg'));
assert.ok(pretos.includes("fit: 'contain'"));
assert.ok(pretos.includes("position: 'centre'"));
assert.ok(!pretos.includes("fit: 'cover'"));
assert.ok(!pretos.includes('.extend('));
assert.ok(gallery.includes('data-product-id={productId}'));
assert.ok(gallery.includes('data-photo-index={active + 1}'));
assert.ok(finalCss.includes('data-product-id="casal-pretos-velhos"'));
assert.ok(finalLastCss.includes('data-photo-index="3"'));
assert.ok(finalLastCss.includes('border-radius: 0 !important'));
assert.ok(finalLastCss.includes('object-fit: contain !important'));

// Frete: somente produtos contam para o mínimo de R$ 500,00.
assert.ok(shipping.includes('FREE_SHIPPING_SUBTOTAL_MINIMUM = FREE_SHIPPING_THRESHOLD'));
assert.ok(shipping.includes('FREE_SHIPPING_THRESHOLD * 100'));
assert.ok(shipping.includes('subtotalCents >= FREE_SHIPPING_SUBTOTAL_MINIMUM_CENTS'));
// Cópia de limiar permanece nos pontos globais de confiança e checkout; a PDP evita repetição desnecessária.
const shippingCopyFiles = [header, footer, checkout, cart];
assert.ok(!home.includes('produtos + frete atingem'));
for (const source of [...shippingCopyFiles, productPage, addToCart]) {
  assert.ok(!source.includes('pedido com frete atinge'));
  assert.ok(!source.includes('produtos + frete atingem'));
}
for (const source of shippingCopyFiles) {
  assert.ok(source.includes('a partir de R$ 500 em produtos'));
}
assert.ok(addToCart.includes('getShippingPrice(selectionSubtotal)'));
assert.ok(addToCart.includes("fetch('/api/frete'"));
assert.ok(addToCart.includes('Frete e prazo estimado para seu CEP'));
assert.ok(addToCart.includes('Estimativa de entrega'));
assert.ok(addToCart.includes('O prazo final é confirmado na postagem.'));
assert.ok(deadline.includes('getEstimatedDeadline'));
assert.ok(deadline.includes("provider: 'Estimativa Agô'"));

// Zoom: preserva o master original antes da normalização e usa o arquivo sem recompressão no lightbox.
assert.ok(normalizer.includes('preserveZoomMaster'));
assert.ok(lightbox.includes('function zoomSource'));
assert.ok(lightbox.includes('unoptimized'));

// Hero original, legível e consistente; foto institucional completa, imóvel, sem borda e com cantos arredondados.
assert.ok(/<Image[\s\S]*?\bpriority\b/.test(home), 'Home needs a priority photograph');
for (const [, path] of home.matchAll(/src="(\/[^"]+)"/g)) {
  assert.ok(fs.existsSync(`public${path}`), `Missing home image: ${path}`);
}
assert.ok(home.includes('unoptimized'), 'Preserve original hero photography');
assert.ok(home.includes('ago-story-static-photo') || home.includes('ago-storytelling-photo') || home.includes('ago-banca-proof-gallery'), 'Home must show real institutional photography');
assert.ok(finalLastCss.includes('.ago-cinematic-copy h1'));
assert.ok(finalLastCss.includes('text-shadow:'));
assert.ok(finalLastCss.includes('.ago-story-image .ago-complementary-photo'));
assert.ok(finalLastCss.includes('border: 0 !important'));
assert.ok(finalLastCss.includes('border-radius: 18px !important'));
assert.ok(finalLastCss.includes('object-fit: contain !important'));

// SEO/localidade e intenção comercial.
assert.ok(trancoso.includes('Cerâmica em Trancoso'));
assert.ok(trancoso.includes('Artesanato em Trancoso'));
assert.ok(home.includes('Cerâmica em Trancoso | Igrejinhas do Quadrado'));
assert.ok(home.includes("SEARCH_HERO_IMAGE = '/produtos/igreja-quadrado-p.jpg'"));
assert.ok(footer.includes('href="/trancoso"'));

// Primeira compra, documentos brasileiros e orientação de Pix continuam protegidos.
assert.ok(popup.includes('Seu primeiro pedido merece um benefício especial.'));
assert.ok(firstPurchase.includes('documentKey'));
assert.ok(checkoutValidation.includes('isValidCNPJ'));
assert.ok(paymentCss.includes('Pix Copia e Cola'));

console.log('PASS recovered failed-deploy intentions, visual mappings and current business rules');
