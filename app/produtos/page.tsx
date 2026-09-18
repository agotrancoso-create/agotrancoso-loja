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
      <div className="catalog-shell">
        <div className="catalog-intro">
          <p className="eyebrow">A coleção</p>
          <h1>Peças para decorar, presentear e guardar.</h1>
          <p>Peças de cerâmica feitas à mão, inspiradas em Trancoso e na Bahia.</p>
        </div>
        <Suspense fallback={null}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
