'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function ImmersiveMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.ago-immersive-reveal'));

    // Regra de segurança: nenhuma animação pode ser requisito para o conteúdo aparecer.
    revealNodes.forEach((node) => node.classList.add('is-revealed'));
    document.body.classList.remove('ago-immersive-enabled');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      document.body.classList.remove('ago-live-motion');
      return;
    }

    document.body.classList.add('ago-live-motion');

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const header = document.querySelector<HTMLElement>('.site-header');
    const hero = document.querySelector<HTMLElement>('.ago-cinematic-commerce');
    const parallaxPhotos = Array.from(document.querySelectorAll<HTMLElement>('.ago-parallax-photo'));
    const interactiveTargets = Array.from(document.querySelectorAll<HTMLElement>([
      '.product-card',
      '.ago-premium-discovery-card',
      '.ago-banca-photo',
      '.ago-home-final-card',
      '.ago-premium-image',
    ].join(',')));

    let scrollFrame = 0;

    const updateScrollMotion = () => {
      scrollFrame = 0;
      header?.classList.toggle('ago-header-scrolled', window.scrollY > 18);

      if (hero && finePointer) {
        const shift = clamp(window.scrollY * 0.035, 0, 26);
        hero.style.setProperty('--ago-hero-shift', `${shift.toFixed(2)}px`);
      }

      const viewportCenter = window.innerHeight / 2;
      (finePointer ? parallaxPhotos : []).forEach((photo) => {
        const rect = photo.getBoundingClientRect();
        const photoCenter = rect.top + rect.height / 2;
        const normalized = clamp((photoCenter - viewportCenter) / window.innerHeight, -1, 1);
        photo.style.setProperty('--ago-photo-shift', `${(-normalized * 10).toFixed(2)}px`);
      });
    };

    const requestScrollMotion = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollMotion);
    };

    const pointerHandlers = (finePointer ? interactiveTargets : []).map((target) => {
      const onPointerMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const rect = target.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        target.style.setProperty('--ago-pointer-x', `${(x * 100).toFixed(2)}%`);
        target.style.setProperty('--ago-pointer-y', `${(y * 100).toFixed(2)}%`);
      };

      const onPointerLeave = () => {
        target.style.setProperty('--ago-pointer-x', '50%');
        target.style.setProperty('--ago-pointer-y', '50%');
      };

      target.addEventListener('pointermove', onPointerMove, { passive: true });
      target.addEventListener('pointerleave', onPointerLeave, { passive: true });
      return { target, onPointerMove, onPointerLeave };
    });

    let heroMove: ((event: PointerEvent) => void) | null = null;
    let heroLeave: (() => void) | null = null;

    if (hero && finePointer) {
      heroMove = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const rect = hero.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((event.clientY - rect.top) / Math.min(rect.height, window.innerHeight), 0, 1);
        hero.style.setProperty('--ago-pointer-x', `${(x * 100).toFixed(2)}%`);
        hero.style.setProperty('--ago-pointer-y', `${(y * 100).toFixed(2)}%`);
        hero.style.setProperty('--ago-hero-x', `${((x - 0.5) * 10).toFixed(2)}px`);
        hero.style.setProperty('--ago-hero-y', `${((y - 0.5) * 7).toFixed(2)}px`);
      };
      heroLeave = () => {
        hero.style.setProperty('--ago-pointer-x', '64%');
        hero.style.setProperty('--ago-pointer-y', '32%');
        hero.style.setProperty('--ago-hero-x', '0px');
        hero.style.setProperty('--ago-hero-y', '0px');
      };
      hero.addEventListener('pointermove', heroMove, { passive: true });
      hero.addEventListener('pointerleave', heroLeave, { passive: true });
    }

    updateScrollMotion();
    window.addEventListener('scroll', requestScrollMotion, { passive: true });
    window.addEventListener('resize', requestScrollMotion, { passive: true });

    return () => {
      document.body.classList.remove('ago-live-motion');
      header?.classList.remove('ago-header-scrolled');
      window.removeEventListener('scroll', requestScrollMotion);
      window.removeEventListener('resize', requestScrollMotion);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);

      pointerHandlers.forEach(({ target, onPointerMove, onPointerLeave }) => {
        target.removeEventListener('pointermove', onPointerMove);
        target.removeEventListener('pointerleave', onPointerLeave);
      });

      if (hero && heroMove && heroLeave) {
        hero.removeEventListener('pointermove', heroMove);
        hero.removeEventListener('pointerleave', heroLeave);
      }
    };
  }, [pathname]);

  return null;
}
