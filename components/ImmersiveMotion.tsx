'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ImmersiveMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = document.body;
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.ago-immersive-reveal'));

    body.classList.toggle('ago-immersive-enabled', !reducedMotion);

    let observer: IntersectionObserver | null = null;
    if (!reducedMotion && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add('is-revealed');
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
      revealNodes.forEach((node) => observer?.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add('is-revealed'));
    }

    return () => {
      observer?.disconnect();
      body.classList.remove('ago-immersive-enabled');
    };
  }, [pathname]);

  return null;
}
