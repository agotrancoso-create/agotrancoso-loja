/* Quality gate for all real Agô Trancoso product photographs. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const all = require('../data/products.json').products;
const map = require('../data/premium-photo-map.json');
const report = require('../data/premium-photo-report.json');
const productsTs = fs.readFileSync(path.join(root, 'lib/products.ts'), 'utf8');
const merchandising = fs.readFileSync(path.join(root, 'lib/merchandising.ts'), 'utf8');
const lightbox = fs.readFileSync(path.join(root, 'components/PhotoLightbox.tsx'), 'utf8');
const section = productsTs.split('const RECOVERED_PRODUCT_GALLERIES')[1].split('};')[0];
const overrides = {};
const matches = [...section.matchAll(/'([^']+)'\s*:\s*\[([^\]]+)\]/gs)];
for (const [, id, source] of matches) {
  overrides[id] = [...source.matchAll(/['"](\/produtos\/[^'"]+)['"]/g)].map((m) => m[1]);
}
const active = new Set(all.flatMap((p) => overrides[p.id] ?? p.images));
assert.equal(all.length, 19, 'Official catalog must remain 19 real products');
assert.equal(active.size, 38, 'Exactly 38 active gallery photos should exist');
assert.deepEqual(Object.keys(map).sort(), [...active].sort(), 'All active gallery photos must be mapped');
assert.equal(new Set(Object.values(map)).size, 38, 'Every original requires its own premium version');
assert.equal(report.length, 38, 'A validation report is needed for all images');
assert(productsTs.includes('premiumMap[src] ?? src'), 'Product gallery must use premium map');
assert(merchandising.includes('premiumMap[src] ?? src'), 'Approved merchandising cover order must be retained');
assert(lightbox.includes("src.startsWith('/produtos/premium/') return src") ||
       lightbox.includes("src.startsWith('/produtos/premium/')) return src"),
       'Zoom must open the same premium photograph');

(async () => {
  for (const [original, premium] of Object.entries(map)) {
    assert(premium.startsWith('/produtos/premium/'), 'Premium image must live in premium dir');
    const sourcePath = path.join(root, 'public', original.slice(1));
    const premiumPath = path.join(root, 'public', premium.slice(1));
    assert(fs.existsSync(sourcePath), 'Original missing: ' + original);
    assert(fs.existsSync(premiumPath), 'Premium image missing: ' + premium);
    const data = await sharp(premiumPath).metadata();
    assert.equal(data.format, 'webp', 'Use WebP: ' + premium);
    assert.equal(data.width, data.height, 'Keep square 1:1: ' + premium);
    assert(data.width >= 900, 'Maintain zoom resolution: ' + premium);
    const item = report.find((entry) => entry.source === original);
    assert(item && item.premium === premium && item.verified_lossless,
      'Lossless verification absent: ' + original);
    assert(item.protected_pixels > 3000, 'Piece protection too small: ' + original);
  }
  console.log('[premium-photo] PASS: 38 original photos preserved, lossless square output and zoom/curation mapping');
})().catch((err) => {
  console.error('[premium-photo] FAIL:', err);
  process.exitCode = 1;
});
