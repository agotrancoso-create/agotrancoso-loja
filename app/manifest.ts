import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Agô Trancoso',
    short_name: 'Agô',
    description: 'Cerâmica artesanal inspirada em Trancoso, disponível no Quadrado de Trancoso, Bahia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf5eb',
    theme_color: '#875038',
    lang: 'pt-BR',
    categories: ['shopping', 'lifestyle'],
    icons: [
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
