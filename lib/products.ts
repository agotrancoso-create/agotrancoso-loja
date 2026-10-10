import productsData from '@/data/products.json';
import { Product, Category, CartItem } from './types';

const RECOVERED_PRODUCT_GALLERIES: Record<string, string[]> = {
  // A Igrejinha P conserva sua capa histórica visualmente aprovada.
  // A Igrejinha Luminária menor usa a nova fotografia frontal aprovada,
  // sem reutilizar a antiga imagem da luminária por associação histórica.
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'igrejinha-luminaria-trancoso': [
    '/produtos/catalogo/igrejinha-luminaria-frontal-960-lossless.webp',
  ],
  'casal-pretos-velhos': [
    '/produtos/catalogo/casal-pretos-velhos-1.jpg',
    '/produtos/catalogo/casal-pretos-velhos-2.jpg',
    '/produtos/catalogo/casal-pretos-velhos-3.jpg',
  ],
  'casinha-luminaria': [
    '/produtos/casinha-luminaria.jpg',
    '/produtos/catalogo/casinha-luminaria-1.jpg',
    '/produtos/catalogo/casinha-luminaria-2.jpg',
    '/produtos/catalogo/casinha-luminaria-3.jpg',
    '/produtos/catalogo/casinha-luminaria-4.jpg',
  ],
  'colar-igreja-quadrado': [
    '/produtos/catalogo/colar-igreja-quadrado-frente.jpg',
    '/produtos/colar-igreja-quadrado.jpg',
  ],
  'ima-igrejinha-trancoso': [
    '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg',
    '/produtos/catalogo/ima-igrejinha-trancoso-conjunto.jpg',
  ],
  'miniatura-quadrado-trancoso': [
    '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-6.avif',
    '/produtos/catalogo/miniatura-quadrado-trancoso-7.avif',
    '/produtos/catalogo/miniatura-quadrado-trancoso-5.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-2.jpg',
  ],
};

const PRODUCT_NAME_CORRECTIONS: Record<string, string> = {
  'miniatura-quadrado-trancoso': 'Miniatura do Quadrado de Trancoso para Pendurar',
  'igreja-quadrado-gg': 'Igreja do Quadrado (GG) — Luminária',
};

const PRODUCT_IMAGE_ALT_CORRECTIONS: Record<string, string> = {
  'miniatura-quadrado-trancoso': 'Miniatura do Quadrado de Trancoso em cerâmica para pendurar ou apoiar na decoração',
  'casal-pretos-velhos': 'Casal de Pretos-Velhos em cerâmica artesanal da Agô Trancoso, Bahia',
};

const PRODUCT_DIMENSIONS_CORRECTIONS: Record<string, string> = {
  'miniatura-quadrado-trancoso': 'Comprimento: 19 cm · Altura com a cruz da igrejinha do meio: 6,5 cm',
  'igreja-quadrado-p': 'Altura: 3,5 cm · Largura: 4 cm',
  'igreja-quadrado-m': 'Altura: 4,5 cm · Largura: 5 cm',
  'igrejinha-luminaria-trancoso': 'Altura: 6,5 cm · Largura: 7,5 cm',
  'igreja-quadrado-gg': 'Altura: 16 cm · Largura: 23 cm',
};

function normalizeProduct(product: Product): Product {
  const source = RECOVERED_PRODUCT_GALLERIES[product.id] ?? product.images ?? [];
  const images = Array.from(new Set(source.filter(Boolean)));
  return {
    ...product,
    name: PRODUCT_NAME_CORRECTIONS[product.id] ?? product.name,
    dimensions: PRODUCT_DIMENSIONS_CORRECTIONS[product.id] ?? product.dimensions,
    images: images.length ? images : ['/images/placeholder.svg'],
    imageAlt: (PRODUCT_IMAGE_ALT_CORRECTIONS[product.id] ?? product.imageAlt) || product.name,
  };
}

export function getAllProducts(): Product[] {
  return (productsData.products as Product[]).map(normalizeProduct);
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

export function getEffectivePrice(product: Product): number {
  return product.promotionalPrice ?? product.price;
}

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

    const effectivePrice = getEffectivePrice(product);
    const subtotal = Number((effectivePrice * item.quantity).toFixed(2));
    lines.push({ productId: product.id, name: product.name, unitPrice: effectivePrice, quantity: item.quantity, subtotal });
  }

  const total = Number(lines.reduce((sum, line) => sum + line.subtotal, 0).toFixed(2));
  return { lines, total, errors, valid: errors.length === 0 && lines.length > 0 };
}
