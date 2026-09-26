import type { MetadataRoute } from 'next';
import { SITE_DOMAIN } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/confirmacao', '/api/'],
      },
    ],
    sitemap: [
      `${SITE_DOMAIN}/sitemap.xml`,
      `${SITE_DOMAIN}/image-sitemap.xml`,
    ],
    host: SITE_DOMAIN,
  };
}
