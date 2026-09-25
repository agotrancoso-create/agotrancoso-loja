'use client';

import Image from 'next/image';
import PhotoLightbox from './PhotoLightbox';
import { useRef, useState } from 'react';

type ProductGalleryProps = { name: string; images: string[] };

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="m15 15 4 4M10.5 8v5M8 10.5h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductGallery({ name, images }: ProductGalleryProps) {
  const safeImages = images.filter(Boolean).length ? images.filter(Boolean) : ['/images/placeholder.svg'];
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchY = useRef(0);
  const swiped = useRef(false);
  const touchStart = useRef<number | null>(null);

  const go = (next: number) => setActive((next + safeImages.length) % safeImages.length);

  return (
    <div className="product-gallery" aria-label={`Galeria de ${name}`}>
      <div
        className="product-gallery-main"
        role="group"
        tabIndex={0}
        aria-label={`Fotos de ${name}`}
        onKeyDown={(event) => {
          if (safeImages.length < 2) return;
          if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
        }}
        onTouchStart={(e) => { touchStart.current = e.changedTouches[0]?.clientX ?? null; touchY.current = e.changedTouches[0]?.clientY ?? 0; swiped.current = false; }}
        onTouchEnd={(e) => {
          const end = e.changedTouches[0]?.clientX ?? null;
          const start = touchStart.current;
          touchStart.current = null;
          if (start == null || end == null || safeImages.length < 2) return;
          const delta = end - start;
          if (Math.abs(delta) > 42 && Math.abs(delta) > Math.abs(e.changedTouches[0].clientY - touchY.current)) {
            swiped.current = true;
            go(delta < 0 ? active + 1 : active - 1);
          }
        }}
      >
        <button
          type="button"
          className="ago-gallery-open"
          aria-label={`Ampliar foto de ${name}`}
          onClick={() => {
            if (swiped.current) { swiped.current = false; return; }
            setExpanded(true);
          }}
        >
          <Image
            src={safeImages[active]}
            alt={`${name}, foto ${active + 1} de ${safeImages.length}`}
            fill
            priority={active === 0}
            quality={90}
            sizes="(max-width: 900px) 100vw, 58vw"
            className="product-gallery-image"
          />
          <span className="ago-gallery-zoom-hint"><ZoomIcon /><span>Ampliar</span></span>
        </button>

        <span className="product-gallery-counter" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(safeImages.length).padStart(2, '0')}</span>

        {safeImages.length > 1 && (
          <div className="product-gallery-arrows" aria-label="Navegar pelas fotos">
            <button type="button" onClick={() => go(active - 1)} className="product-gallery-arrow" aria-label="Foto anterior"><Chevron direction="left" /></button>
            <button type="button" onClick={() => go(active + 1)} className="product-gallery-arrow" aria-label="Próxima foto"><Chevron direction="right" /></button>
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
              <Image src={src} alt="" fill quality={82} sizes="88px" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {expanded && <PhotoLightbox name={name} images={safeImages} initialIndex={active} onClose={() => setExpanded(false)} />}
    </div>
  );
}
