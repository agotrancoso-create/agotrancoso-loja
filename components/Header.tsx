'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from './CartIcon';

const navItems = [
  { href: '/produtos', label: 'Coleção' },
  { href: '/produtos?categoria=trancoso', label: 'Trancoso' },
  { href: '/produtos?categoria=decoracao', label: 'Casa' },
  { href: '/produtos?categoria=fe-devocao', label: 'Fé' },
  { href: '/produtos?categoria=presentes', label: 'Presentes' },
  { href: '/nossa-essencia', label: 'A Agô' },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/produtos?busca=${encodeURIComponent(query.trim())}` : '/produtos');
    setMenuOpen(false);
  }

  const isActive = (href: string) => href === '/produtos'
    ? pathname === '/produtos' || pathname.startsWith('/produtos/')
    : href.startsWith('/produtos?') ? false : pathname.startsWith(href);

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <header className="site-header">
        <div className="site-container header-main">
          <Link href="/" className="header-logo" aria-label="Agô Trancoso — página inicial">
            <Image src="/logo.png" alt="Agô Trancoso" width={72} height={72} sizes="62px" priority />
          </Link>

          <nav className="header-nav" aria-label="Navegação principal">
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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar"
                className="header-search"
              />
              <button type="submit" aria-label="Buscar" className="header-search-button">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
              </button>
            </form>

            <button
              type="button"
              aria-label={totalItems > 0 ? `Abrir sacola com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'Abrir sacola'}
              onClick={openDrawer}
              className="header-cart-button"
            >
              <CartIcon size={21} />
              <span className="header-cart-text">Sacola</span>
              {totalItems > 0 && <span className="cart-count" aria-hidden="true">{totalItems}</span>}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className={`mobile-menu-button${menuOpen ? ' is-open' : ''}`}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span /><span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <>
            <button className="mobile-menu-backdrop" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />
            <div id="mobile-navigation" className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
              <div className="mobile-menu-inner site-container">
                <form onSubmit={handleSearch} className="mobile-search-form" role="search">
                  <label htmlFor="mobile-search">Buscar na coleção</label>
                  <div>
                    <input id="mobile-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nome ou categoria" autoFocus />
                    <button type="submit">Buscar</button>
                  </div>
                </form>

                <nav className="mobile-menu-primary" aria-label="Menu principal">
                  <Link href="/">Início <span aria-hidden="true">↗</span></Link>
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <span>{item.label}</span><span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                  <Link href="/contato">Contato <span aria-hidden="true">↗</span></Link>
                </nav>

                <p className="mobile-menu-note">Trancoso · Bahia · Brasil</p>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
