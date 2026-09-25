import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PRODUCTS_JSON = path.join(ROOT, 'data', 'products.json');
const TARGET_SIZE = 960;

// Miniaturas antigas de poucos KB. Elas não devem voltar a ser usadas nem ser
// ampliadas artificialmente, porque upscale não recupera detalhe que não existe.
const LOW_RES_ASSETS = new Set([
  '/produtos/galeria/ima-igrejinha-trancoso-2.jpg',
  '/produtos/galeria/casal-pretos-velhos-3.jpg',
]);

// Arquivos usados por associações históricas corrigidas em lib/products.ts.
const EXTRA_ACTIVE_ASSETS = [
  '/produtos/igrejinha-luminaria-trancoso.jpg',
  '/produtos/igreja-quadrado-p.jpg',
  '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  '/produtos/catalogo/casal-pretos-velhos-1.jpg',
  '/produtos/catalogo/casal-pretos-velhos-2.jpg',
  '/produtos/casal-pretos-velhos.jpg',
];

function publicPathToFile(src) {
  return path.join(PUBLIC_DIR, src.replace(/^\/+/, ''));
}

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function cornerColor(image, width, height) {
  const points = [
    { left: 0, top: 0 },
    { left: Math.max(0, width - 1), top: 0 },
    { left: 0, top: Math.max(0, height - 1) },
    { left: Math.max(0, width - 1), top: Math.max(0, height - 1) },
  ];

  const pixels = await Promise.all(points.map(async ({ left, top }) => {
    const { data, info } = await image.clone()
      .extract({ left, top, width: 1, height: 1 })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.channels < 3) {
      const v = data[0] ?? 255;
      return [v, v, v];
    }
    return [data[0], data[1], data[2]];
  }));

  const average = [0, 1, 2].map((channel) => Math.round(
    pixels.reduce((sum, pixel) => sum + pixel[channel], 0) / pixels.length,
  ));

  return { r: average[0], g: average[1], b: average[2], alpha: 1 };
}

async function normalizeImage(src) {
  const file = publicPathToFile(src);
  if (!(await fileExists(file))) {
    console.warn(`[960x960] arquivo não encontrado: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  const base = sharp(file, { failOn: 'none' });
  const metadata = await base.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (!width || !height) {
    console.warn(`[960x960] não foi possível ler dimensões: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  // A solicitação é normalizar somente imagens que não são quadradas.
  if (width === height) {
    return { missing: 0, resized: 0, skipped: 1 };
  }

  const background = await cornerColor(base, width, height);
  let pipeline = base
    .rotate()
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: 'contain',
      position: 'centre',
      background,
      withoutEnlargement: false,
    });

  const extension = path.extname(file).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 94, chromaSubsampling: '4:4:4', mozjpeg: true });
  } else if (extension === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else if (extension === '.webp') {
    pipeline = pipeline.webp({ quality: 94, smartSubsample: true });
  }

  const output = await pipeline.toBuffer();
  const temp = `${file}.ago-960.tmp`;
  await fs.writeFile(temp, output);
  await fs.rename(temp, file);
  console.log(`[960x960] ${src}: ${width}x${height} -> ${TARGET_SIZE}x${TARGET_SIZE}`);
  return { missing: 0, resized: 1, skipped: 0 };
}

async function main() {
  const catalog = JSON.parse(await fs.readFile(PRODUCTS_JSON, 'utf8'));
  const active = new Set(EXTRA_ACTIVE_ASSETS);

  for (const product of catalog.products ?? []) {
    for (const src of product.images ?? []) {
      if (typeof src !== 'string' || !src.startsWith('/produtos/')) continue;
      if (LOW_RES_ASSETS.has(src)) continue;
      active.add(src);
    }
  }

  for (const bad of LOW_RES_ASSETS) active.delete(bad);

  let resized = 0;
  let skipped = 0;
  let missing = 0;
  for (const src of [...active].sort()) {
    const result = await normalizeImage(src);
    resized += result.resized;
    skipped += result.skipped;
    missing += result.missing;
  }

  console.log(`[960x960] concluído: ${resized} redimensionadas, ${skipped} já quadradas, ${missing} ausentes.`);
}

main().catch((error) => {
  console.error('[960x960] falha ao normalizar imagens:', error);
  process.exitCode = 1;
});
