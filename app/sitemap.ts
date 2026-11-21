import type { MetadataRoute } from 'next';
import { getCatalogPageIds } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/trancoso', priority: 0.98 },
    { path: '/igrejinha-de-trancoso', priority: 0.95 },
    { path: '/produtos', priority: 0.9 },
    { path: '/decoracao-em-ceramica', priority: 0.9 },
    { path: '/artesanato-em-trancoso', priority: 0.9 },
    { path: '/lembrancas-de-trancoso', priority: 0.9 },
    { path: '/nossa-essencia', priority: 0.7 },
    { path: '/contato', priority: 0.7 },
    { path: '/ajuda', priority: 0.7 },
    { path: '/devolucoes', priority: 0.6 },
    { path: '/envio-internacional', priority: 0.8 },
  ];
  const englishStaticRoutes = [
    { path: '/en', priority: 0.95 },
    { path: '/en/produtos', priority: 0.9 },
    { path: '/en/trancoso', priority: 0.9 },
    { path: '/en/igrejinha-de-trancoso', priority: 0.9 },
    { path: '/en/decoracao-em-ceramica', priority: 0.85 },
    { path: '/en/artesanato-em-trancoso', priority: 0.85 },
    { path: '/en/lembrancas-de-trancoso', priority: 0.85 },
    { path: '/en/nossa-essencia', priority: 0.65 },
    { path: '/en/contato', priority: 0.65 },
    { path: '/en/ajuda', priority: 0.6 },
    { path: '/en/devolucoes', priority: 0.6 },
    { path: '/en/envio-internacional', priority: 0.85 },
  ];
  const productIds = getCatalogPageIds();

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${SITE_DOMAIN}${path}`,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...englishStaticRoutes.map(({ path, priority }) => ({
      url: `${SITE_DOMAIN}${path}`,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...productIds.flatMap((id) => [
      {
        url: `${SITE_DOMAIN}/produtos/${id}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: `${SITE_DOMAIN}/en/produtos/${id}`,
        changeFrequency: 'weekly' as const,
        priority: 0.78,
      },
    ]),
  ];
}
