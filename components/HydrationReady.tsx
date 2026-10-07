'use client';

import { useEffect } from 'react';
import { afterInitialRender } from '@/lib/after-initial-render';

export default function HydrationReady() {
  useEffect(() => {
    const cancel = afterInitialRender(() => {
      document.documentElement.dataset.agoHydrated = 'true';
      window.dispatchEvent(new Event('ago:hydrated'));
    });

    return () => {
      cancel();
      delete document.documentElement.dataset.agoHydrated;
    };
  }, []);

  return null;
}
