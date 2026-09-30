import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PRODUCTS_JSON = path.join(ROOT, 'data', 'products.json');
const TARGET_SIZE = 960;

// Assets antigos ou incorretos que não devem voltar à experiência ativa.
const RETIRED_ASSETS = new Set([
  '/produtos/galeria/ima-igrejinha-trancoso-2.jpg',
]);

// Casos que devam permanecer byte-a-byte podem ser adicionados aqui.
const KEEP_ORIGINAL_ASSETS = new Set([]);

// Fotos aprovadas que devem preencher o quadro 960 × 960 sem faixas laterais.
// O recorte é limitado ao fundo excedente e mantém a peça centralizada, sem esticar.
const SQUARE_CROP_ASSETS = new Set([
  '/produtos/casinha-luminaria.jpg',
]);

// Arquivos usados por associações históricas corrigidas em lib/products.ts ou
// por curadoria fotográfica que não aparece diretamente no JSON-base.
const EXTRA_ACTIVE_ASSETS = [
  '/produtos/igrejinha-luminaria-trancoso.jpg',
  '/produtos/igreja-quadrado-p.jpg',
  '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  '/produtos/catalogo/casal-pretos-velhos-1.jpg',
  '/produtos/catalogo/casal-pretos-velhos-2.jpg',
  '/produtos/catalogo/casal-pretos-velhos-3.jpg',
  '/produtos/casinha-luminaria.jpg',
  '/produtos/catalogo/miniatura-quadrado-trancoso-6.avif',
  '/produtos/catalogo/miniatura-quadrado-trancoso-7.avif',
];

function publicPathToFile(src) {
  return path.join(PUBLIC_DIR, src.replace(/^\/+/, ''));
}

function zoomMasterFile(src) {
  return path.join(PUBLIC_DIR, 'zoom', src.replace(/^\/+/, ''));
}

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function preserveZoomMaster(src, file) {
  const zoomFile = zoomMasterFile(src);
  if (await fileExists(zoomFile)) return;
  await fs.mkdir(path.dirname(zoomFile), { recursive: true });
  await fs.copyFile(file, zoomFile);
  console.log(`[zoom] master original preservado: ${src}`);
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
      const value = data[0] ?? 255;
      return [value, value, value];
    }
    return [data[0], data[1], data[2]];
  }));

  const average = [0, 1, 2].map((channel) => Math.round(
    pixels.reduce((sum, pixel) => sum + pixel[channel], 0) / pixels.length,
  ));

  return { r: average[0], g: average[1], b: average[2], alpha: 1 };
}

function encodeForExtension(pipeline, extension) {
  if (extension === '.jpg' || extension === '.jpeg') {
    return pipeline.jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true });
  }
  if (extension === '.png') {
    return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  }
  if (extension === '.webp') {
    return pipeline.webp({ quality: 100, smartSubsample: true });
  }
  if (extension === '.avif') {
    return pipeline.avif({ quality: 100, chromaSubsampling: '4:4:4' });
  }
  return pipeline;
}

async function writeNormalized(file, output) {
  const temp = `${file}.ago-960.tmp`;
  await fs.writeFile(temp, output);
  await fs.rename(temp, file);
}

