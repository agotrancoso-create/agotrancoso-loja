'use client';

import { useEffect, useState } from 'react';

const revealSelectors = [
  '.ago-collection-intro-brand',
  '.ago-premium-product-grid .product-card',
  '.ago-benefits-heading',
  '.ago-benefit-item',
  '.ago-premium-trust',
  '.ago-home-hero .ago-premium-hero-content',
  '.ago-premium-discovery-card',
  '.ago-premium-split',
  '.ago-premium-visit-grid',
  '.catalog-intro',
  '.catalog-tools',
  '.catalog-grid .product-card',
  '.product-gallery',
  '.product-buybox',
  '.contact-copy',
  '.contact-actions',
  '.checkout-form-panel',
  '.checkout-summary',
  '.first-purchase-modal',
] as const;

export default function InteractiveEnhancements() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const body = document.body;
    const header = document.querySelector('.site-header');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const updateViewportState = () => {
      const y = window.scrollY || 0;
      body.classList.toggle('ago-has-scrolled', y > 24);
      header?.classList.toggle('ago-header-scrolled', y > 24);
      setShowTop(y > 680);

      const documentElement = document.documentElement;
      const scrollable = documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
      documentElement.style.setProperty('--ago-scroll-progress', String(progress));
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

    const targets = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors.join(',')));
    let observer: IntersectionObserver | null = null;

    if (!reducedMotion && 'IntersectionObserver' in window) {
      targets.forEach((element, index) => {
        element.style.setProperty('--ago-reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
        element.classList.add('ago-reveal');
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('ago-inview');
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
      );

      targets.forEach((element) => observer?.observe(element));
    } else {
      targets.forEach((element) => element.classList.add('ago-inview'));
    }

    return () => {
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <>
      <span className="ago-scroll-progress" aria-hidden="true" />
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
