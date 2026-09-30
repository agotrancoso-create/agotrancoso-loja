'use client';

import Image from '@/components/ProductImage';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { trackGalleryInteraction } from '@/lib/marketing-analytics';

type Props = { productId: string; name: string; images: string[]; initialIndex?: number; onClose: () => void };
type Point = { x: number; y: number };
type TouchPoint = { clientX: number; clientY: number };
type TouchGesture =
  | { mode: 'swipe'; startX: number; startY: number }
  | { mode: 'pan'; startX: number; startY: number; panX: number; panY: number }
  | { mode: 'pinch'; startDistance: number; startScale: number };

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = .5;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function zoomSource(src: string) {
  return src.startsWith('/produtos/') ? `/zoom${src}` : src;
}

function touchDistance(a: TouchPoint, b: TouchPoint) {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function PhotoLightbox({ productId, name, images, initialIndex = 0, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [active, setActive] = useState(initialIndex);
  const [scale, setScale] = useState(MIN_SCALE);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const pointerDrag = useRef<{ id: number; startX: number; startY: number; panX: number; panY: number } | null>(null);
  const touchGesture = useRef<TouchGesture | null>(null);

  useEffect(() => {
    const node = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    node?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node?.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);

  const record = useCallback((action: 'next' | 'previous' | 'thumbnail' | 'zoom_in' | 'zoom_out' | 'fit', nextScale = scale, index = active) => {
    trackGalleryInteraction({ productId, action, photoIndex: index + 1, totalPhotos: images.length, scale: nextScale });
  }, [active, images.length, productId, scale]);

  const clampPan = useCallback((point: Point, nextScale: number): Point => {
    const node = viewport.current;
    if (!node || nextScale <= MIN_SCALE) return { x: 0, y: 0 };
    const maxX = node.clientWidth * (nextScale - 1) / 2;
    const maxY = node.clientHeight * (nextScale - 1) / 2;
    return { x: clamp(point.x, -maxX, maxX), y: clamp(point.y, -maxY, maxY) };
  }, []);

  const setZoom = useCallback((nextScale: number) => {
    const normalized = clamp(Number(nextScale.toFixed(2)), MIN_SCALE, MAX_SCALE);
    setScale(normalized);
    setPan((current) => clampPan(current, normalized));
    return normalized;
  }, [clampPan]);

  const resetView = useCallback(() => { setScale(MIN_SCALE); setPan({ x: 0, y: 0 }); }, []);

  const select = useCallback((index: number, action: 'next' | 'previous' | 'thumbnail' = 'thumbnail') => {
    const nextIndex = (index + images.length) % images.length;
    setActive(nextIndex);
    resetView();
    trackGalleryInteraction({ productId, action, photoIndex: nextIndex + 1, totalPhotos: images.length, scale: MIN_SCALE });
  }, [images.length, productId, resetView]);

  const zoomIn = () => { const next = setZoom(scale + ZOOM_STEP); record('zoom_in', next); };
  const zoomOut = () => { const next = setZoom(scale - ZOOM_STEP); record('zoom_out', next); };
  const fit = () => { resetView(); record('fit', MIN_SCALE); };
  const toggleZoom = () => {
    if (scale > MIN_SCALE) { const next = setZoom(MIN_SCALE); record('zoom_out', next); }
    else { const next = setZoom(2.5); record('zoom_in', next); }
  };

  return (
    <dialog ref={dialog} className="ago-photo-dialog" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => {
      if (event.key === 'ArrowRight' && scale === MIN_SCALE && images.length > 1) { event.preventDefault(); select(active + 1, 'next'); }
      if (event.key === 'ArrowLeft' && scale === MIN_SCALE && images.length > 1) { event.preventDefault(); select(active - 1, 'previous'); }
      if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomIn(); }
      if (event.key === '-') { event.preventDefault(); zoomOut(); }
      if (event.key === '0') { event.preventDefault(); fit(); }
    }}>
      <header className="ago-photo-header">
        <div className="ago-photo-heading"><span className="ago-photo-kicker">Ver peça em detalhe</span><h2 id={titleId}>{name}</h2></div>
        <span className="ago-photo-position" aria-live="polite">{active + 1} / {images.length}</span>
        <button type="button" className="ago-photo-close" onClick={onClose} aria-label="Fechar visualização ampliada"><CloseIcon /></button>
      </header>

      <div ref={viewport} className={`ago-photo-stage${scale > MIN_SCALE ? ' is-zoomed' : ''}`} role="region" aria-label={`${name}, foto ${active + 1}. Use os controles para ampliar ou reduzir.`} tabIndex={0}
        onWheel={(event) => { event.preventDefault(); setZoom(scale + (event.deltaY < 0 ? .35 : -.35)); }} onDoubleClick={(event) => { event.preventDefault(); toggleZoom(); }}
        onPointerDown={(event) => { if (event.pointerType === 'touch' || scale <= MIN_SCALE) return; pointerDrag.current = { id: event.pointerId, startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y }; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => { const drag = pointerDrag.current; if (!drag || drag.id !== event.pointerId || scale <= MIN_SCALE) return; setPan(clampPan({ x: drag.panX + event.clientX - drag.startX, y: drag.panY + event.clientY - drag.startY }, scale)); }}
        onPointerUp={(event) => { if (pointerDrag.current?.id === event.pointerId) pointerDrag.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onPointerCancel={() => { pointerDrag.current = null; }}
        onTouchStart={(event) => { if (event.touches.length >= 2) { touchGesture.current = { mode: 'pinch', startDistance: touchDistance(event.touches[0], event.touches[1]), startScale: scale }; return; } const point = event.touches[0]; if (!point) return; touchGesture.current = scale > MIN_SCALE ? { mode: 'pan', startX: point.clientX, startY: point.clientY, panX: pan.x, panY: pan.y } : { mode: 'swipe', startX: point.clientX, startY: point.clientY }; }}
        onTouchMove={(event) => { const gesture = touchGesture.current; if (!gesture) return; if (gesture.mode === 'pinch' && event.touches.length >= 2) { event.preventDefault(); const distance = touchDistance(event.touches[0], event.touches[1]); setZoom(gesture.startScale * (distance / Math.max(gesture.startDistance, 1))); return; } if (gesture.mode === 'pan' && event.touches.length === 1) { event.preventDefault(); const point = event.touches[0]; setPan(clampPan({ x: gesture.panX + point.clientX - gesture.startX, y: gesture.panY + point.clientY - gesture.startY }, scale)); } }}
        onTouchEnd={(event) => { const gesture = touchGesture.current; touchGesture.current = null; if (!gesture || gesture.mode !== 'swipe' || scale !== MIN_SCALE || images.length < 2) return; const point = event.changedTouches[0]; if (!point) return; const dx = point.clientX - gesture.startX; const dy = point.clientY - gesture.startY; if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) select(active + (dx < 0 ? 1 : -1), dx < 0 ? 'next' : 'previous'); }}>
        <div className="ago-photo-image-frame">
          <div className="ago-photo-image-shell" style={{ transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})` }}>
            <Image src={zoomSource(images[active])} alt={`${name}, foto ${active + 1} de ${images.length}`} fill unoptimized quality={100} sizes="100vw" priority draggable={false} className="ago-photo-image" />
          </div>
        </div>

        {images.length > 1 && scale === MIN_SCALE && <div className="ago-photo-stage-nav" aria-label="Navegar pelas fotos"><button type="button" onClick={() => select(active - 1, 'previous')} aria-label="Foto anterior"><Chevron direction="left" /></button><button type="button" onClick={() => select(active + 1, 'next')} aria-label="Próxima foto"><Chevron direction="right" /></button></div>}
      </div>

      <footer className="ago-photo-footer">
        <div className="ago-photo-toolbar" aria-label="Controles de zoom"><button type="button" onClick={zoomOut} disabled={scale <= MIN_SCALE} aria-label="Reduzir zoom">−</button><span className="ago-photo-zoom-value" aria-live="polite">{Math.round(scale * 100)}%</span><button type="button" onClick={zoomIn} disabled={scale >= MAX_SCALE} aria-label="Aumentar zoom">+</button><button type="button" className="ago-photo-fit" onClick={fit} disabled={scale === MIN_SCALE && pan.x === 0 && pan.y === 0}>Ver peça inteira</button></div>
        {images.length > 1 && <div className="ago-photo-thumbs" aria-label="Selecionar foto">{images.map((src, index) => <button key={`${src}-${index}`} type="button" className={index === active ? 'is-active' : ''} onClick={() => select(index, 'thumbnail')} aria-label={`Ver foto ${index + 1}`} aria-current={index === active ? 'true' : undefined}><Image src={src} alt="" fill quality={100} sizes="64px" aria-hidden="true" /></button>)}</div>}
        <p className="ago-photo-help">{scale > MIN_SCALE ? 'Arraste para explorar os detalhes. Role, faça pinça ou use + e −.' : 'A peça abre inteira. Role, faça pinça ou dê dois cliques para ampliar.'}</p>
      </footer>
    </dialog>
  );
}
