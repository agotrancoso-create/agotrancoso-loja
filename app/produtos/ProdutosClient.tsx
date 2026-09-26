'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'Destaques' },
  { value: 'price-desc', label: 'Maior preço' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'name', label: 'Nome' },
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function productPrice(product: Product) {
  return product.promotionalPrice != null && product.promotionalPrice < product.price
    ? product.promotionalPrice
    : product.price;
}

export default function ProdutosClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('busca') || '');
  const [category, setCategory] = useState(searchParams.get('categoria') || 'todas');
  const [sort, setSort] = useState<SortOption>('featured');
  const [searchFocused, setSearchFocused] = useState(false);
  const sortButton = useRef<HTMLButtonElement>(null);
  const sortMenu = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  useEffect(() => { if (sortOpen) sortMenu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus(); }, [sortOpen]);
  const urlQuery = searchParams.get('busca') || '';
  const urlCategory = searchParams.get('categoria') || 'todas';

  useEffect(() => {
    setQuery(urlQuery);
    setCategory(urlCategory);
  }, [urlQuery, urlCategory]);

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
        if (sort === 'price-asc') return productPrice(a) - productPrice(b);
        if (sort === 'price-desc') return productPrice(b) - productPrice(a);
        if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
        return products.indexOf(a) - products.indexOf(b);
      });
  }, [products, query, category, sort]);

  const suggestions = useMemo(() => {
    const term = normalize(query);
    if (!term) return [];

    return products
      .filter((product) => product.available && (category === 'todas' || product.category === category))
      .map((product) => {
        const name = normalize(product.name);
        const words = name.split(/\s+/);
        let score = 99;
        if (name.startsWith(term)) score = 0;
        else if (words.some((word) => word.startsWith(term))) score = 1;
        else if (name.includes(term)) score = 2;
        else if (normalize(`${product.description} ${product.category}`).includes(term)) score = 3;
        return { product, score };
      })
      .filter(({ score }) => score < 99)
      .sort((a, b) => a.score - b.score || a.product.name.localeCompare(b.product.name, 'pt-BR'))
      .slice(0, 6)
      .map(({ product }) => product);
  }, [products, query, category]);

  const hasFilters = Boolean(query.trim()) || category !== 'todas' || sort !== 'featured';
  const selectedSortLabel = sortOptions.find((option) => option.value === sort)?.label ?? 'Destaques';
  const showSuggestions = searchFocused && Boolean(query.trim()) && suggestions.length > 0;

  function clearFilters() {
    setQuery('');
    setCategory('todas');
    setSort('featured');
    router.replace('/produtos', { scroll: false });
  }

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    const params = new URLSearchParams();
    if (query.trim()) params.set('busca', query.trim());
    if (nextCategory !== 'todas') params.set('categoria', nextCategory);
    router.replace(`/produtos${params.size ? `?${params}` : ''}`, { scroll: false });
  }

  return (
    <div className="catalog-interface">
      <div className="catalog-tools">
        <div className="catalog-search-wrap">
          <label htmlFor="catalog-search">Encontre uma peça</label>
          <div className="catalog-search-area" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setSearchFocused(false); }} onKeyDown={(event) => {
            if (event.key === 'Escape') { event.preventDefault(); document.getElementById('catalog-search')?.focus(); setSearchFocused(false); }
            const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('.catalog-search-suggestion'));
            const index = links.indexOf(event.target as HTMLAnchorElement);
            if (event.key === 'ArrowDown' && links.length) { event.preventDefault(); links[(index + 1) % links.length]?.focus(); }
            if (event.key === 'ArrowUp' && links.length) { event.preventDefault(); if (index > 0) links[index - 1]?.focus(); else document.getElementById('catalog-search')?.focus(); }
          }}>
            <div className="catalog-search-control">
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Nome da peça"
                autoComplete="off"
                aria-controls={showSuggestions ? 'catalog-search-suggestions' : undefined}
              />
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
            </div>

            {showSuggestions && (
              <div id="catalog-search-suggestions" className="catalog-search-suggestions" role="navigation" aria-label="Sugestões de peças">
                {suggestions.map((product) => {
                  const image = product.images?.[0] || '/images/placeholder.svg';
                  return (
                    <Link key={product.id} href={`/produtos/${product.id}`} className="catalog-search-suggestion">
                      <span className="catalog-search-suggestion-image">
                        <Image src={image} alt="" width={54} height={54} />
                      </span>
                      <span className="catalog-search-suggestion-copy">
                        <strong>{product.name}</strong>
                        <small>{formatBRL(productPrice(product))}</small>
                      </span>
                      <span className="catalog-search-suggestion-arrow" aria-hidden="true">↗</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div
          className="catalog-sort-wrap catalog-custom-sort"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSortOpen(false);
          }}
        >
          <span id="catalog-sort-label" className="catalog-sort-label">Ordenar por</span>
          <button
            type="button"
            className="catalog-sort-trigger"
            ref={sortButton}
            aria-label={`Ordenar por: ${selectedSortLabel}`}
            aria-controls={sortOpen ? 'catalog-sort-options' : undefined}
            onKeyDown={(event) => { if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); setSortOpen(true); } }}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            onClick={() => setSortOpen((open) => !open)}
          >
            <span>{selectedSortLabel}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5.5 7.5 4.5 4.5 4.5-4.5" /></svg>
          </button>
          {sortOpen && (
            <div id="catalog-sort-options" ref={sortMenu} className="catalog-sort-menu" role="listbox" aria-label="Ordenar peças" onKeyDown={(event) => {
              const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=option]'));
              const index = options.indexOf(event.target as HTMLButtonElement);
              if (event.key === 'Escape') { event.preventDefault(); setSortOpen(false); sortButton.current?.focus(); }
              if (event.key === 'ArrowDown') { event.preventDefault(); options[(index + 1) % options.length]?.focus(); }
              if (event.key === 'ArrowUp') { event.preventDefault(); options[(index - 1 + options.length) % options.length]?.focus(); }
              if (event.key === 'Home') { event.preventDefault(); options[0]?.focus(); }
              if (event.key === 'End') { event.preventDefault(); options[options.length - 1]?.focus(); }
            }}>
              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  role="option"
                  aria-selected={sort === option.value}
                  className="catalog-sort-option"
                  onClick={() => {
                    setSort(option.value);
                    setSortOpen(false);
                    sortButton.current?.focus();
                  }}
                >
                  <span>{option.label}</span>
                  {sort === option.value && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="catalog-category-row" role="group" aria-label="Filtrar por categoria">
        <button type="button" aria-pressed={category === 'todas'} className="catalog-category-option" onClick={() => selectCategory('todas')}>Todas</button>
        {categories.map((item) => (
          <button type="button" key={item.id} aria-pressed={category === item.id} className="catalog-category-option" onClick={() => selectCategory(item.id)}>{item.name}</button>
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
          <p>Tente outra inicial, outro nome ou volte para a coleção completa.</p>
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
