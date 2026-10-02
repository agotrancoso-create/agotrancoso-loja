import Image, { type ImageProps } from 'next/image';

// Preserve maximum quality by default for product photography, while allowing
// pages to explicitly request a lighter responsive derivative when performance
// matters (for example the mobile hero and below-the-fold home imagery).
function shouldDefaultToMaximumQuality(src: ImageProps['src']) {
  return typeof src === 'string' && src.startsWith('/produtos/');
}

export default function ProductImage(props: ImageProps) {
  const quality = props.quality ?? (shouldDefaultToMaximumQuality(props.src) ? 100 : undefined);
  return <Image {...props} quality={quality} />;
}
