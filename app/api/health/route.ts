import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products';
import { isFirstPurchaseStorageConfigured } from '@/lib/first-purchase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = getAllProducts();
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const product of products) {
    if (!product.id || ids.has(product.id)) issues.push(`produto-id-invalido:${product.id || 'vazio'}`);
    ids.add(product.id);
    if (!product.name?.trim()) issues.push(`produto-sem-nome:${product.id}`);
    if (!Number.isFinite(product.price) || product.price <= 0) issues.push(`preco-invalido:${product.id}`);
    if (product.promotionalPrice != null && (!Number.isFinite(product.promotionalPrice) || product.promotionalPrice <= 0 || product.promotionalPrice >= product.price)) {
      issues.push(`preco-promocional-invalido:${product.id}`);
    }
    if (!product.category?.trim()) issues.push(`categoria-invalida:${product.id}`);

    const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
    if (!images.length || images.some((image) => typeof image !== 'string' || !image.startsWith('/produtos/') || image.includes('..'))) {
      issues.push(`imagem-invalida:${product.id}`);
    }
    if (new Set(images).size !== images.length) issues.push(`imagem-duplicada:${product.id}`);
  }

  const catalogOk = products.length > 0 && issues.length === 0;
  const status = catalogOk ? 'ok' : 'degraded';
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || null;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      version: commit,
      checks: {
        catalog: { ok: catalogOk, products: products.length, issues },
        firstPurchaseStorage: { configured: isFirstPurchaseStorageConfigured(), optional: true },
      },
    },
    {
      status: catalogOk ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  );
}
