import productsData from '@/data/products.json';
import { Product, Category, CartItem } from './types';

// -----------------------------------------------------------------------
// TODA a loja lê os produtos a partir deste arquivo.
// Isso garante que exista UMA ÚNICA fonte de preços (data/products.json).
// -----------------------------------------------------------------------

// Correção visual conforme o catálogo real da Agô.
// Os nomes históricos dos arquivos dessas duas peças ficaram invertidos no acervo,
// por isso a referência correta é feita aqui sem alterar preços ou dados comerciais.
const CONFIRMED_IMAGE_OVERRIDES: Record<string, string[]> = {
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'igrejinha-luminaria-trancoso': [
    '/produtos/igreja-quadrado-p.jpg',
  ],
};

function normalizeProductImages(product: Product): Product {
  const source = CONFIRMED_IMAGE_OVERRIDES[product.id] ?? product.images ?? [];
  const images = Array.from(new Set(source.filter(Boolean)));
  return {
    ...product,
    images: images.length ? images : ['/images/placeholder.svg'],
    imageAlt: product.imageAlt || product.name,
  };
}

export function getAllProducts(): Product[] {
  return (productsData.products as Product[]).map(normalizeProductImages);
}

export function getAllCategories(): Category[] {
  return productsData.categories as Category[];
}

export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

export function getAvailableProducts(): Product[] {
  return getAllProducts().filter((p) => p.available);
}

/** Preço que deve ser cobrado: usa o promocional quando existir. */
export function getEffectivePrice(product: Product): number {
  return product.promotionalPrice ?? product.price;
}

/**
 * Recalcula o valor total de um carrinho a partir do catálogo OFICIAL.
 * NUNCA confie em preços/subtotais enviados pelo navegador: esta função
 * é a única fonte da verdade usada pelo backend (API de checkout).
 *
 * Retorna erro se algum produto não existir ou estiver indisponível.
 */
export function calculateCartTotals(items: CartItem[]) {
  const lines: {
    productId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[] = [];

  const errors: string[] = [];

  for (const item of items) {
    const product = getProductById(item.productId);

    if (!product) {
      errors.push(`Produto não encontrado: ${item.productId}`);
      continue;
    }
    if (!product.available) {
      errors.push(`Produto indisponível: ${product.name}`);
      continue;
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      errors.push(`Quantidade inválida para: ${product.name}`);
      continue;
    }

    const effectivePrice = product.promotionalPrice ?? product.price;

    const subtotal = Number((effectivePrice * item.quantity).toFixed(2));
    lines.push({
      productId: product.id,
      name: product.name,
      unitPrice: effectivePrice,
      quantity: item.quantity,
      subtotal,
    });
  }

  const total = Number(lines.reduce((sum, l) => sum + l.subtotal, 0).toFixed(2));

  return { lines, total, errors, valid: errors.length === 0 && lines.length > 0 };
}
