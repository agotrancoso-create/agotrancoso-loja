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
    if (!Array.isArray(product.images) || product.images.length === 0 || product.images.some((image) => typeof image !== 'string' || !image.startsWith('/'))) {
      issues.push(`imagem-invalida:${product.id}`);
    }
  }

  const catalogOk = products.length > 0 && issues.length === 0;
  const status = catalogOk ? 'ok' : 'degraded';

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks: {
        catalog: { ok: catalogOk, products: products.length, issues },
        firstPurchaseStorage: { configured: isFirstPurchaseStorageConfigured(), optional: true },
      },
    },
    {
      status: catalogOk ? 200 : 503,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    },
  );
}
