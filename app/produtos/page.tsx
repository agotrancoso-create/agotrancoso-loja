import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products';
import ProdutosClient from './ProdutosClient';

export const metadata: Metadata = {
  title: { absolute: 'Coleção | Agô Trancoso' },
  description: 'Conheça a coleção de cerâmicas feitas à mão da Agô Trancoso: Trancoso como principal inspiração, além de decoração, fé e presentes.',
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
            <h1>Peças para olhar, viver, presentear e guardar.</h1>
          </div>
          <p>Trancoso ocupa o centro da coleção, sem limitar o que criamos. Aqui também entram objetos para casa, fé, devoção, presentes e outros símbolos brasileiros, sempre feitos à mão.</p>
        </header>

        <Suspense fallback={<div className="catalog-loading" aria-label="Carregando coleção" />}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
