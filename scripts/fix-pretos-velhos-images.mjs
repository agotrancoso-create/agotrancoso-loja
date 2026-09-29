import path from 'node:path';
import sharp from 'sharp';
import { rename } from 'node:fs/promises';

const ROOT = process.cwd();
const TARGET_SIZE = 960;
const IMAGES = [
  'public/produtos/catalogo/casal-pretos-velhos-1.jpg',
  'public/produtos/catalogo/casal-pretos-velhos-2.jpg',
  'public/produtos/catalogo/casal-pretos-velhos-3.jpg',
];

for (const relativePath of IMAGES) {
  const file = path.join(ROOT, relativePath);
  const temp = `${file}.ago-square.jpg`;

  // Remove apenas o excesso de fundo branco externo e preserva a peça inteira.
  // Não adiciona moldura/padding artificial. O próprio fundo branco da foto
  // completa o quadrado apenas quando a proporção original exigir.
  await sharp(file, { failOn: 'error' })
    .rotate()
    .trim({ background: '#ffffff', threshold: 18 })
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: 'contain',
      position: 'centre',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(temp);

  await rename(temp, file);
  console.log(`[Pretos-Velhos] ${relativePath} -> ${TARGET_SIZE}x${TARGET_SIZE}, peça inteira, centralizada e sem borda artificial`);
}
