'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export function useSiteEnglish() {
  const pathname = usePathname();
  const [english, setEnglish] = useState(false);
  useEffect(() => { setEnglish(pathname === '/en' || pathname.startsWith('/en/')); }, [pathname]);
  return english;
}
