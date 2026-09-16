'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProdutosClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('busca') || '');
  const [category, setCategory] = useState<string>(searchParams.get('categoria') || 'todas');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const filtered = useMemo(() => { const q = normalize(query); return products.filter((p) => { const haystack = normalize(`${p.name} ${p.description} ${p.category}`); if (q && !haystack.includes(q)) return false; if (category !== 'todas' && p.category !== category) return false; if (onlyAvailable && !p.available) return false; if (maxPrice !== '' && p.price > maxPrice) return false; return true; }); }, [products, query, category, onlyAvailable, maxPrice]);

  return (
    <div>
      <div className="catalog-toolbar">
        <input aria-label="Buscar peça" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar peça por nome..." />
        <select aria-label="Filtrar por categoria" value={category} onChange={(e) => setCategory(e.target.value)}><option value="todas">Todas as categorias</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input aria-label="Preço máximo" type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Preço até (R$)" />
        <label className="flex items-center gap-2 text-sm text-marrom cursor-pointer"><input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} /> apenas disponíveis</label>
      </div>
      {filtered.length === 0 ? <p className="text-oliva">Nenhuma peça encontrada com esses filtros.</p> : <div className="catalog-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  );
}
