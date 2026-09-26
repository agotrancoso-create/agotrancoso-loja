'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ImmersiveMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const body = document.body;
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.ago-immersive-reveal'));
    const parallaxNodes = Array.from(document.querySelectorAll<HTMLElement>('.ago-parallax-photo'));
    const hero = document.querySelector<HTMLElement>('.ago-cinematic-image');
    let frame = 0;

    body.classList.toggle('ago-immersive-enabled', !reducedMotion);

    let observer: IntersectionObserver | null = null;
    if (!reducedMotion && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add('is-revealed');
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
      revealNodes.forEach((node) => observer?.observe(node));
    } else {
      revealNodes.forEach((node) => node.classList.add('is-revealed'));
    }

    const update = () => {
      frame = 0;
      if (reducedMotion) return;

      const viewport = Math.max(window.innerHeight, 1);
      const scrollY = window.scrollY || 0;
      root.style.setProperty('--ago-hero-shift', `${clamp(scrollY * 0.038, 0, 30)}px`);

      parallaxNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < -160 || rect.top > viewport + 160) return;
        const center = rect.top + rect.height / 2;
        const distance = (center - viewport / 2) / viewport;
        const shift = clamp(distance * -14, -10, 10);
        node.style.setProperty('--ago-photo-shift', `${shift}px`);
      });

      if (hero) hero.style.setProperty('--ago-photo-shift', `${clamp(scrollY * 0.02, 0, 16)}px`);
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      observer?.disconnect();
      body.classList.remove('ago-immersive-enabled');
      root.style.removeProperty('--ago-hero-shift');
      parallaxNodes.forEach((node) => node.style.removeProperty('--ago-photo-shift'));
      hero?.style.removeProperty('--ago-photo-shift');
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return null;
}
