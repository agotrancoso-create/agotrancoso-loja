import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products';
import ProdutosClient from './ProdutosClient';

export const metadata: Metadata = {
  title: { absolute: 'Coleção | Agô Trancoso' },
  description: 'Conheça a coleção da Agô: cerâmica brasileira para casa, fé e presente, com Trancoso como principal ponto de partida.',
  alternates: { canonical: '/produtos' },
};

export default function ProdutosPage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  return (
    <div className="catalog-page">
      <div className="site-container catalog-shell">
        <header className="catalog-intro">
          <div>
            <p className="eyebrow">Coleção Agô</p>
            <h1>Tudo por aqui.</h1>
          </div>
          <p>Trancoso aparece muito porque é de onde partimos. A coleção também passa por casa, fé, presente e outras referências brasileiras.</p>
        </header>

        <Suspense fallback={<div className="catalog-loading" aria-label="Carregando coleção" />}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
