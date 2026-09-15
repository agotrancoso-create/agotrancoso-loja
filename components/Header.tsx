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
    <header className="sticky top-0 z-40 bg-areia/95 backdrop-blur border-b border-oliva/20">
      <div className="bg-marrom text-areia text-center px-4 py-2 text-[10px] md:text-[11px] tracking-[.16em] uppercase">
        Frete grátis em compras acima de R$ 500
      </div>
      <div className="max-w-content mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Agô Trancoso"
              width={56}
              height={56}
              className="h-12 w-12 md:h-14 md:w-14 object-contain"
              quality={100}
              unoptimized
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-sans text-sm text-marrom">
            <Link href="/" className="hover:text-terracota transition-colors">Início</Link>
            <Link href="/produtos" className="hover:text-terracota transition-colors">Coleção</Link>
            <Link href="/nossa-essencia" className="hover:text-terracota transition-colors">Nossa essência</Link>
            <Link href="/contato" className="hover:text-terracota transition-colors">Contato</Link>
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça..." className="w-40 lg:w-56 bg-transparent border-b border-oliva/40 focus:border-terracota outline-none text-sm py-1 font-sans text-marrom placeholder:text-oliva" />
            </form>
            <button aria-label="Abrir carrinho" onClick={openDrawer} className="relative text-marrom hover:text-terracota transition-colors">
              <CartIcon />
              {totalItems > 0 && <span className="absolute -top-2 -right-2 bg-terracota text-areia text-[11px] leading-none rounded-full w-5 h-5 flex items-center justify-center font-sans">{totalItems}</span>}
            </button>
            <button aria-label="Abrir menu" className="md:hidden text-marrom" onClick={() => setMenuOpen((v) => !v)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-5 flex flex-col gap-4 font-sans text-marrom">
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
  );
}
