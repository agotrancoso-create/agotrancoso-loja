'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';

type Props = { name: string; images: string[]; initialIndex?: number; onClose: () => void };

export default function PhotoLightbox({ name, images, initialIndex = 0, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [active, setActive] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node?.close();
      document.body.style.overflow = overflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  function select(index: number) {
    setActive((index + images.length) % images.length);
    setZoomed(false);
    viewport.current?.scrollTo(0, 0);
  }

  return (
    <dialog ref={dialog} className="ago-photo-dialog" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); select(active + 1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); select(active - 1); }
      }}>
      <header className="ago-photo-header">
        <h2 id={titleId}>{name}</h2>
        <button type="button" onClick={onClose} aria-label="Fechar fotos">✕</button>
      </header>
      <div className="ago-photo-viewport" ref={viewport}
        onTouchStart={(event) => {
          const point = event.touches[0];
          touch.current = { x: point.clientX, y: point.clientY };
          swiped.current = false;
        }}
        onTouchEnd={(event) => {
          const start = touch.current;
          touch.current = null;
          if (!start || zoomed || images.length < 2) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            swiped.current = true;
            select(active + (dx < 0 ? 1 : -1));
          }
        }}>
        <button type="button" className={`ago-photo-canvas${zoomed ? ' is-zoomed' : ''}`}
          aria-label={zoomed ? 'Reduzir foto' : 'Ampliar detalhes da foto'}
          onClick={() => { if (swiped.current) { swiped.current = false; return; } setZoomed(!zoomed); }}>
          <Image src={images[active]} alt={`${name} — foto ${active + 1}`} fill sizes={zoomed ? '200vw' : '100vw'} />
        </button>
      </div>
      <footer className="ago-photo-toolbar">
        <button type="button" onClick={() => select(active - 1)} disabled={images.length < 2} aria-label="Foto anterior">←</button>
        <span aria-live="polite">{active + 1} / {images.length}</span>
        <button type="button" onClick={() => { setZoomed(!zoomed); viewport.current?.scrollTo(0, 0); }} aria-pressed={zoomed}>{zoomed ? 'Reduzir' : 'Zoom +'}</button>
        <button type="button" onClick={() => select(active + 1)} disabled={images.length < 2} aria-label="Próxima foto">→</button>
      </footer>
      <p className="ago-photo-hint">{zoomed ? 'Deslize a imagem para explorar os detalhes.' : images.length > 1 ? 'Deslize para trocar de foto. Toque para ampliar.' : 'Toque na foto para ver os detalhes.'}</p>
    </dialog>
  );
}
