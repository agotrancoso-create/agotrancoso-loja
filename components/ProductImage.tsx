import Image, { type ImageProps } from 'next/image';

// Fotografias enviadas pela proprietária: usar a qualidade máxima do otimizador.
const MAX_QUALITY_PHOTOS = new Set([
  '/produtos/catalogo/casal-pretos-velhos-3.jpg',
  '/produtos/catalogo/colar-igreja-quadrado-frente.jpg',
  '/produtos/catalogo/mobile-trancoso-fundo-branco.jpg',
  '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg',
  '/produtos/catalogo/ima-igrejinha-trancoso-conjunto.jpg',
]);

export default function ProductImage(props: ImageProps) {
  const quality = typeof props.src === 'string' && MAX_QUALITY_PHOTOS.has(props.src)
    ? 100
    : props.quality;

  return <Image {...props} quality={quality} />;
}