async function normalizeImage(src) {
  const file = publicPathToFile(src);
  if (!(await fileExists(file))) {
    console.warn(`[960x960] arquivo não encontrado: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  // O lightbox usa este master para não ampliar uma versão já redimensionada.
  // A cópia acontece antes de qualquer transformação e não é sobrescrita numa
  // segunda passagem do prebuild.
  await preserveZoomMaster(src, file);

  const base = sharp(file, { failOn: 'none' });
  const metadata = await base.metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  if (!width || !height) {
    console.warn(`[960x960] não foi possível ler dimensões: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  if (KEEP_ORIGINAL_ASSETS.has(src)) {
    return { missing: 0, resized: 0, skipped: 1 };
  }

  const extension = path.extname(file).toLowerCase();

  if (SQUARE_CROP_ASSETS.has(src) && (width !== TARGET_SIZE || height !== TARGET_SIZE)) {
    let pipeline = base.rotate().resize(TARGET_SIZE, TARGET_SIZE, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    });
    pipeline = encodeForExtension(pipeline, extension);
    await writeNormalized(file, await pipeline.toBuffer());
    console.log(`[960x960] ${src}: ${width}x${height} -> ${TARGET_SIZE}x${TARGET_SIZE} (preenchimento integral, sem deformar)`);
    return { missing: 0, resized: 1, skipped: 0 };
  }

  if (width === TARGET_SIZE && height === TARGET_SIZE) {
    return { missing: 0, resized: 0, skipped: 1 };
  }

  const background = await cornerColor(base, width, height);
  const { data: fitted, info } = await base.rotate().resize(TARGET_SIZE, TARGET_SIZE, {
    fit: 'inside',
    withoutEnlargement: true,
    kernel: sharp.kernel.lanczos3,
  }).toBuffer({ resolveWithObject: true });

  const left = Math.floor((TARGET_SIZE - info.width) / 2);
  const top = Math.floor((TARGET_SIZE - info.height) / 2);
  const right = TARGET_SIZE - info.width - left;
  const bottom = TARGET_SIZE - info.height - top;
  const edge = sharp(fitted);
  const layers = [{ input: fitted, left, top }];

  if (left) layers.push({ input: await edge.clone().extract({ left: 0, top: 0, width: 1, height: info.height }).resize(left, info.height, { kernel: 'nearest' }).toBuffer(), left: 0, top });
  if (right) layers.push({ input: await edge.clone().extract({ left: info.width - 1, top: 0, width: 1, height: info.height }).resize(right, info.height, { kernel: 'nearest' }).toBuffer(), left: left + info.width, top });
  if (top) layers.push({ input: await edge.clone().extract({ left: 0, top: 0, width: info.width, height: 1 }).resize(info.width, top, { kernel: 'nearest' }).toBuffer(), left, top: 0 });
  if (bottom) layers.push({ input: await edge.clone().extract({ left: 0, top: info.height - 1, width: info.width, height: 1 }).resize(info.width, bottom, { kernel: 'nearest' }).toBuffer(), left, top: top + info.height });

  let pipeline = sharp({ create: { width: TARGET_SIZE, height: TARGET_SIZE, channels: 3, background } }).composite(layers);
  pipeline = encodeForExtension(pipeline, extension);

  const output = await pipeline.toBuffer();
  await writeNormalized(file, output);
  console.log(`[960x960] ${src}: ${width}x${height} -> ${TARGET_SIZE}x${TARGET_SIZE} (qualidade máxima)`);
  return { missing: 0, resized: 1, skipped: 0 };
}

async function main() {
  const catalog = JSON.parse(await fs.readFile(PRODUCTS_JSON, 'utf8'));
  const active = new Set(EXTRA_ACTIVE_ASSETS);

  for (const product of catalog.products ?? []) {
    for (const src of product.images ?? []) {
      if (typeof src !== 'string' || !src.startsWith('/produtos/')) continue;
      if (RETIRED_ASSETS.has(src)) continue;
      active.add(src);
    }
  }

  for (const retired of RETIRED_ASSETS) active.delete(retired);

  let resized = 0;
  let skipped = 0;
  let missing = 0;
  for (const src of [...active].sort()) {
    const result = await normalizeImage(src);
    resized += result.resized;
    skipped += result.skipped;
    missing += result.missing;
  }

  console.log(`[960x960] concluído: ${resized} redimensionadas, ${skipped} mantidas sem alterações, ${missing} ausentes.`);
  if (missing) process.exitCode = 1;
}

main().catch((error) => {
  console.error('[960x960] falha ao normalizar imagens:', error);
  process.exitCode = 1;
});
