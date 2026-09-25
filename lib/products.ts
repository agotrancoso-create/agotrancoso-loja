import productsData from '@/data/products.json';
import { Product, Category, CartItem } from './types';

// -----------------------------------------------------------------------
// Toda a loja lê nomes, preços, categorias e imagens a partir de products.json.
// As exceções abaixo existem apenas para corrigir nomes de arquivos históricos
// que não correspondem ao produto real e para manter somente originais com
// qualidade suficiente para exibição. Elas não alteram preço, disponibilidade
// ou categoria.
// -----------------------------------------------------------------------

const RECOVERED_PRODUCT_GALLERIES: Record<string, string[]> = {
  // Estes dois arquivos têm nomes históricos invertidos no acervo. A associação
  // abaixo é a associação visual correta e não deve ser inferida pelo filename.
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'igrejinha-luminaria-trancoso': [
    '/produtos/igreja-quadrado-p.jpg',
  ],

  // Galeria conferida com o catálogo Meta enviado pela Agô: dois originais de
  // catálogo e a foto frontal preservada no caminho estável. O thumbnail antigo
  // em /galeria não é usado, pois é uma versão de baixa resolução.
  'casal-pretos-velhos': [
    '/produtos/catalogo/casal-pretos-velhos-1.jpg',
    '/produtos/catalogo/casal-pretos-velhos-2.jpg',
    '/produtos/casal-pretos-velhos.jpg',
  ],
};

function normalizeProductImages(product: Product): Product {
  const source = RECOVERED_PRODUCT_GALLERIES[product.id] ?? product.images ?? [];
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
 * Recalcula o valor total de um carrinho a partir do catálogo oficial.
 * Nunca confie em preços ou subtotais enviados pelo navegador: esta função
 * é a fonte da verdade usada pelo backend da API de checkout.
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
