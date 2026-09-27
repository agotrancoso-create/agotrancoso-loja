import Image, { type ImageProps } from 'next/image';

// Fotografia é o principal ativo visual da Agô. Hero e imagens de produto usam
// sempre a qualidade máxima permitida pelo otimizador do Next. O dimensionamento
// responsivo continua ativo para não sacrificar performance desnecessariamente.
function shouldUseMaximumQuality(src: ImageProps['src']) {
  return typeof src === 'string' && (src === '/hero.jpg' || src.startsWith('/produtos/'));
}

export default function ProductImage(props: ImageProps) {
  const quality = shouldUseMaximumQuality(props.src) ? 100 : props.quality;
  return <Image {...props} quality={quality} />;
}
