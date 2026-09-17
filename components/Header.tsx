'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from './CartIcon';

export default function Header() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/produtos?busca=${encodeURIComponent(query.trim())}` : '/produtos');
    setMenuOpen(false);
  }

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
            <Image src="/logo.png" alt="Agô Trancoso" width={72} height={72} className="h-12 w-12 object-contain" quality={100} unoptimized priority />
          </Link>

          <nav className="header-nav header-nav-desktop" aria-label="Navegação principal">
            <Link href="/" className="header-link">Início</Link>
            <Link href="/produtos" className="header-link">Coleção</Link>
            <Link href="/produtos?categoria=trancoso" className="header-link">Trancoso</Link>
            <Link href="/nossa-essencia" className="header-link">Agô</Link>
            <Link href="/contato" className="header-link">Contato</Link>
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
            <button type="button" aria-label={totalItems > 0 ? `Abrir carrinho com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : 'Abrir carrinho'} onClick={openDrawer} className="header-icon">
              <CartIcon />
              {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
            </button>
            <button type="button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} className="mobile-menu-button" onClick={() => setMenuOpen((v) => !v)}>
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
            <Link href="/" onClick={() => setMenuOpen(false)}>Início</Link>
            <Link href="/produtos" onClick={() => setMenuOpen(false)}>Coleção</Link>
            <Link href="/produtos?categoria=trancoso" onClick={() => setMenuOpen(false)}>Trancoso</Link>
            <Link href="/nossa-essencia" onClick={() => setMenuOpen(false)}>Agô</Link>
            <Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
          </div>
        )}
      </header>
    </>
  );
}
