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
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(query);
    const result = products.filter((p) => {
      const haystack = normalize(`${p.name} ${p.description} ${p.category}`);
      if (q && !haystack.includes(q)) return false;
      if (category !== 'todas' && p.category !== category) return false;
      if (onlyAvailable && !p.available) return false;
      if (maxPrice !== '' && p.price > maxPrice) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
      return products.indexOf(a) - products.indexOf(b);
    });
  }, [products, query, category, onlyAvailable, maxPrice, sort]);

  const hasFilters = Boolean(query.trim()) || category !== 'todas' || onlyAvailable || maxPrice !== '';

  function clearFilters() {
    setQuery('');
    setCategory('todas');
    setOnlyAvailable(false);
    setMaxPrice('');
    setSort('featured');
  }

  return (
    <div className="catalog-interface">
      <div className="catalog-toolbar">
        <input
          aria-label="Buscar peça"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar peça por nome..."
        />

        <input
          aria-label="Preço máximo"
          type="number"
          min={0}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Preço até (R$)"
        />

        <label className="catalog-availability">
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
          <span>Apenas disponíveis</span>
        </label>
      </div>

      <div className="catalog-controls-row">
        <div className="catalog-category-nav" aria-label="Filtrar por categoria">
          <button type="button" role="option" aria-selected={category === 'todas'} className="catalog-category-option" onClick={() => setCategory('todas')}>Todos</button>
          {categories.map((item) => (
            <button type="button" role="option" key={item.id} aria-selected={category === item.id} className="catalog-category-option" onClick={() => setCategory(item.id)}>{item.name}</button>
          ))}
        </div>
        <div className="catalog-sort-wrap">
          <label htmlFor="catalog-sort">Ordenar</label>
          <select id="catalog-sort" className="catalog-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="featured">Destaques</option>
            <option value="price-desc">Maior preço</option>
            <option value="price-asc">Menor preço</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>

      <div className="catalog-results-meta">
        <span>{filtered.length} {filtered.length === 1 ? 'peça encontrada' : 'peças encontradas'}</span>
        {hasFilters && <button type="button" onClick={clearFilters}>Limpar filtros</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <p>Nenhuma peça encontrada com esses filtros.</p>
          <button type="button" onClick={clearFilters}>Voltar para toda a coleção</button>
        </div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
