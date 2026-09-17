import { Suspense } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products';
import ProdutosClient from './ProdutosClient';

export const metadata = {
  title: 'Coleção | Agô Trancoso',
  description: 'Conheça as peças de cerâmica e artesanato da Agô Trancoso.',
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
          <p>Cerâmicas e objetos artesanais da Agô Trancoso.</p>
        </div>
        <Suspense fallback={null}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
