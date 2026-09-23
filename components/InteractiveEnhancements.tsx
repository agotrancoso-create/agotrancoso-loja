'use client';

import { useEffect, useState } from 'react';

const revealSelectors = [
  '.ago-premium-collection .ago-premium-section-head',
  '.ago-premium-collection .product-card',
  '.ago-premium-collection-bottom',
  '.ago-premium-editorial .ago-premium-image',
  '.ago-premium-editorial .ago-premium-copy',
  '.ago-premium-essence .ago-premium-image',
  '.ago-premium-essence .ago-premium-copy',
  '.ago-premium-discovery .ago-premium-section-head',
  '.ago-premium-discovery-card',
  '.ago-premium-how-head',
  '.ago-premium-how-grid article',
  '.ago-premium-visit-grid',
  '.benefits-strip .ago-clean-benefit',
];

export default function InteractiveEnhancements() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const body = document.body;
    const header = document.querySelector('.site-header');

    const onScroll = () => {
      const y = window.scrollY || 0;
      body.classList.toggle('ago-has-scrolled', y > 24);
      header?.classList.toggle('ago-header-scrolled', y > 24);
      setShowTop(y > 600);

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      doc.style.setProperty('--ago-scroll-progress', String(progress));
    };

    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        onScroll();
      });
    };

    onScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    const targets = document.querySelectorAll<HTMLElement>(revealSelectors.join(','));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && 'IntersectionObserver' in window) {
      targets.forEach((element, index) => {
        element.style.setProperty('--ago-reveal-delay', Math.min(index % 4, 3) * 70 + 'ms');
        element.classList.add('ago-reveal');

        const observer = new IntersectionObserver(
          (entries, currentObserver) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('ago-inview');
                currentObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
        );

        observer.observe(element);
      });
    } else {
      targets.forEach((element) => element.classList.add('ago-inview'));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span className="ago-scroll-progress" aria-hidden="true" />
      <button
        type="button"
        className={`ago-back-to-top${showTop ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Voltar ao topo"
      >
        <span aria-hidden="true">↑</span>
        <span>Topo</span>
      </button>
    </>
  );
}
