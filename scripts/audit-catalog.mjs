import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PRODUCTS_FILE = path.join(ROOT, 'data', 'products.json');

function fail(message) {
  throw new Error(`[catalog-audit] ${message}`);
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

const raw = await fs.readFile(PRODUCTS_FILE, 'utf8');
const catalog = JSON.parse(raw);
const products = Array.isArray(catalog.products) ? catalog.products : [];
const categories = Array.isArray(catalog.categories) ? catalog.categories : [];

if (!products.length) fail('catalogo sem produtos');
if (!categories.length) fail('catalogo sem categorias');

const categoryIds = new Set();
for (const category of categories) {
  if (!category?.id || typeof category.id !== 'string') fail('categoria sem id valido');
  if (categoryIds.has(category.id)) fail(`categoria duplicada: ${category.id}`);
  categoryIds.add(category.id);
  if (!category?.name || typeof category.name !== 'string' || !category.name.trim()) fail(`categoria sem nome: ${category.id}`);
}

const ids = new Set();
const referencedImages = new Set();
const issues = [];

for (const product of products) {
  const id = String(product?.id ?? '').trim();
  if (!id) { issues.push('produto sem id'); continue; }
  if (ids.has(id)) issues.push(`id duplicado: ${id}`);
  ids.add(id);

  if (!String(product?.name ?? '').trim()) issues.push(`${id}: nome vazio`);
  if (!Number.isFinite(product?.price) || product.price <= 0) issues.push(`${id}: preco invalido`);
  if (product.promotionalPrice != null && (!Number.isFinite(product.promotionalPrice) || product.promotionalPrice <= 0 || product.promotionalPrice >= product.price)) {
    issues.push(`${id}: preco promocional invalido`);
  }
  if (!categoryIds.has(product.category)) issues.push(`${id}: categoria inexistente (${product.category})`);
  if (typeof product.available !== 'boolean') issues.push(`${id}: campo available deve ser boolean`);

  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  if (!images.length) {
    issues.push(`${id}: sem imagem de capa`);
    continue;
  }

  const gallerySeen = new Set();
  for (const image of images) {
    if (typeof image !== 'string' || !image.startsWith('/produtos/')) {
      issues.push(`${id}: caminho de imagem invalido (${String(image)})`);
      continue;
    }
    if (image.includes('..')) issues.push(`${id}: caminho de imagem inseguro (${image})`);
    if (gallerySeen.has(image)) issues.push(`${id}: imagem duplicada na galeria (${image})`);
    gallerySeen.add(image);
    referencedImages.add(image);
  }
}

for (const image of referencedImages) {
  const file = path.join(PUBLIC_DIR, image.replace(/^\/+/, ''));
  if (!(await exists(file))) issues.push(`arquivo de imagem ausente: ${image}`);
}

if (issues.length) {
  console.error('\nAuditoria do catálogo encontrou problemas:');
  for (const issue of issues) console.error(`- ${issue}`);
  fail(`${issues.length} problema(s) encontrado(s)`);
}

console.log(`[catalog-audit] OK: ${products.length} produtos, ${categories.length} categorias, ${referencedImages.size} imagens referenciadas.`);
