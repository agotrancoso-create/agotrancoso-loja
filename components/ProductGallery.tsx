'use client';

import { useRef, useState } from 'react';

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const safeImages = images.filter(Boolean).length
    ? images.filter(Boolean)
    : ['/images/placeholder.svg'];
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  const go = (next: number) => {
    setActive((next + safeImages.length) % safeImages.length);
  };

  return (
    <div className="product-gallery" aria-label={`Galeria de ${name}`}>
      <div
        className="product-gallery-main"
        onTouchStart={(e) => {
          touchStart.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const end = e.changedTouches[0]?.clientX ?? null;
          const start = touchStart.current;
          touchStart.current = null;
          if (start == null || end == null || safeImages.length < 2) return;
          const delta = end - start;
          if (Math.abs(delta) > 42) go(delta < 0 ? active + 1 : active - 1);
        }}
      >
        <img
          src={safeImages[active]}
          alt={`${name} — foto ${active + 1} de ${safeImages.length}`}
          className="product-gallery-image"
          fetchPriority={active === 0 ? 'high' : 'auto'}
          loading={active === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(active - 1)}
              className="product-gallery-arrow product-gallery-arrow-left"
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              className="product-gallery-arrow product-gallery-arrow-right"
              aria-label="Próxima foto"
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <>
          <div className="product-gallery-thumbs" aria-label="Selecionar foto">
            {safeImages.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={active === i}
                className={`product-gallery-thumb ${active === i ? 'is-active' : ''}`}
              >
                <img src={src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <div className="product-gallery-dots" aria-hidden="true">
            {safeImages.map((src, i) => (
              <span key={`${src}-dot`} className={active === i ? 'is-active' : ''} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
