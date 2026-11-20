import productsData from '@/data/products.json';
import { pieceDimensionsText } from './catalog-measurements';
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
    '/produtos/atualizadas-20261013/casal-pretos-velhos-3.jpg',
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
  'casal-pretos-velhos': 'Casal de Pretos-Velhos em cerâmica disponível na Agô Trancoso',
};

function normalizeProduct(product: Product): Product {
  const source = RECOVERED_PRODUCT_GALLERIES[product.id] ?? product.images ?? [];
  const images = Array.from(new Set(source.filter(Boolean)));
  return {
    ...product,
    name: PRODUCT_NAME_CORRECTIONS[product.id] ?? product.name,
    dimensions: pieceDimensionsText(product.id) ?? product.dimensions,
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
  const products = getAllProducts();
  const direct = products.find((product) => product.id === id);
  if (direct) return direct;
  // IDs canônicos derivados garantem preço e tamanho consistentes também na API de pagamento.
  const base = products.find((product) => product.id === 'rabo-de-baleia');
  const variation = base?.variants?.find((v) => id === `${base.id}-${v.name.toLowerCase()}`);
  if (base && variation) {
    return {
      ...base, id,
      name: `Rabo de Baleia ${variation.name} (${variation.heightCm} cm)`,
      description: `Escultura decorativa de cerâmica em forma de cauda de baleia, tamanho ${variation.name}, com ${variation.heightCm} cm de altura.`,
      price: variation.price, promotionalPrice: null,
      dimensions: pieceDimensionsText(id) ?? variation.dimensions,
      images: [variation.image || '/images/placeholder.svg'],
      imageAlt: variation.image ? `Rabo de Baleia tamanho ${variation.name}` : 'Foto do tamanho P ainda não disponível',
      available: variation.stock != null && variation.stock > 0,
      displayOnly: false,
      variants: undefined,
      stock: variation.stock,
    };
  }

  // Cada acabamento da Sagrada Família é um item próprio no carrinho/checkout.
  // O preço e o estoque são sempre extraídos do catálogo confiável no servidor.
  const family = products.find(product => product.id === 'sagrada-familia');
  const finish = family?.finishes?.find(option => id === `${family.id}-${option.id}`);
  if (!family || !finish || finish.price == null || finish.stock == null) return undefined;
  return {
    ...family,
    id,
    name: `Sagrada Família em Cerâmica — ${finish.name}`,
    description: `Sagrada Família em cerâmica no acabamento ${finish.name.toLowerCase()}, com José, Maria e o Menino Jesus.${finish.id === 'colorida' ? ' A alça no verso permite pendurar a peça na parede.' : ''}`,
    price: finish.price,
    promotionalPrice: null,
    stock: finish.stock,
    available: finish.stock > 0,
    displayOnly: false,
    finishes: undefined,
    images: [finish.image],
    imageAlt: `Sagrada Família em cerâmica, acabamento ${finish.name.toLowerCase()}`,
  };
}

type CatalogOffer = { product: Product; groupId?: string; size?: string; color?: string };

// Cada link anunciado deve abrir a mesma peça que o checkout precifica.
export function getCatalogOffers(products = getAllProducts()): CatalogOffer[] {
  return products.flatMap<CatalogOffer>((parent) => {
    const options = [
      ...(parent.variants ?? []).map(v => ({ id: parent.id + '-' + v.name.toLowerCase(), size: v.name })),
      ...(parent.finishes ?? []).map(f => ({ id: parent.id + '-' + f.id, color: f.color })),
    ];
    if (!options.length) return [{ product: parent }];
    return options.flatMap(({ id, ...attributes }) => {
      const product = getProductById(id);
      return product ? [{ product, groupId: parent.id, ...attributes }] : [];
    });
  });
}

export function getCatalogPageIds(): string[] {
  const parents = getAllProducts();
  return Array.from(new Set([...parents.map(p => p.id), ...getCatalogOffers(parents).map(o => o.product.id)]));
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
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || (product.stock != null && item.quantity > product.stock)) {
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
