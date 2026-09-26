import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllProducts, getAllCategories } from '@/lib/products';
import ProdutosClient from './ProdutosClient';

export const metadata: Metadata = {
  title: { absolute: 'Cerâmica e Artesanato em Trancoso | Coleção Agô Trancoso' },
  description: 'Conheça a coleção da Agô Trancoso: igrejinhas do Quadrado, cerâmica artesanal, decoração, peças de fé e presentes feitos à mão em Trancoso, Bahia.',
  alternates: { canonical: '/produtos' },
  openGraph: {
    title: 'Cerâmica e Artesanato em Trancoso | Coleção Agô Trancoso',
    description: 'Igrejinhas do Quadrado, cerâmica artesanal, decoração, fé e presentes feitos à mão em Trancoso, Bahia.',
    url: '/produtos',
    siteName: 'Agô Trancoso',
    locale: 'pt_BR',
    type: 'website',
  },
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
          <p>O Quadrado é uma das referências da Agô. Encontre igrejinhas de Trancoso, objetos para casa, símbolos de fé e opções para presentear.</p>
        </header>

        <Suspense fallback={<div className="catalog-loading" role="status">Carregando coleção…</div>}>
          <ProdutosClient products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
