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
          <p>O Quadrado é uma das referências da Agô. Encontre igrejinhas, objetos para casa, símbolos de fé e opções para presentear.</p>
        </header>

        <Suspense fallback={<div className="catalog-loading" role="status">Carregando coleção…</div>}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
