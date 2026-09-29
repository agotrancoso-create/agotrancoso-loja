'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ImmersiveMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.ago-immersive-reveal'));

    // Conteúdo nunca deve depender de animação para ficar visível.
    // Mantemos as seções disponíveis imediatamente e deixamos os movimentos
    // discretos somente para imagens/hover via CSS.
    revealNodes.forEach((node) => node.classList.add('is-revealed'));
    document.body.classList.remove('ago-immersive-enabled');
  }, [pathname]);

  return null;
}
