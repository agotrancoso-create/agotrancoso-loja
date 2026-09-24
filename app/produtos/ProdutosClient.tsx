'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProdutosClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('busca') || '');
  const [category, setCategory] = useState(searchParams.get('categoria') || 'todas');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const urlQuery = searchParams.get('busca') || '';
  const urlCategory = searchParams.get('categoria') || 'todas';

  useEffect(() => {
    setQuery(urlQuery);
    setCategory(urlCategory);
  }, [urlQuery, urlCategory]);

  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    return products
      .filter((product) => {
        if (!product.available) return false;
        const haystack = normalize(`${product.name} ${product.description} ${product.category}`);
        if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
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

  const hasFilters = Boolean(query.trim()) || category !== 'todas' || sort !== 'featured';

  function clearFilters() {
    setQuery('');
    setCategory('todas');
    setSort('featured');
  }

  return (
    <div className="catalog-interface">
      <div className="catalog-tools">
        <div className="catalog-search-wrap">
          <label htmlFor="catalog-search">Encontre uma peça</label>
          <div className="catalog-search-control">
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome, símbolo ou coleção"
            />
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
          </div>
        </div>

        <div className="catalog-sort-wrap">
          <label htmlFor="catalog-sort">Ordenar por</label>
          <select id="catalog-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="featured">Destaques</option>
            <option value="price-desc">Maior preço</option>
            <option value="price-asc">Menor preço</option>
            <option value="name">Nome</option>
          </select>
        </div>
      </div>

      <div className="catalog-category-row" role="group" aria-label="Filtrar por categoria">
        <button type="button" aria-pressed={category === 'todas'} className="catalog-category-option" onClick={() => setCategory('todas')}>Todas</button>
        {categories.map((item) => (
          <button type="button" key={item.id} aria-pressed={category === item.id} className="catalog-category-option" onClick={() => setCategory(item.id)}>{item.name}</button>
        ))}
      </div>

      <div className="catalog-results-meta" aria-live="polite">
        <span>{filtered.length} {filtered.length === 1 ? 'peça encontrada' : 'peças encontradas'}</span>
        {hasFilters && <button type="button" onClick={clearFilters}>Limpar filtros</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <p className="eyebrow">Nenhum resultado</p>
          <h2>Essa busca não encontrou uma peça.</h2>
          <p>Tente outro termo ou volte para a coleção completa.</p>
          <button type="button" className="button button-dark" onClick={clearFilters}>Ver toda a coleção</button>
        </div>
      ) : (
        <div className="product-grid catalog-grid">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
