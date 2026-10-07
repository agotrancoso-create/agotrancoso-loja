'use client';

import Link from 'next/link';
import Image from '@/components/ProductImage';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getAvailableProducts, getEffectivePrice } from '@/lib/products';
import { getAttentionCoverImage } from '@/lib/merchandising';
import CartIcon from './CartIcon';
import { cartEnglish } from '@/lib/cart-copy';
import { useSiteEnglish } from '@/lib/use-site-english';
import { productSearchScore } from '@/lib/product-search';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Coleção' },
  { href: '/nossa-essencia', label: 'A Agô' },
  { href: '/contato', label: 'Contato' },
];

const categoryItems = [
  { href: '/produtos?categoria=trancoso', label: 'Trancoso' },
  { href: '/igrejinha-de-trancoso', label: 'Igrejinhas' },
  { href: '/decoracao-em-ceramica', label: 'Decoração' },
  { href: '/produtos?categoria=fe-devocao', label: 'Fé & devoção' },
  { href: '/produtos?categoria=presentes', label: 'Presentes' },
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Header({ firstPurchaseAvailable = false }: { firstPurchaseAvailable?: boolean }) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const english = useSiteEnglish();
  const collectionPath = english ? '/en/produtos' : '/produtos';
  const localePath = (href: string) => {
    if (!english) return href;
    if (href === '/') return '/en';
    return href.startsWith('/en') ? href : `/en${href}`;
  };
  const navLabel: Record<string, string> = {
    'Início': 'Home',
    'Coleção': 'Collection',
    'A Agô': 'About Agô',
    'Contato': 'Contact',
    'Igrejinhas': 'Churches',
    'Decoração': 'Decor',
    'Fé & devoção': 'Faith & devotion',
    'Presentes': 'Gifts',
  };
  const translatedLabel = (label: string) => english ? (navLabel[label] ?? label) : label;
  const { totalItems, openDrawer } = useCart();
  const products = useMemo(() => getAvailableProducts(), []);

  const suggestions = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return [];

    return products
      .map((product) => {
        const score = productSearchScore(product, query);
        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'pt-BR'))
      .slice(0, 6)
      .map((item) => item.product);
  }, [products, query]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchFocused(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target as Node)) setSearchFocused(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const controls = [menuButtonRef.current, ...Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button, input') ?? [])].filter((node): node is HTMLElement => Boolean(node && node.getClientRects().length));
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const desktop = window.matchMedia('(min-width: 901px)');
    const closeOnDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [menuOpen]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    router.push(query.trim() ? `${collectionPath}?busca=${encodeURIComponent(query.trim())}` : collectionPath);
    setSearchFocused(false);
    setMenuOpen(false);
  }

  function chooseProduct(id: string) {
    setSearchFocused(false);
    setMenuOpen(false);
    router.push(`${collectionPath}/${id}`);
  }

  const routePath = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  const isActive = (href: string) => href === '/' ? routePath === '/' : routePath.startsWith(href.split('?')[0]);
  const showSuggestions = searchFocused && query.trim().length > 0;

  return (
    <>
      <div className="ago-topbar" role="region" aria-label={english ? 'Store information' : 'Informações comerciais'}>
        {firstPurchaseAvailable && <><span className="ago-topbar-offer">{english ? '3% OFF your first purchase' : '3% OFF na 1ª compra'}</span><i aria-hidden="true" /></>}
        <span>{english ? 'Free shipping in Brazil on R$ 500 or more in products' : 'Frete grátis a partir de R$ 500 em produtos'}</span>
      </div>

      <header className="site-header sticky top-0 z-40">
        <div className="ago-container header-inner">
          <Link href={localePath('/')} className="header-logo" aria-label={english ? 'Agô Trancoso, home' : 'Agô Trancoso, página inicial'}>
            <Image src="/logo.png" alt="Agô Trancoso" width={78} height={78} sizes="52px" className="object-contain" quality={86} priority />
          </Link>

          <nav className="header-nav header-nav-desktop" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={localePath(item.href)}
                className={`header-link${isActive(item.href) ? ' is-active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {translatedLabel(item.label)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <div className="header-search-wrap" data-no-translate="true" ref={searchWrapRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setSearchFocused(false); }}>
              <form onSubmit={handleSearch} className="header-search-form" role="search">
                <label className="sr-only" htmlFor="header-search">{english ? 'Search for a piece' : 'Buscar uma peça'}</label>
                <input
                  id="header-search"
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setSearchFocused(true); }}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setSearchFocused(false);
                    if (event.key === 'ArrowDown' && suggestions[0]) {
                      event.preventDefault();
                      document.getElementById(`ago-search-suggestion-${suggestions[0].id}`)?.focus();
                    }
                  }}
                  placeholder={english ? 'Search' : 'Buscar'}
                  className="header-search"
                  autoComplete="off"
                  aria-controls={showSuggestions ? 'ago-search-suggestions' : undefined}
                />
              </form>

              {showSuggestions && (
                <div id="ago-search-suggestions" className="ago-search-suggestions" aria-label={english ? 'Product suggestions' : 'Sugestões de peças'}>
                  {suggestions.length > 0 ? (
                    <>
                      {suggestions.map((product, index) => (
                        <button
                          id={`ago-search-suggestion-${product.id}`}
                          type="button"
                          key={product.id}
                          className="ago-search-suggestion"
                          onClick={() => chooseProduct(product.id)}
                          onKeyDown={(event) => {
                            if (event.key === 'ArrowDown') {
                              event.preventDefault();
                              const next = suggestions[index + 1];
                              if (next) document.getElementById(`ago-search-suggestion-${next.id}`)?.focus();
                            }
                            if (event.key === 'ArrowUp') {
                              event.preventDefault();
                              const previous = suggestions[index - 1];
                              if (previous) document.getElementById(`ago-search-suggestion-${previous.id}`)?.focus();
                              else document.getElementById('header-search')?.focus();
                            }
                            if (event.key === 'Escape') { document.getElementById('header-search')?.focus(); setSearchFocused(false); }
                          }}
                        >
                          <span className="ago-search-suggestion-image">
                            <Image src={getAttentionCoverImage(product)} alt="" fill sizes="48px" />
                          </span>
                          <span className="ago-search-suggestion-copy">
                            <strong>{english ? (cartEnglish[product.name] || product.name) : product.name}</strong>
                            <small>{formatBRL(getEffectivePrice(product))}</small>
                          </span>
                          <span className="ago-search-suggestion-arrow" aria-hidden="true">↗</span>
                        </button>
                      ))}
                      <button type="button" className="ago-search-view-all" onClick={() => { router.push(`${collectionPath}?busca=${encodeURIComponent(query.trim())}`); setSearchFocused(false); }}>
                        {english ? `View results for “${query.trim()}”` : `Ver resultados para “${query.trim()}”`}
                      </button>
                    </>
                  ) : (
                    <button type="button" className="ago-search-view-all" onClick={() => { router.push(`${collectionPath}?busca=${encodeURIComponent(query.trim())}`); setSearchFocused(false); }}>
                      {english ? `Search the collection for “${query.trim()}”` : `Buscar “${query.trim()}” na coleção`}
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              data-no-translate="true"
              aria-label={english ? (totalItems > 0 ? `Open bag with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}` : 'Open bag') : (totalItems > 0 ? `Abrir sacola com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'Abrir sacola')}
              onClick={() => { setMenuOpen(false); openDrawer(); }}
              className="header-icon"
            >
              <span className="header-cart-label">
                <CartIcon size={23} />
                {totalItems > 0 && <span className="cart-count" aria-hidden="true">{totalItems}</span>}
              </span>
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={english ? (menuOpen ? 'Close menu' : 'Open menu') : (menuOpen ? 'Fechar menu' : 'Abrir menu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="mobile-menu-button"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={menuOpen ? 'M5 5l14 14M19 5L5 19' : 'M3 7h18M3 12h18M3 17h18'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="ago-category-bar" aria-label={english ? 'Explore collection' : 'Explorar coleção'}>
          <div className="ago-container ago-category-bar-inner">
            <Link href={localePath('/produtos')} className="ago-category-all">{english ? 'View all' : 'Ver tudo'}</Link>
            {categoryItems.map((item) => <Link key={item.href} href={localePath(item.href)}>{translatedLabel(item.label)}</Link>)}
          </div>
        </nav>

        {menuOpen && (
          <div id="mobile-navigation" className="mobile-menu" ref={menuRef}>
            <form onSubmit={handleSearch} className="mobile-search-form" role="search">
              <label className="sr-only" htmlFor="mobile-search">{english ? 'Search for a piece' : 'Buscar uma peça'}</label>
              <input id="mobile-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? 'Search the collection' : 'Buscar na coleção'} autoComplete="off" />
              {query.trim() && (
                <div className="mobile-search-suggestions">
                  {suggestions.slice(0, 4).map((product) => (
                    <button type="button" key={product.id} onClick={() => chooseProduct(product.id)}>
                      <span>{english ? (cartEnglish[product.name] || product.name) : product.name}</span><small>{formatBRL(getEffectivePrice(product))}</small>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <nav className="mobile-menu-primary" aria-label={english ? 'Mobile navigation' : 'Navegação móvel'}>
              {navItems.map((item) => <Link href={localePath(item.href)} key={item.href}>{translatedLabel(item.label)}</Link>)}
            </nav>

            <p className="mobile-menu-label">{english ? 'Explore collection' : 'Explorar coleção'}</p>
            <nav className="mobile-menu-categories" aria-label={english ? 'Categories' : 'Categorias'}>
              <Link href={localePath('/produtos')}>{english ? 'View all' : 'Ver tudo'}</Link>
              {categoryItems.map((item) => <Link href={localePath(item.href)} key={item.href}>{translatedLabel(item.label)}</Link>)}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
