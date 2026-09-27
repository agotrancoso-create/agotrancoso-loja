import productsData from '@/data/products.json';
import { Product, Category, CartItem } from './types';

const RECOVERED_PRODUCT_GALLERIES: Record<string, string[]> = {
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'igrejinha-luminaria-trancoso': [
    '/produtos/igreja-quadrado-p.jpg',
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
  // A antiga foto 03 foi retirada da experiência de compra a pedido da proprietária.
  // A nova capa é a foto 04 e a galeria mostra apenas as imagens aprovadas.
  'miniatura-quadrado-trancoso': [
    '/produtos/catalogo/miniatura-quadrado-trancoso-4.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-5.jpg',
    '/produtos/catalogo/miniatura-quadrado-trancoso-2.jpg',
  ],
};

const PRODUCT_DESCRIPTION_CORRECTIONS: Record<string, string> = {
  'igreja-quadrado-m': 'Inspirada na tradicional Igrejinha do Quadrado, esta peça em cerâmica leva para a decoração um dos símbolos mais marcantes de Trancoso. Em tamanho M, é uma representação delicada da arquitetura que torna esse lugar tão especial.',
  'mobile-trancoso': 'Móbile feito à mão em cerâmica, com casinhas penduradas em fio resistente. Cria movimento suave com a brisa e leva um toque de Trancoso para o ambiente.',
  'estatueta-iemanja': 'Escultura artesanal de Iemanjá em cerâmica, com detalhes delicados. Ideal para altar ou para compor ambientes de fé e devoção.',
  'casal-pretos-velhos': 'Dupla de estatuetas em cerâmica representando um casal de Pretos-Velhos. Os detalhes das vestimentas, do banco e do cachimbo são modelados à mão. Uma peça ligada à memória, à sabedoria e à proteção.',
  'terco-em-ceramica': 'Terço artesanal com contas de cerâmica branca enfileiradas e cruz no final. Composição clássica, ideal para devoção ou como peça decorativa religiosa.',
  'esfera-decorativa': 'Bola decorativa de cerâmica, com design minimalista. Pode ser usada sobre suportes ou mesas e traz simplicidade sofisticada à decoração.',
  'ima-igrejinha-trancoso': 'Ímã artesanal em cerâmica representando a Igreja de São João Batista, no Quadrado de Trancoso. Pintado à mão, é uma lembrança delicada para levar um símbolo de Trancoso para o dia a dia.',
};

function normalizeProduct(product: Product): Product {
  const source = RECOVERED_PRODUCT_GALLERIES[product.id] ?? product.images ?? [];
  const images = Array.from(new Set(source.filter(Boolean)));
  return {
    ...product,
    description: PRODUCT_DESCRIPTION_CORRECTIONS[product.id] ?? product.description,
    images: images.length ? images : ['/images/placeholder.svg'],
    imageAlt: product.imageAlt || product.name,
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
