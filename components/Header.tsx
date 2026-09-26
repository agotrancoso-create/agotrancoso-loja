'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getAvailableProducts, getEffectivePrice } from '@/lib/products';
import CartIcon from './CartIcon';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Coleção' },
  { href: '/nossa-essencia', label: 'A Agô' },
  { href: '/contato', label: 'Contato' },
];

const categoryItems = [
  { href: '/produtos?categoria=trancoso', label: 'Trancoso' },
  { href: '/igrejinha-de-trancoso', label: 'Igrejinhas' },
  { href: '/produtos?categoria=decoracao', label: 'Decoração' },
  { href: '/produtos?categoria=fe-devocao', label: 'Fé & devoção' },
  { href: '/produtos?categoria=presentes', label: 'Presentes' },
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Header() {
  const [firstPurchaseAvailable, setFirstPurchaseAvailable] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();
  const products = useMemo(() => getAvailableProducts(), []);

  const suggestions = useMemo(() => {
    const needle = normalize(query);
    if (!needle) return [];

    return products
      .map((product) => {
        const name = normalize(product.name);
        const words = name.split(/\s+/);
        let score = 0;
        if (name.startsWith(needle)) score = 100;
        else if (words.some((word) => word.startsWith(needle))) score = 80;
        else if (name.includes(needle)) score = 60;
        else if (normalize(`${product.description} ${product.category}`).includes(needle)) score = 35;
        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'pt-BR'))
      .slice(0, 6)
      .map((item) => item.product);
  }, [products, query]);

  useEffect(() => {
    let active = true;
    fetch('/api/first-purchase/eligibility', { cache: 'no-store' })
      .then(response => response.json()).then(data => { if (active) setFirstPurchaseAvailable(data.available === true); }).catch(() => {});
    return () => { active = false; };
  }, []);

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
    router.push(query.trim() ? `/produtos?busca=${encodeURIComponent(query.trim())}` : '/produtos');
    setSearchFocused(false);
    setMenuOpen(false);
  }

  function chooseProduct(id: string) {
    setSearchFocused(false);
    setMenuOpen(false);
    router.push(`/produtos/${id}`);
  }

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0]);
  const showSuggestions = searchFocused && query.trim().length > 0;

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>

      <div className="ago-topbar" role="region" aria-label="Informações comerciais">
        {firstPurchaseAvailable && <><span className="ago-topbar-offer">3% OFF na 1ª compra</span><i aria-hidden="true" /></>}
        <span>Frete grátis acima de R$ 500</span>
      </div>

      <header className="site-header sticky top-0 z-40">
        <div className="ago-container header-inner">
          <Link href="/" className="header-logo" aria-label="Agô Trancoso, página inicial">
            <Image src="/logo.png" alt="Agô Trancoso" width={78} height={78} sizes="52px" className="object-contain" quality={86} priority />
          </Link>

          <nav className="header-nav header-nav-desktop" aria-label="Navegação principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`header-link${isActive(item.href) ? ' is-active' : ''}`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <div className="header-search-wrap" ref={searchWrapRef} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setSearchFocused(false); }}>
              <form onSubmit={handleSearch} className="header-search-form" role="search">
                <label className="sr-only" htmlFor="header-search">Buscar uma peça</label>
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
                  placeholder="Buscar"
                  className="header-search"
                  autoComplete="off"
                  aria-controls={showSuggestions ? 'ago-search-suggestions' : undefined}
                />
              </form>

              {showSuggestions && (
                <div id="ago-search-suggestions" className="ago-search-suggestions" aria-label="Sugestões de peças">
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
                            <Image src={product.images?.[0] || '/images/placeholder.svg'} alt="" fill sizes="48px" />
                          </span>
                          <span className="ago-search-suggestion-copy">
                            <strong>{product.name}</strong>
                            <small>{formatBRL(getEffectivePrice(product))}</small>
                          </span>
                          <span className="ago-search-suggestion-arrow" aria-hidden="true">↗</span>
                        </button>
                      ))}
                      <button type="button" className="ago-search-view-all" onClick={() => { router.push(`/produtos?busca=${encodeURIComponent(query.trim())}`); setSearchFocused(false); }}>
                        Ver resultados para “{query.trim()}”
                      </button>
                    </>
                  ) : (
                    <button type="button" className="ago-search-view-all" onClick={() => { router.push(`/produtos?busca=${encodeURIComponent(query.trim())}`); setSearchFocused(false); }}>
                      Buscar “{query.trim()}” na coleção
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label={totalItems > 0 ? `Abrir sacola com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'Abrir sacola'}
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
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
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

        <nav className="ago-category-bar" aria-label="Explorar coleção">
          <div className="ago-container ago-category-bar-inner">
            <Link href="/produtos" className="ago-category-all">Ver tudo</Link>
            {categoryItems.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
        </nav>

        {menuOpen && (
          <div id="mobile-navigation" className="mobile-menu" ref={menuRef}>
            <form onSubmit={handleSearch} className="mobile-search-form" role="search">
              <label className="sr-only" htmlFor="mobile-search">Buscar uma peça</label>
              <input id="mobile-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar na coleção" autoComplete="off" />
              {query.trim() && (
                <div className="mobile-search-suggestions">
                  {suggestions.slice(0, 4).map((product) => (
                    <button type="button" key={product.id} onClick={() => chooseProduct(product.id)}>
                      <span>{product.name}</span><small>{formatBRL(getEffectivePrice(product))}</small>
                    </button>
                  ))}
                </div>
              )}
            </form>

            <nav className="mobile-menu-primary" aria-label="Navegação móvel">
              {navItems.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </nav>

            <p className="mobile-menu-label">Explorar coleção</p>
            <nav className="mobile-menu-categories" aria-label="Categorias">
              <Link href="/produtos">Ver tudo</Link>
              {categoryItems.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
