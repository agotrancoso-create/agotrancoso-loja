'use client';

import { useMemo, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/types';

type Props = {
  products: Product[];
};

type FilterId = 'todos' | 'trancoso' | 'igrejinhas' | 'decoracao' | 'fe-devocao' | 'presentes';

const filters: { id: FilterId; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'trancoso', label: 'Trancoso' },
  { id: 'igrejinhas', label: 'Igrejas' },
  { id: 'fe-devocao', label: 'Fé & devoção' },
  { id: 'decoracao', label: 'Casa & decoração' },
  { id: 'presentes', label: 'Presentes' },
];

const INITIAL_LIMIT = 8;

export default function HomeInteractiveCollection({ products }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterId>('todos');
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    if (activeFilter === 'todos') return products;
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter, products]);

  const visible = expanded ? filtered : filtered.slice(0, INITIAL_LIMIT);
  const hasMore = filtered.length > INITIAL_LIMIT;

  function selectFilter(filter: FilterId) {
    setActiveFilter(filter);
    setExpanded(false);
  }

  return (
    <section className="ago-home-shop" aria-labelledby="ago-home-shop-title">
      <div className="ago-container">
        <div className="ago-home-shop-intro">
          <div>
            <p className="eyebrow">Cerâmica artesanal · Trancoso, Bahia</p>
            <h1 id="ago-home-shop-title">Trancoso, em cerâmica.</h1>
          </div>
          <div className="ago-home-shop-intro-copy">
            <p>Peças feitas à mão para casa, fé e presente — com o Quadrado como ponto de partida.</p>
            <span>Escolha pela imagem. Descubra os detalhes depois.</span>
          </div>
        </div>

        <div className="ago-filter-shell">
          <div className="ago-filter-row" role="group" aria-label="Filtrar peças da coleção">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`ago-filter-chip${activeFilter === filter.id ? ' is-active' : ''}`}
                aria-pressed={activeFilter === filter.id}
                onClick={() => selectFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <p className="ago-filter-count" aria-live="polite">
            {visible.length} de {filtered.length} {filtered.length === 1 ? 'peça' : 'peças'}
          </p>
        </div>

        <div className="ago-home-product-grid" data-filter={activeFilter}>
          {visible.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={activeFilter === 'todos' && index < 4} />
          ))}
        </div>

        {hasMore && (
          <div className="ago-home-grid-more">
            <button type="button" className="ago-outline-action" onClick={() => setExpanded((value) => !value)}>
              {expanded ? 'Mostrar menos' : `Ver mais ${filtered.length - INITIAL_LIMIT} peças`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
