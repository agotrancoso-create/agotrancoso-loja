import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');
const EXPECTED_PRODUCT_COUNT = 19;
const EXPECTED_IMAGE_SIZE = 960;

const RETIRED_MINIATURA_IMAGES = new Set([
  '/produtos/miniatura-quadrado-trancoso.jpg',
  '/produtos/catalogo/miniatura-quadrado-trancoso-3.jpg',
]);

// Associações aprovadas pela proprietária. Não inferir produto pelo conteúdo ou
// nome histórico de outro arquivo: estas galerias são contrato de regressão.
const RUNTIME_GALLERIES = new Map([
  ['igreja-quadrado-p', [
    '/produtos/igreja-quadrado-p.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ]],
  ['igrejinha-luminaria-trancoso', [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
  ]],
  ['miniatura-quadrado-trancoso', [
    '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-6.webp',
    '/produtos/catalogo/miniatura-quadrado-trancoso-7.avif',
    '/produtos/catalogo/miniatura-quadrado-trancoso-5.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-2.jpg',
  ]],
]);

const EXPECTED_COVER_IMAGES = new Map([
  ['igreja-quadrado-p', '/produtos/igreja-quadrado-p.jpg'],
  ['igrejinha-luminaria-trancoso', '/produtos/igrejinha-luminaria-trancoso.jpg'],
  ['miniatura-quadrado-trancoso', '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg'],
]);

function fail(message) { throw new Error(`[catalog-audit] ${message}`); }
async function exists(file) { try { await fs.access(file); return true; } catch { return false; } }
function clean(value) { return String(value ?? '').trim(); }

const raw = await fs.readFile(PRODUCTS_FILE, 'utf8');
const catalog = JSON.parse(raw);
const products = Array.isArray(catalog.products) ? catalog.products : [];
const categories = Array.isArray(catalog.categories) ? catalog.categories : [];

if (!products.length) fail('catalogo sem produtos');
if (products.length !== EXPECTED_PRODUCT_COUNT) fail(`o catalogo premium deve manter exatamente ${EXPECTED_PRODUCT_COUNT} pecas; encontrado: ${products.length}`);
if (!categories.length) fail('catalogo sem categorias');

const categoryIds = new Set();
for (const category of categories) {
  if (!category?.id || typeof category.id !== 'string') fail('categoria sem id valido');
  if (categoryIds.has(category.id)) fail(`categoria duplicada: ${category.id}`);
  categoryIds.add(category.id);
  if (!clean(category?.name)) fail(`categoria sem nome: ${category.id}`);
}

const ids = new Set();
const referencedImages = new Set();
const issues = [];

for (const product of products) {
  const id = clean(product?.id);
  if (!id) { issues.push('produto sem id'); continue; }
  if (ids.has(id)) issues.push(`id duplicado: ${id}`);
  ids.add(id);

  if (!clean(product?.name)) issues.push(`${id}: nome vazio`);
  if (!clean(product?.description)) issues.push(`${id}: descricao vazia`);
  if (!Number.isFinite(product?.price) || product.price <= 0) issues.push(`${id}: preco invalido`);
  if (product.promotionalPrice != null && (!Number.isFinite(product.promotionalPrice) || product.promotionalPrice <= 0 || product.promotionalPrice >= product.price)) issues.push(`${id}: preco promocional invalido`);
  if (!categoryIds.has(product.category)) issues.push(`${id}: categoria inexistente (${product.category})`);
  if (typeof product.available !== 'boolean') issues.push(`${id}: campo available deve ser boolean`);

  const images = RUNTIME_GALLERIES.get(id) ?? (Array.isArray(product.images) ? product.images.filter(Boolean) : []);
  if (!images.length) { issues.push(`${id}: sem imagem de capa`); continue; }

  const expectedCover = EXPECTED_COVER_IMAGES.get(id);
  if (expectedCover && images[0] !== expectedCover) issues.push(`${id}: capa incorreta; esperado ${expectedCover}, encontrado ${images[0]}`);

  const expectedGallery = RUNTIME_GALLERIES.get(id);
  if (expectedGallery) {
    if (images.length !== expectedGallery.length || !expectedGallery.every((image, index) => images[index] === image)) {
      issues.push(`${id}: galeria aprovada foi alterada`);
    }
  }

  const gallerySeen = new Set();
  for (const image of images) {
    if (typeof image !== 'string' || !image.startsWith('/produtos/')) { issues.push(`${id}: caminho de imagem invalido (${String(image)})`); continue; }
    if (image.includes('..')) issues.push(`${id}: caminho de imagem inseguro (${image})`);
    if (gallerySeen.has(image)) issues.push(`${id}: imagem duplicada na galeria (${image})`);
    if (RETIRED_MINIATURA_IMAGES.has(image)) issues.push(`${id}: imagem aposentada voltou ao catalogo (${image})`);
    gallerySeen.add(image);
    referencedImages.add(image);
  }
}

for (const image of referencedImages) {
  const file = path.join(PUBLIC_DIR, image.replace(/^\/+/, ''));
  if (!(await exists(file))) { issues.push(`arquivo de imagem ausente: ${image}`); continue; }
  try {
    const metadata = await sharp(file, { failOn: 'none' }).metadata();
    if (metadata.width !== EXPECTED_IMAGE_SIZE || metadata.height !== EXPECTED_IMAGE_SIZE) issues.push(`imagem fora do padrao ${EXPECTED_IMAGE_SIZE}x${EXPECTED_IMAGE_SIZE}: ${image} (${metadata.width ?? '?'}x${metadata.height ?? '?'})`);
  } catch (error) {
    issues.push(`imagem ilegivel: ${image} (${error instanceof Error ? error.message : String(error)})`);
  }
}

for (const retired of RETIRED_MINIATURA_IMAGES) if (referencedImages.has(retired)) issues.push(`imagem aposentada ainda referenciada: ${retired}`);

if (issues.length) {
  console.error('\nAuditoria do catalogo encontrou problemas:');
  for (const issue of issues) console.error(`- ${issue}`);
  fail(`${issues.length} problema(s) encontrado(s)`);
}

console.log(`[catalog-audit] OK: ${products.length} produtos, ${categories.length} categorias, ${referencedImages.size} imagens ativas, todas ${EXPECTED_IMAGE_SIZE}x${EXPECTED_IMAGE_SIZE}.`);
console.log('[catalog-audit] Miniatura do Quadrado: novas fotos existem e ordem aprovada está protegida.');
console.log('[catalog-audit] Igrejinha P e Igrejinha Luminaria: galerias corretas e protegidas contra troca.');
