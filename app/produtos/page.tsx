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
    <div className="max-w-content mx-auto px-5 md:px-8 py-14">
      <h1 className="font-serif text-3xl text-marrom mb-8">Coleção</h1>
      <Suspense fallback={null}>
        <ProdutosClient products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
