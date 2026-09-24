'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

type ProductGalleryProps = { name: string; images: string[] };

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const safeImages = images.filter(Boolean).length ? images.filter(Boolean) : ['/images/placeholder.svg'];
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  const go = (next: number) => setActive((next + safeImages.length) % safeImages.length);

  return (
    <div className="product-gallery" aria-label={`Galeria de ${name}`}>
      <div
        className="product-gallery-main"
        onTouchStart={(e) => { touchStart.current = e.changedTouches[0]?.clientX ?? null; }}
        onTouchEnd={(e) => {
          const end = e.changedTouches[0]?.clientX ?? null;
          const start = touchStart.current;
          touchStart.current = null;
          if (start == null || end == null || safeImages.length < 2) return;
          const delta = end - start;
          if (Math.abs(delta) > 42) go(delta < 0 ? active + 1 : active - 1);
        }}
      >
        <Image
          src={safeImages[active]}
          alt={`${name} — foto ${active + 1} de ${safeImages.length}`}
          fill
          priority={active === 0}
          sizes="(max-width: 900px) 100vw, 58vw"
          className="product-gallery-image"
        />
        <span className="product-gallery-counter" aria-hidden="true">{String(active + 1).padStart(2, '0')} / {String(safeImages.length).padStart(2, '0')}</span>

        {safeImages.length > 1 && (
          <div className="product-gallery-arrows">
            <button type="button" onClick={() => go(active - 1)} className="product-gallery-arrow" aria-label="Foto anterior">←</button>
            <button type="button" onClick={() => go(active + 1)} className="product-gallery-arrow" aria-label="Próxima foto">→</button>
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="product-gallery-thumbs" aria-label="Selecionar foto">
          {safeImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={active === index ? 'true' : undefined}
              className={`product-gallery-thumb${active === index ? ' is-active' : ''}`}
            >
              <Image src={src} alt="" fill sizes="88px" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
