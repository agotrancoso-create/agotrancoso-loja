import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public');
const PRODUCTS_JSON = path.join(ROOT, 'data', 'products.json');
const TARGET_SIZE = 960;

const RETIRED_ASSETS = new Set([
  '/produtos/galeria/ima-igrejinha-trancoso-2.jpg',
]);

const KEEP_ORIGINAL_ASSETS = new Set([]);

const SQUARE_CROP_ASSETS = new Set([
  '/produtos/casinha-luminaria.jpg',
]);

const SMART_TRIM_ASSETS = new Set([
  '/produtos/catalogo/casal-pretos-velhos-1.jpg',
]);

const EXTRA_ACTIVE_ASSETS = [
  '/produtos/igrejinha-luminaria-trancoso.jpg',
  '/produtos/igreja-quadrado-p.jpg',
  '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  '/produtos/catalogo/casal-pretos-velhos-1.jpg',
  '/produtos/catalogo/casal-pretos-velhos-2.jpg',
  '/produtos/catalogo/casal-pretos-velhos-3.jpg',
  '/produtos/casinha-luminaria.jpg',
  '/produtos/catalogo/miniatura-quadrado-trancoso-6.webp',
  '/produtos/catalogo/miniatura-quadrado-trancoso-7.avif',
];

function publicPathToFile(src) {
  return path.join(PUBLIC_DIR, src.replace(/^\/+/, ''));
}

async function fileExists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function writeNormalized(file, output) {
  const temp = `${file}.ago-960.tmp`;
  await fs.writeFile(temp, output);
  await fs.rename(temp, file);
}

async function encodeBytesForFile(decoded, file) {
  const extension = path.extname(file).toLowerCase();
  if (extension === '.webp') return sharp(decoded).webp({ quality: 100, smartSubsample: true }).toBuffer();
  if (extension === '.avif') return sharp(decoded).avif({ quality: 95, effort: 6 }).toBuffer();
  if (extension === '.jpg' || extension === '.jpeg') return sharp(decoded).jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
  if (extension === '.png') return sharp(decoded).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  return decoded;
}

async function decodeAccidentalBase64Image(file, src) {
  const original = await fs.readFile(file);
  let candidate = original;

  // Tenta a imagem original e, se necessário, até três camadas de base64.
  for (let depth = 0; depth <= 3; depth += 1) {
    try {
      const metadata = await sharp(candidate, { failOn: 'none' }).metadata();
      if (metadata.width && metadata.height) {
        if (depth === 0) return candidate;
        const normalized = await encodeBytesForFile(candidate, file);
        await writeNormalized(file, normalized);
        const repaired = await sharp(normalized, { failOn: 'none' }).metadata();
        console.log(`[imagem] ${src}: ${depth} camada(s) base64 removida(s), imagem recuperada (${repaired.width}x${repaired.height})`);
        return normalized;
      }
    } catch {}

    const text = candidate.toString('utf8').replace(/[^A-Za-z0-9+/=]/g, '');
    if (text.length < 100) break;
    const decoded = Buffer.from(text, 'base64');
    if (!decoded.length || decoded.equals(candidate)) break;
    candidate = decoded;
  }

  return original;
}

async function cornerColor(image, width, height) {
  const points = [
    { left: 0, top: 0 },
    { left: Math.max(0, width - 1), top: 0 },
    { left: 0, top: Math.max(0, height - 1) },
    { left: Math.max(0, width - 1), top: Math.max(0, height - 1) },
  ];

  const pixels = await Promise.all(points.map(async ({ left, top }) => {
    const { data, info } = await image.clone().extract({ left, top, width: 1, height: 1 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    if (info.channels < 3) {
      const value = data[0] ?? 255;
      return [value, value, value];
    }
    return [data[0], data[1], data[2]];
  }));

  const average = [0, 1, 2].map((channel) => Math.round(pixels.reduce((sum, pixel) => sum + pixel[channel], 0) / pixels.length));
  return { r: average[0], g: average[1], b: average[2], alpha: 1 };
}

function encodeForExtension(pipeline, extension) {
  if (extension === '.jpg' || extension === '.jpeg') return pipeline.jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true });
  if (extension === '.png') return pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  if (extension === '.webp') return pipeline.webp({ quality: 100, smartSubsample: true });
  if (extension === '.avif') return pipeline.avif({ quality: 95, effort: 6 });
  return pipeline;
}

async function normalizeImage(src) {
  const file = publicPathToFile(src);
  if (!(await fileExists(file))) {
    console.warn(`[960x960] arquivo não encontrado: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  const bytes = await decodeAccidentalBase64Image(file, src);
  const base = sharp(bytes, { failOn: 'none' });
  let metadata;
  try {
    metadata = await base.metadata();
  } catch {
    console.warn(`[960x960] imagem ilegível: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) {
    console.warn(`[960x960] não foi possível ler dimensões: ${src}`);
    return { missing: 1, resized: 0, skipped: 0 };
  }

  if (KEEP_ORIGINAL_ASSETS.has(src)) return { missing: 0, resized: 0, skipped: 1 };

  const extension = path.extname(file).toLowerCase();

  if (SMART_TRIM_ASSETS.has(src)) {
    let pipeline = sharp(bytes, { failOn: 'none' })
      .rotate()
      .trim({ background: '#ffffff', threshold: 18 })
      .resize(860, 860, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        kernel: sharp.kernel.lanczos3,
      })
      .extend({ top: 50, bottom: 50, left: 50, right: 50, background: { r: 255, g: 255, b: 255, alpha: 1 } });
    pipeline = encodeForExtension(pipeline, extension);
    await writeNormalized(file, await pipeline.toBuffer());
    console.log(`[960x960] ${src}: reenquadrada em 960x960, peça maior e sem deformação`);
    return { missing: 0, resized: 1, skipped: 0 };
  }

  if (SQUARE_CROP_ASSETS.has(src) && (width !== TARGET_SIZE || height !== TARGET_SIZE)) {
    let pipeline = base.rotate().resize(TARGET_SIZE, TARGET_SIZE, { fit: 'cover', position: 'centre', kernel: sharp.kernel.lanczos3 });
    pipeline = encodeForExtension(pipeline, extension);
    await writeNormalized(file, await pipeline.toBuffer());
    console.log(`[960x960] ${src}: ${width}x${height} -> ${TARGET_SIZE}x${TARGET_SIZE} (preenchimento integral, sem deformar)`);
    return { missing: 0, resized: 1, skipped: 0 };
  }

  if (width === TARGET_SIZE && height === TARGET_SIZE) return { missing: 0, resized: 0, skipped: 1 };

  const background = await cornerColor(base, width, height);
  const { data: fitted, info } = await base.rotate().resize(TARGET_SIZE, TARGET_SIZE, { fit: 'inside', withoutEnlargement: true, kernel: sharp.kernel.lanczos3 }).toBuffer({ resolveWithObject: true });

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
  await writeNormalized(file, await pipeline.toBuffer());
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
