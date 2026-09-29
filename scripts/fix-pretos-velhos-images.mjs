import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const TARGET_SIZE = 960;
const INNER_SIZE = 860;
const IMAGES = [
  'public/produtos/catalogo/casal-pretos-velhos-1.jpg',
  'public/produtos/catalogo/casal-pretos-velhos-2.jpg',
  'public/produtos/catalogo/casal-pretos-velhos-3.jpg',
];

for (const relativePath of IMAGES) {
  const file = path.join(ROOT, relativePath);
  const temp = `${file}.ago-square.jpg`;

  // Remove apenas o excesso de fundo branco, nunca corta a peça.
  // Depois reenquadra a foto inteira no centro de um quadrado 960x960 com
  // respiro uniforme de 50px em todos os lados.
  await sharp(file, { failOn: 'error' })
    .rotate()
    .trim({ background: '#ffffff', threshold: 18 })
    .resize(INNER_SIZE, INNER_SIZE, {
      fit: 'contain',
      position: 'centre',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3,
    })
    .extend({
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(temp);

  await import('node:fs/promises').then(({ rename }) => rename(temp, file));
  console.log(`[Pretos-Velhos] ${relativePath} -> ${TARGET_SIZE}x${TARGET_SIZE}, foto inteira e centralizada`);
}
