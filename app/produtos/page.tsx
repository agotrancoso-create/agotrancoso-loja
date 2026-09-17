import { Suspense } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products';
import ProdutosClient from './ProdutosClient';

export const metadata = {
  title: 'Coleção | Agô Trancoso',
  description: 'Conheça a coleção de cerâmicas e objetos feitos à mão da Agô Trancoso, inspirados na Bahia, em Trancoso e no jeito brasileiro de viver.',
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
          <p>Cerâmicas e objetos feitos à mão, inspirados na Bahia e nas formas de Trancoso.</p>
        </div>
        <Suspense fallback={null}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
