import type { MetadataRoute } from 'next';
import { SITE_DOMAIN } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/checkout', '/confirmacao', '/api/'] }],
    sitemap: `${SITE_DOMAIN}/sitemap.xml`,
  };
}

// Deploy marker: publicar versao refinada da Agô em 2026-09-17.
