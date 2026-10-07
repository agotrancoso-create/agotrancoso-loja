'use client';

import { useEffect } from 'react';

export default function HydrationReady() {
  useEffect(() => {
    document.documentElement.dataset.agoHydrated = 'true';
    return () => {
      delete document.documentElement.dataset.agoHydrated;
    };
  }, []);

  return null;
}
