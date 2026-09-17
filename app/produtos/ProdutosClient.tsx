'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function ProdutosClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('busca') || '');
  const [category, setCategory] = useState<string>(searchParams.get('categoria') || 'todas');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const filtered = useMemo(() => {
    const q = normalize(query);
    return products.filter((p) => {
      const haystack = normalize(`${p.name} ${p.description} ${p.category}`);
      if (q && !haystack.includes(q)) return false;
      if (category !== 'todas' && p.category !== category) return false;
      if (onlyAvailable && !p.available) return false;
      if (maxPrice !== '' && p.price > maxPrice) return false;
      return true;
    });
  }, [products, query, category, onlyAvailable, maxPrice]);

  const selectedCategory = category === 'todas'
    ? 'Todas as peças'
    : categories.find((item) => item.id === category)?.name || 'Todas as peças';

  return (
    <div>
      <div className="catalog-toolbar">
        <input
          aria-label="Buscar peça"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar peça por nome..."
        />

        <div ref={categoryRef} className="catalog-category-select">
          <button
            type="button"
            className="catalog-category-trigger"
            aria-haspopup="listbox"
            aria-expanded={categoryOpen}
            onClick={() => setCategoryOpen((open) => !open)}
          >
            <span>
              <i className="catalog-category-dot" aria-hidden="true" />
              <span>
                <span className="catalog-category-kicker">Categoria</span>
                <span>{selectedCategory}</span>
              </span>
            </span>
            <i className="catalog-category-chevron" aria-hidden="true" />
          </button>

          {categoryOpen && (
            <div className="catalog-category-menu" role="listbox" aria-label="Categorias">
              <button
                type="button"
                role="option"
                aria-selected={category === 'todas'}
                className="catalog-category-option"
                onClick={() => {
                  setCategory('todas');
                  setCategoryOpen(false);
                }}
              >
                <span>Todas as peças</span>
                <i className="catalog-category-option-mark" aria-hidden="true" />
              </button>
              {categories.map((item) => (
                <button
                  type="button"
                  role="option"
                  key={item.id}
                  aria-selected={category === item.id}
                  className="catalog-category-option"
                  onClick={() => {
                    setCategory(item.id);
                    setCategoryOpen(false);
                  }}
                >
                  <span>{item.name}</span>
                  <i className="catalog-category-option-mark" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>

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

      {filtered.length === 0 ? (
        <p className="text-oliva">Nenhuma peça encontrada com esses filtros.</p>
      ) : (
        <div className="catalog-grid">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
