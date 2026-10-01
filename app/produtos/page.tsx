import type { Metadata } from 'next';
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
    images: [{ url: '/produtos/igrejinha-luminaria-trancoso.jpg', width: 960, height: 960, alt: 'Igrejinha do Quadrado de Trancoso em cerâmica' }],
  },
  twitter: { card: 'summary_large_image', title: 'Coleção de cerâmica | Agô Trancoso', description: 'Igrejinhas, decoração e presentes em cerâmica. Conheça a coleção e compre online.', images: ['/produtos/igrejinha-luminaria-trancoso.jpg'] },
};

export default async function ProdutosPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => typeof value === 'string' ? value : value?.[0] || '';
  const products = getAllProducts();
  const categories = getAllCategories();
  const requestedCategory = first(params.categoria);
  const initialFilters = {
    query: first(params.busca),
    category: categories.some(category => category.id === requestedCategory) ? requestedCategory : 'todas',
    budget: first(params.ate),
    sort: first(params.ordem),
  };

  return (
    <div className="catalog-page">
      <div className="site-container catalog-shell">
        <header className="catalog-intro">
          <div>
            <p className="eyebrow">Coleção Agô</p>
            <h1>Cerâmica para viver e guardar.</h1>
          </div>
        </header>

        <ProdutosClient products={products} categories={categories} initialFilters={initialFilters} />
      </div>
    </div>
  );
}
