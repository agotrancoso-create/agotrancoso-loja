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
    <div className="catalog-page bg-areia">
      <div className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-4">A coleção</p>
          <h1 className="text-5xl md:text-7xl leading-none mb-5">Peças para decorar, presentear e guardar.</h1>
          <p className="text-sm md:text-base text-marrom/65 leading-7">Cerâmicas e objetos artesanais da Agô Trancoso.</p>
        </div>
        <Suspense fallback={null}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
