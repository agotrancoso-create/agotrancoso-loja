'use client';

import { useSiteEnglish } from '@/lib/use-site-english';

export default function LocalizedText({ pt, en }: { pt: string; en: string }) {
  const english = useSiteEnglish();
  return <span data-no-translate="true">{english ? en : pt}</span>;
}
