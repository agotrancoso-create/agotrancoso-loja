'use client';

import Image from '@/components/ProductImage';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { productSearchScore } from '@/lib/product-search';
import { getAttentionCoverImage, sortProductsByAttention } from '@/lib/merchandising';
import { trackCatalogFilter, trackCatalogSearch, trackCatalogSort, trackViewItemList } from '@/lib/marketing-analytics';

const budgetOptions = [
  { value: '150', label: 'Até R$ 150' },
  { value: '300', label: 'Até R$ 300' },
  { value: '500', label: 'Até R$ 500' },
  { value: '1000', label: 'Até R$ 1.000' },
  { value: '1500', label: 'Até R$ 1.500' },
  { value: '3000', label: 'Até R$ 3.000' },
  { value: 'above-3000', label: 'Acima de R$ 3.000' },
] as const;
type BudgetFilter = '' | (typeof budgetOptions)[number]['value'];
const budgetValues = new Set<string>(budgetOptions.map(option => option.value));
function readBudget(value: string | null): BudgetFilter { return value && budgetValues.has(value) ? value as BudgetFilter : ''; }

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

function matchesBudget(product: Product, budget: BudgetFilter) {
  if (!budget) return true;
  const price = productPrice(product);
  return budget === 'above-3000' ? price > 3000 : price <= Number(budget);
}

function budgetLabel(value: BudgetFilter) {
  if (!value) return 'Todos os valores';
  return budgetOptions.find(option => option.value === value)?.label ?? value;
}

export default function ProdutosClient({ products, categories, initialFilters }: { products: Product[]; categories: Category[]; initialFilters: { query: string; category: string; budget: string } }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialFilters.query);
  const [category, setCategory] = useState(initialFilters.category);
  const [budget, setBudget] = useState<BudgetFilter>(readBudget(initialFilters.budget));
  const [sort, setSort] = useState<SortOption>('featured');
  const [searchFocused, setSearchFocused] = useState(false);
  const sortButton = useRef<HTMLButtonElement>(null);
  const sortMenu = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const lastListEvent = useRef('');
  const lastSearchEvent = useRef('');
  const previousCategory = useRef(category);
  const previousSort = useRef<SortOption>(sort);

  useEffect(() => { if (sortOpen) sortMenu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus(); }, [sortOpen]);
  const urlQuery = initialFilters.query;
  const urlCategory = initialFilters.category;
  const urlBudget = readBudget(initialFilters.budget);

  useEffect(() => {
    setQuery(urlQuery);
    setCategory(urlCategory);
    setBudget(urlBudget);
  }, [urlQuery, urlCategory, urlBudget]);

  const attentionProducts = useMemo(() => sortProductsByAttention(products), [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    const matches = attentionProducts.filter((product) => {
      if (!product.available) return false;
      if (!matchesBudget(product, budget)) return false;
      if (normalizedQuery && !productSearchScore(product, query)) return false;
      if (category !== 'todas' && product.category !== category) return false;
      return true;
    });

    if (sort === 'price-asc') return [...matches].sort((a, b) => productPrice(a) - productPrice(b));
    if (sort === 'price-desc') return [...matches].sort((a, b) => productPrice(b) - productPrice(a));
    if (sort === 'name') return [...matches].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return matches;
  }, [attentionProducts, query, category, sort, budget]);

  const selectedCategoryLabel = category === 'todas'
    ? 'Toda a coleção'
    : categories.find((item) => item.id === category)?.name || category;
  const listName = category === 'todas' ? 'Coleção Agô' : `Coleção Agô · ${selectedCategoryLabel}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const listKey = `${category}|${sort}|${budget}|${normalize(query)}|${filtered.map((product) => product.id).join(',')}`;
      if (lastListEvent.current !== listKey) {
        lastListEvent.current = listKey;
        trackViewItemList(filtered.map((product) => ({
          item_id: product.id,
          item_name: product.name,
          price: productPrice(product),
          quantity: 1,
          item_category: product.category,
        })), listName);
      }

      const term = query.trim();
      if (term.length >= 2) {
        const searchKey = `${normalize(term)}|${filtered.length}`;
        if (lastSearchEvent.current !== searchKey) {
          lastSearchEvent.current = searchKey;
          trackCatalogSearch(term, filtered.length);
        }
      }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [category, filtered, listName, query, sort, budget]);

  useEffect(() => {
    if (previousCategory.current === category) return;
    previousCategory.current = category;
    trackCatalogFilter('categoria', selectedCategoryLabel, filtered.length);
  }, [category, selectedCategoryLabel, filtered.length]);

  useEffect(() => {
    if (previousSort.current === sort) return;
    previousSort.current = sort;
    trackCatalogSort(sort, filtered.length);
  }, [sort, filtered.length]);

  const suggestions = useMemo(() => {
    const term = normalize(query);
    if (!term) return [];

    return attentionProducts
      .filter((product) => product.available && (category === 'todas' || product.category === category) && matchesBudget(product, budget))
      .map((product) => {
        const match = productSearchScore(product, query);
        const score = match ? 100 - match : 999;
        return { product, score };
      })
      .filter(({ score }) => score < 99)
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map(({ product }) => product);
  }, [attentionProducts, query, category, budget]);

  const hasFilters = Boolean(query.trim()) || category !== 'todas' || sort !== 'featured' || Boolean(budget);
  const selectedSortLabel = sortOptions.find((option) => option.value === sort)?.label ?? 'Destaques';
  const showSuggestions = searchFocused && Boolean(query.trim()) && suggestions.length > 0;

  function clearFilters() {
    setQuery('');
    setCategory('todas');
    setSort('featured');
    setBudget('');
    router.replace('/produtos', { scroll: false });
  }

  function selectCategory(nextCategory: string) {
    setCategory(nextCategory);
    const params = new URLSearchParams();
    if (query.trim()) params.set('busca', query.trim());
    if (nextCategory !== 'todas') params.set('categoria', nextCategory);
    if (budget) params.set('ate', budget);
    router.replace(`/produtos${params.size ? `?${params}` : ''}`, { scroll: false });
  }

  function selectBudget(value: string) {
    const nextBudget = readBudget(value);
    setBudget(nextBudget);
    const params = new URLSearchParams();
    if (query.trim()) params.set('busca', query.trim());
    if (category !== 'todas') params.set('categoria', category);
    if (nextBudget) params.set('ate', nextBudget);
    router.replace(`/produtos${params.size ? `?${params}` : ''}`, { scroll: false });
    const matchingCount = products.filter(product => product.available && matchesBudget(product, nextBudget) && (category === 'todas' || product.category === category) && productSearchScore(product, query)).length;
    trackCatalogFilter('faixa_preco', budgetLabel(nextBudget), matchingCount);
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
                  const image = getAttentionCoverImage(product);
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

      <div className="catalog-budget-control" role="group" aria-labelledby="catalog-budget-label">
        <span id="catalog-budget-label">Faixa de preço</span>
        <div className="catalog-budget-options">
          <button type="button" aria-pressed={!budget} onClick={() => selectBudget('')}>Todos os valores</button>
          {budgetOptions.map(option => (
            <button type="button" key={option.value} aria-pressed={budget === option.value} onClick={() => selectBudget(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
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
          {filtered.map((product) => <ProductCard key={product.id} product={product} listName={listName} />)}
        </div>
      )}
    </div>
  );
}
