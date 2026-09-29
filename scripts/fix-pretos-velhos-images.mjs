import path from 'node:path';
import sharp from 'sharp';

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
  const isThirdPhoto = relativePath.endsWith('casal-pretos-velhos-3.jpg');

  await sharp(file, { failOn: 'error' })
    .rotate()
    .trim({ background: '#ffffff', threshold: 18 })
    .resize(TARGET_SIZE, TARGET_SIZE, {
      fit: 'cover',
      // A terceira foto foi ajustada a pedido da proprietária: o casal fica no
      // centro geométrico do quadro. Nenhum padding, moldura ou faixa é criado.
      position: isThirdPhoto ? 'centre' : 'attention',
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: 100, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(temp);

  await import('node:fs/promises').then(({ rename }) => rename(temp, file));
  console.log(`[Pretos-Velhos] ${relativePath} -> 960x960, centralizada e sem borda artificial`);
}
