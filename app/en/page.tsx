import type { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: { absolute: 'Agô Trancoso | Handmade ceramics from Trancoso, Brazil' },
  description: 'Handmade ceramics inspired by Trancoso Historic Square in Bahia, Brazil. Discover little churches, ceramic houses, keepsakes and decorative pieces from Agô Trancoso.',
  alternates: {
    canonical: '/en',
    languages: { 'pt-BR': '/', en: '/en' },
  },
  openGraph: {
    title: 'Agô Trancoso | Handmade ceramics from Trancoso, Brazil',
    description: 'Handmade ceramics inspired by Trancoso Historic Square, Bahia.',
    url: '/en',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/hero.jpg', alt: 'Agô Trancoso ceramic pieces at Trancoso Historic Square' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agô Trancoso | Handmade ceramics from Brazil',
    description: 'Ceramic pieces inspired by Trancoso Historic Square in Bahia, Brazil.',
    images: ['/hero.jpg'],
  },
};

export default HomePage;
