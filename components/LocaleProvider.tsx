'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SITE_LOCALE_STORAGE_KEY, type SiteLocale } from '@/lib/site-translations';
import { translateSiteText } from '@/lib/site-translations-extra';

type LocaleContextValue = { locale: SiteLocale; setLocale: (locale: SiteLocale) => void };
const LocaleContext = createContext<LocaleContextValue>({ locale: 'pt', setLocale: () => {} });

function supportedFromLanguageTag(tag: string | null | undefined): SiteLocale | null {
  if (!tag) return null;
  const normalized = tag.toLowerCase();
  if (normalized.startsWith('pt')) return 'pt';
  if (normalized.startsWith('en')) return 'en';
  return null;
}
function countryFallback(country: string | null | undefined): SiteLocale {
  const code = String(country || '').toUpperCase();
  return ['BR','PT','AO','MZ','CV','GW','ST','TL'].includes(code) ? 'pt' : 'en';
}
function translateNode(root: ParentNode, locale: SiteLocale) {
  if (locale !== 'en') return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) {
    const parent = node.parentElement;
    if (!parent || ['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
    return node.nodeValue?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
  }});
  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue || '';
    const translated = translateSiteText(value, locale);
    if (translated !== value) node.nodeValue = translated;
    node = walker.nextNode();
  }
  root.querySelectorAll?.<HTMLElement>('[placeholder],[aria-label],[title]').forEach((element) => {
    for (const attribute of ['placeholder','aria-label','title'] as const) {
      const current = element.getAttribute(attribute);
      if (!current) continue;
      const translated = translateSiteText(current, locale);
      if (translated !== current) element.setAttribute(attribute, translated);
    }
  });
}
function AutoTranslate({ locale }: { locale: SiteLocale }) {
  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'pt-BR';
    document.documentElement.dataset.agoLocale = locale;
    if (locale !== 'en') return;
    translateNode(document.body, locale);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.parentNode) translateNode(mutation.target.parentNode as ParentNode, locale);
        mutation.addedNodes.forEach((added) => {
          if (added.nodeType === Node.TEXT_NODE && added.parentNode) translateNode(added.parentNode as ParentNode, locale);
          if (added.nodeType === Node.ELEMENT_NODE) translateNode(added as Element, locale);
        });
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => observer.disconnect();
  }, [locale]);
  return null;
}
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocaleState] = useState<SiteLocale>('pt');
  useEffect(() => {
    let cancelled = false;
    async function detect() {
      const queryLocale = new URLSearchParams(window.location.search).get('lang');
      if (queryLocale === 'pt' || queryLocale === 'en') {
        localStorage.setItem(SITE_LOCALE_STORAGE_KEY, queryLocale);
        document.cookie = `ago_locale=${queryLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        if (!cancelled) setLocaleState(queryLocale); return;
      }
      if (pathname === '/en' || pathname.startsWith('/en/')) {
        localStorage.setItem(SITE_LOCALE_STORAGE_KEY, 'en'); document.cookie = 'ago_locale=en; Path=/; Max-Age=31536000; SameSite=Lax';
        if (!cancelled) setLocaleState('en'); return;
      }
      const stored = localStorage.getItem(SITE_LOCALE_STORAGE_KEY);
      if (stored === 'pt' || stored === 'en') { if (!cancelled) setLocaleState(stored); return; }
      const deviceLocale = supportedFromLanguageTag(navigator.languages?.[0] || navigator.language);
      if (deviceLocale) { if (!cancelled) setLocaleState(deviceLocale); return; }
      try {
        const response = await fetch('/api/locale', { cache: 'no-store' }); const data = await response.json();
        if (!cancelled) setLocaleState(countryFallback(data.country));
      } catch { if (!cancelled) setLocaleState('pt'); }
    }
    detect(); return () => { cancelled = true; };
  }, [pathname]);
  const setLocale = useCallback((next: SiteLocale) => {
    localStorage.setItem(SITE_LOCALE_STORAGE_KEY, next); document.cookie = `ago_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    if (next === 'pt' && (pathname === '/en' || pathname.startsWith('/en/'))) { router.push('/'); return; }
    setLocaleState(next); if (next === 'pt') window.location.reload();
  }, [pathname, router]);
  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LocaleContext.Provider value={value}><AutoTranslate locale={locale} />{children}</LocaleContext.Provider>;
}
export function useLocale() { return useContext(LocaleContext); }
