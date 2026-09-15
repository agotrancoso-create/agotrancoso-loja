import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.agotrancoso.com.br';

  const staticRoutes = ['', '/produtos', '/nossa-essencia', '/contato'].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = getAllProducts().map((p) => ({
    url: `${base}/produtos/${p.id}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
