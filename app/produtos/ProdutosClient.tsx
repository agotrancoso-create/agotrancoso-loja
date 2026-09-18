'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProdutosClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('busca') || '');
  const [category, setCategory] = useState(searchParams.get('categoria') || 'todas');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const normalize = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(query);

    return products
      .filter((product) => {
        if (!product.available) return false;
        const haystack = normalize(`${product.name} ${product.description} ${product.category}`);
        if (q && !haystack.includes(q)) return false;
        if (category !== 'todas' && product.category !== category) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
        return products.indexOf(a) - products.indexOf(b);
      });
  }, [products, query, category, sort]);

  const hasFilters = Boolean(query.trim()) || category !== 'todas';

  function clearFilters() {
    setQuery('');
    setCategory('todas');
    setSort('featured');
  }

  return (
    <div className="catalog-interface">
      <div className="catalog-toolbar">
        <label htmlFor="catalog-search">Encontrar uma peça</label>
        <input
          id="catalog-search"
          aria-label="Buscar peça"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome..."
        />
      </div>

      <div className="catalog-controls-row">
        <nav className="catalog-category-nav" aria-label="Filtrar por categoria">
          <button type="button" role="option" aria-selected={category === 'todas'} className="catalog-category-option" onClick={() => setCategory('todas')}>Todas</button>
          {categories.map((item) => (
            <button type="button" role="option" key={item.id} aria-selected={category === item.id} className="catalog-category-option" onClick={() => setCategory(item.id)}>{item.name}</button>
          ))}
        </nav>
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
        <span>{filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}</span>
        {hasFilters && <button type="button" onClick={clearFilters}>Limpar</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <p>Nenhuma peça encontrada.</p>
          <button type="button" onClick={clearFilters}>Ver toda a coleção</button>
        </div>
      ) : (
        <div className="catalog-grid">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
