import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/igrejinha-de-trancoso', priority: 0.95 },
    { path: '/produtos', priority: 0.9 },
    { path: '/nossa-essencia', priority: 0.7 },
    { path: '/contato', priority: 0.7 },
  ];
  const productRoutes = getAllProducts().map((product) => `/produtos/${product.id}`);

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${SITE_DOMAIN}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
    })),
    ...productRoutes.map((path) => ({
      url: `${SITE_DOMAIN}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
