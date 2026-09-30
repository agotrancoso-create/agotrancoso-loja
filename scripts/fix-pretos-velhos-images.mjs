import path from 'node:path';
import sharp from 'sharp';
import { rename } from 'node:fs/promises';

const ROOT = process.cwd();
const TARGET_SIZE = 960;

// Pedido específico da proprietária: somente a terceira foto recebe o
// reenquadramento especial. As fotos 1 e 2 não são alteradas por este script.
const IMAGES = [
  'public/produtos/catalogo/casal-pretos-velhos-3.jpg',
];

for (const relativePath of IMAGES) {
  const file = path.join(ROOT, relativePath);
  const temp = `${file}.ago-square.jpg`;

  // Remove o excesso de fundo externo, amplia a peça até o máximo que cabe no
  // quadrado e preserva 100% da cerâmica. Não cria moldura, padding decorativo,
  // recorte da peça ou deformação.
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
  console.log(`[Pretos-Velhos] foto 3 -> ${TARGET_SIZE}x${TARGET_SIZE}, completa, centralizada, preenchida ao máximo e sem borda`);
}
