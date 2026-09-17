import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';
import { SITE_DOMAIN } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/produtos', '/nossa-essencia'];
  const productRoutes = getAllProducts().map((product) => `/produtos/${product.id}`);

  return [...staticRoutes.map((path) => ({
    url: `${SITE_DOMAIN}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  })), ...productRoutes.map((path) => ({
    url: `${SITE_DOMAIN}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))];
}
