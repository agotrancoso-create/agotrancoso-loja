import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products';
import ProdutosClient from './ProdutosClient';

export const metadata: Metadata = {
  title: { absolute: 'Coleção | Agô Trancoso' },
  description: 'Conheça a coleção de peças de cerâmica feitas à mão da Agô Trancoso.',
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
            <h1>Peças para morar, presentear e guardar.</h1>
          </div>
          <p>Cerâmicas feitas à mão, inspiradas nas formas, símbolos e memórias de Trancoso e da Bahia.</p>
        </header>

        <Suspense fallback={<div className="catalog-loading" aria-label="Carregando coleção" />}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
