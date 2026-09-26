'use client';

import { useEffect, useRef, useState } from 'react';

export default function InteractiveEnhancements() {
  const [showTop, setShowTop] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const header = document.querySelector('.site-header');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    if (!reducedMotion) body.classList.add('ago-motion-ready');

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.ago-reveal'));
    let observer: IntersectionObserver | null = null;

    if (!reducedMotion && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add('is-visible');
          observer?.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      revealNodes.forEach((node) => {
        if (!node.classList.contains('is-visible')) observer?.observe(node);
      });
    } else {
      revealNodes.forEach((node) => node.classList.add('is-visible'));
    }

    const updateViewportState = () => {
      const y = window.scrollY || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, y / maxScroll));

      body.classList.toggle('ago-has-scrolled', y > 24);
      header?.classList.toggle('ago-header-scrolled', y > 24);
      setShowTop(y > 680);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }

      if (!reducedMotion) {
        const heroShift = Math.max(-18, Math.min(20, y * 0.035));
        root.style.setProperty('--ago-cinematic-shift', `${heroShift}px`);
      }
    };

    const handleViewportChange = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateViewportState();
      });
    };

    updateViewportState();
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange);

    return () => {
      observer?.disconnect();
      body.classList.remove('ago-motion-ready');
      root.style.removeProperty('--ago-cinematic-shift');
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <>
      <div className="ago-scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>
      <button
        type="button"
        className={`ago-back-to-top${showTop ? ' is-visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
      >
        <span aria-hidden="true">↑</span>
        <span>Topo</span>
      </button>
    </>
  );
}
