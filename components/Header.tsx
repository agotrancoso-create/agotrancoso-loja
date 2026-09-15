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
      <div className="bg-marrom text-areia text-center py-2.5 px-4 text-[10px] font-sans tracking-[.08em]">
        Frete grátis em compras acima de R$ 500
      </div>
      <header className="site-header sticky top-0 z-40 bg-areia/95 backdrop-blur border-b border-oliva/20">
        <div className="max-w-content mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-[68px] md:h-[76px]">
            <nav className="hidden md:flex items-center gap-7 font-sans text-[10px] tracking-[.08em] uppercase text-marrom">
              <Link href="/" className="header-link">Início</Link>
              <Link href="/produtos" className="header-link">Coleção</Link>
              <Link href="/nossa-essencia" className="header-link">Nossa essência</Link>
              <Link href="/contato" className="header-link">Contato</Link>
            </nav>

            <Link href="/" className="header-logo" aria-label="Agô Trancoso">
              <Image src="/logo.png" alt="Agô Trancoso" width={58} height={58} className="h-11 w-11 md:h-12 md:w-12 object-contain" quality={100} unoptimized priority />
            </Link>

            <div className="flex items-center gap-4 md:gap-5">
              <form onSubmit={handleSearch} className="hidden lg:block">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça..." className="header-search w-36 xl:w-48 bg-transparent border-b border-oliva/35 focus:border-terracota outline-none text-[10px] py-1.5 font-sans text-marrom placeholder:text-oliva" />
              </form>
              <button aria-label="Abrir carrinho" onClick={openDrawer} className="header-icon relative text-marrom hover:text-terracota transition-colors">
                <CartIcon />
                {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-terracota text-areia text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-sans">{totalItems}</span>}
              </button>
              <button aria-label="Abrir menu" className="md:hidden text-marrom" onClick={() => setMenuOpen((v) => !v)}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-5 flex flex-col gap-4 font-sans text-sm text-marrom border-t border-oliva/15 pt-4">
              <form onSubmit={handleSearch}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça..." className="w-full bg-transparent border-b border-oliva/40 focus:border-terracota outline-none text-sm py-2 placeholder:text-oliva" />
              </form>
              <Link href="/" onClick={() => setMenuOpen(false)}>Início</Link>
              <Link href="/produtos" onClick={() => setMenuOpen(false)}>Coleção</Link>
              <Link href="/nossa-essencia" onClick={() => setMenuOpen(false)}>Nossa essência</Link>
              <Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
