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
  function handleSearch(e: React.FormEvent) { e.preventDefault(); router.push(query.trim() ? `/produtos?busca=${encodeURIComponent(query.trim())}` : '/produtos'); setMenuOpen(false); }
  return (
    <>
      <div className="ago-topbar">Frete grátis em compras acima de R$ 500</div>
      <header className="site-header sticky top-0 z-40">
        <div className="ago-container header-inner">
          <nav className="header-nav header-nav-left" aria-label="Navegação principal">
            <Link href="/" className="header-link">Início</Link>
            <Link href="/produtos" className="header-link">Coleção</Link>
            <Link href="/nossa-essencia" className="header-link">Nossa essência</Link>
            <Link href="/contato" className="header-link">Contato</Link>
          </nav>
          <Link href="/" className="header-logo" aria-label="Agô Trancoso"><Image src="/logo.png" alt="Agô Trancoso" width={72} height={72} className="h-12 w-12 object-contain" quality={100} unoptimized priority /></Link>
          <div className="header-actions">
            <form onSubmit={handleSearch} className="header-search-form"><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça..." aria-label="Buscar peça" className="header-search" /></form>
            <button aria-label="Abrir carrinho" onClick={openDrawer} className="header-icon"><CartIcon />{totalItems > 0 && <span className="cart-count">{totalItems}</span>}</button>
            <button aria-label="Abrir menu" className="mobile-menu-button" onClick={() => setMenuOpen((v) => !v)}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg></button>
          </div>
        </div>
        {menuOpen && <div className="mobile-menu ago-container"><form onSubmit={handleSearch}><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça..." aria-label="Buscar peça" /></form><Link href="/" onClick={() => setMenuOpen(false)}>Início</Link><Link href="/produtos" onClick={() => setMenuOpen(false)}>Coleção</Link><Link href="/nossa-essencia" onClick={() => setMenuOpen(false)}>Nossa essência</Link><Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link></div>}
      </header>
    </>
  );
}
