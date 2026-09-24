import productsData from '@/data/products.json';
import { Product, Category, CartItem } from './types';

// -----------------------------------------------------------------------
// TODA a loja lê os produtos a partir deste arquivo.
// Isso garante que exista UMA ÚNICA fonte de preços (data/products.json).
// -----------------------------------------------------------------------

/**
 * Fonte de verdade para a foto principal de cada peça.
 * Evita que galerias antigas/crossadas façam uma peça aparecer com a foto
 * de outro produto.
 */
const PRODUCT_PRIMARY_IMAGES: Record<string, string> = {
  'igreja-quadrado-p': '/produtos/igreja-quadrado-p.jpg',
  'igreja-quadrado-m': '/produtos/igreja-quadrado-m.jpg',
  'igreja-quadrado-gg': '/produtos/igreja-quadrado-gg.jpg',
  'igrejinha-luminaria-trancoso': '/produtos/igrejinha-luminaria-trancoso.jpg',
  'casinha-luminaria': '/produtos/casinha-luminaria.jpg',
  'miniatura-quadrado-trancoso': '/produtos/miniatura-quadrado-trancoso.jpg',
  'cruzeiro-do-quadrado': '/produtos/cruzeiro-do-quadrado.jpg',
  'mobile-trancoso': '/produtos/mobile-trancoso.jpg',
  'estatueta-iemanja': '/produtos/estatueta-iemanja.jpg',
  'nossa-senhora-grande': '/produtos/nossa-senhora-grande.jpg',
  'presepio-em-ceramica': '/produtos/presepio-em-ceramica.jpg',
  'casal-pretos-velhos': '/produtos/casal-pretos-velhos.jpg',
  'nossa-senhora-aparecida': '/produtos/nossa-senhora-aparecida.jpg',
  'divino-espirito-santo': '/produtos/divino-espirito-santo.jpg',
  'terco-em-ceramica': '/produtos/terco-em-ceramica.jpg',
  'rosario-trancoso': '/produtos/rosario-trancoso.jpg',
  'esfera-decorativa': '/produtos/esfera-decorativa.jpg',
  'colar-igreja-quadrado': '/produtos/colar-igreja-quadrado.jpg',
  'ima-igrejinha-trancoso': '/produtos/ima-igrejinha-trancoso.jpg',
};

/**
 * Galerias confirmadas a partir das fotos enviadas pela Agô.
 * A primeira foto de cada lista é sempre a foto principal já usada na vitrine.
 */
const PRODUCT_GALLERY_IMAGES: Record<string, string[]> = {
  'igreja-quadrado-p': [
    '/produtos/igreja-quadrado-p.jpg',
    '/produtos/galeria/igreja-quadrado-p-2.jpg',
  ],
  'casinha-luminaria': [
    '/produtos/casinha-luminaria.jpg',
    '/produtos/galeria/casinha-luminaria-2.jpg',
    '/produtos/galeria/casinha-luminaria-3.jpg',
  ],
  'estatueta-iemanja': [
    '/produtos/estatueta-iemanja.jpg',
    '/produtos/galeria/estatueta-iemanja-2.jpg',
    '/produtos/galeria/estatueta-iemanja-3.jpg',
    '/produtos/galeria/estatueta-iemanja-4.jpg',
  ],
  'casal-pretos-velhos': [
    '/produtos/casal-pretos-velhos.jpg',
    '/produtos/galeria/casal-pretos-velhos-2.jpg',
    '/produtos/galeria/casal-pretos-velhos-3.jpg',
  ],
  'divino-espirito-santo': [
    '/produtos/divino-espirito-santo.jpg',
    '/produtos/galeria/divino-espirito-santo-2.jpg',
  ],
  'esfera-decorativa': [
    '/produtos/esfera-decorativa.jpg',
    '/produtos/galeria/esfera-decorativa-2.jpg',
  ],
  'colar-igreja-quadrado': [
    '/produtos/colar-igreja-quadrado.jpg',
    '/produtos/galeria/colar-igreja-quadrado-2.jpg',
  ],
  'ima-igrejinha-trancoso': [
    '/produtos/ima-igrejinha-trancoso.jpg',
    '/produtos/galeria/ima-igrejinha-trancoso-2.jpg',
  ],
};

function normalizeProductImages(product: Product): Product {
  const gallery = PRODUCT_GALLERY_IMAGES[product.id];
  if (gallery?.length) {
    return {
      ...product,
      images: gallery,
      imageAlt: product.imageAlt || product.name,
    };
  }

  const primary = PRODUCT_PRIMARY_IMAGES[product.id];
  const existing = product.images ?? [];
  if (!primary) {
    return {
      ...product,
      images: existing.length > 0 ? existing : ['/images/placeholder.svg'],
      imageAlt: product.imageAlt || product.name,
    };
  }

  return {
    ...product,
    images: [primary, ...existing.filter((image) => image !== primary)],
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
 * NUNCA confie em preços/subtotais enviados pelo navegador — esta função
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

    // Se houver preço promocional, ele é o preço oficial cobrado.
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
