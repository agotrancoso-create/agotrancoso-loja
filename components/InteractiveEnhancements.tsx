'use client';

import { useEffect, useState } from 'react';

export default function InteractiveEnhancements() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const body = document.body;
    const header = document.querySelector('.site-header');
    let frame = 0;

    const updateViewportState = () => {
      const y = window.scrollY || 0;
      body.classList.toggle('ago-has-scrolled', y > 24);
      header?.classList.toggle('ago-header-scrolled', y > 24);
      setShowTop(y > 680);

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
