'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const navItems = [
  { href: '/', label: 'Início' },
  { href: '/produtos', label: 'Coleção' },
  { href: '/nossa-essencia', label: 'Agô' },
  { href: '/contato', label: 'Contato' },
];

export default function Header() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/produtos?busca=${encodeURIComponent(query.trim())}` : '/produtos');
    setMenuOpen(false);
  }

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <div className="ago-topbar" aria-label="Informações comerciais">
        <span className="ago-topbar-offer">3% OFF na 1ª compra</span>
        <i aria-hidden="true" />
        <span>Frete grátis acima de R$ 500</span>
        <i aria-hidden="true" />
        <span>Envio para todo o Brasil</span>
        <i aria-hidden="true" />
        <span>Atendimento pelo WhatsApp</span>
      </div>

      <header className="site-header sticky top-0 z-40">
        <div className="ago-container header-inner">
          <Link href="/" className="header-logo" aria-label="Agô Trancoso">
            <Image src="/logo.png" alt="Agô Trancoso" width={72} height={72} sizes="48px" className="h-12 w-12 object-contain" quality={82} priority />
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
            <form onSubmit={handleSearch} className="header-search-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar peça..."
                aria-label="Buscar peça"
                className="header-search"
              />
            </form>

            <button
              type="button"
              aria-label={totalItems > 0 ? `Abrir carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'Abrir carrinho'}
              onClick={openDrawer}
              className="header-icon"
            >
              <span className="header-cart-label">
                <span>Sacola</span>
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              className="mobile-menu-button"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu ago-container">
            <form onSubmit={handleSearch}>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça..." aria-label="Buscar peça" />
            </form>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={isActive(item.href) ? 'is-active' : undefined}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
