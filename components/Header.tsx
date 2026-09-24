'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from './CartIcon';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Coleção' },
  { href: '/nossa-essencia', label: 'A Agô' },
  { href: '/contato', label: 'Contato' },
];

const categoryItems = [
  { href: '/produtos?categoria=trancoso', label: 'Trancoso' },
  { href: '/produtos?categoria=igrejinhas', label: 'Igrejinhas' },
  { href: '/produtos?categoria=decoracao', label: 'Decoração' },
  { href: '/produtos?categoria=fe-devocao', label: 'Fé & devoção' },
  { href: '/produtos?categoria=presentes', label: 'Presentes' },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
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
    setMenuOpen(false);
  }

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>

      <div className="ago-topbar" aria-label="Informações comerciais">
        <span className="ago-topbar-offer">3% OFF na 1ª compra</span>
        <i aria-hidden="true" />
        <span>Frete grátis acima de R$ 500</span>
      </div>

      <header className="site-header sticky top-0 z-40">
        <div className="ago-container header-inner">
          <Link href="/" className="header-logo" aria-label="Agô Trancoso — página inicial">
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
            <form onSubmit={handleSearch} className="header-search-form" role="search">
              <label className="sr-only" htmlFor="header-search">Buscar uma peça</label>
              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar"
                className="header-search"
              />
            </form>

            <button
              type="button"
              aria-label={totalItems > 0 ? `Abrir carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'Abrir carrinho'}
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
          <div id="mobile-navigation" className="mobile-menu ago-container" role="dialog" aria-modal="true" aria-label="Menu">
            <form onSubmit={handleSearch} role="search">
              <label className="sr-only" htmlFor="mobile-search">Buscar na coleção</label>
              <input id="mobile-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar peça..." autoFocus />
            </form>

            <div className="mobile-menu-primary">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={isActive(item.href) ? 'is-active' : undefined} aria-current={isActive(item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              ))}
            </div>

            <p className="mobile-menu-label">Explorar coleção</p>
            <div className="mobile-menu-categories">
              {categoryItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
