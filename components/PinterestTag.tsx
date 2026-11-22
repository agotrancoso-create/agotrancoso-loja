'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CONSENT_EVENT, readPrivacyConsent } from '@/lib/privacy-consent';

type PinterestTracker = ((...args: unknown[]) => void) & {
  queue?: unknown[][];
  version?: string;
};

declare global {
  interface Window {
    pintrk?: PinterestTracker;
    __agoPinterestTagInitialized?: boolean;
  }
}

// This is the public *tag* ID, not the advertiser account ID or Conversions API token.
// When absent, Pinterest tracking stays disabled rather than sending to the wrong account.
const tagId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID || '';

function initializePinterestTag(id: string) {
  if (window.__agoPinterestTagInitialized) return;

  if (!window.pintrk) {
    const tracker = ((...args: unknown[]) => {
      tracker.queue?.push(args);
    }) as PinterestTracker;
    tracker.queue = [];
    tracker.version = '3.0';
    window.pintrk = tracker;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://s.pinimg.com/ct/core.js';
    script.id = 'ago-pinterest-tag-loader';
    document.head.appendChild(script);
  }

  window.pintrk('load', id);
  window.pintrk('page');
  window.__agoPinterestTagInitialized = true;
}

/** Privacy-safe Pinterest tag, initialized only following explicit analytics consent. */
export default function PinterestTag() {
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const lastPage = useRef('');

  useEffect(() => {
    const sync = () => setAllowed(readPrivacyConsent() === 'all');
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!allowed || !/^\d{6,24}$/.test(tagId) || !pathname) {
      if (!allowed) {
        lastPage.current = '';
        window.__agoPinterestPendingEvents = [];
      }
      return;
    }
    initializePinterestTag(tagId);
    if (readPrivacyConsent() === 'all' && window.__agoPinterestPendingEvents?.length) {
      const pending = window.__agoPinterestPendingEvents.splice(0);
      for (const [name, data] of pending) window.pintrk?.('track', name, data);
    }

    // Product page events are sent with product IDs in trackViewItem, which is
    // needed for Pinterest dynamic retargeting. Never emit a duplicate PageVisit.
    if (/^\/(?:en\/)?produtos\/[^/]+/.test(pathname)) return;

    const pageKey = pathname + window.location.search;
    if (lastPage.current === pageKey) return;
    lastPage.current = pageKey;
    window.pintrk?.('track', 'PageVisit');
  }, [allowed, pathname]);

  return null;
}
