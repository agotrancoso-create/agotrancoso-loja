import productsData from '@/data/products.json';
import { Product, Category, CartItem } from './types';

// Toda a loja lê nomes, preços, categorias e imagens a partir de products.json.
// As exceções abaixo existem só para preservar fotografias corretas confirmadas
// pela proprietária e remover associações visuais duvidosas. Não alteram preço,
// disponibilidade ou categoria.
const RECOVERED_PRODUCT_GALLERIES: Record<string, string[]> = {
  // Os nomes físicos desses dois arquivos ficaram historicamente invertidos.
  // Esta associação visual foi confirmada pela proprietária. Não trocar.
  'igreja-quadrado-p': [
    '/produtos/igrejinha-luminaria-trancoso.jpg',
    '/produtos/catalogo/igreja-quadrado-p-2.jpg',
  ],
  'igrejinha-luminaria-trancoso': [
    '/produtos/igreja-quadrado-p.jpg',
  ],

  // Capas confirmadas pela proprietária. A ordem abaixo é intencional.
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
  // Fotografias do ímã confirmadas pela proprietária: peça individual e conjunto.
  'ima-igrejinha-trancoso': [
    '/produtos/catalogo/ima-igrejinha-trancoso-frente.jpg',
    '/produtos/catalogo/ima-igrejinha-trancoso-conjunto.jpg',
  ],
};

// Revisões editoriais pontuais para corrigir gramática, clareza e afirmações
// excessivamente específicas sem alterar a identidade ou as informações comerciais.
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

/** Preço que deve ser cobrado: usa o promocional quando existir. */
export function getEffectivePrice(product: Product): number {
  return product.promotionalPrice ?? product.price;
}

/**
 * Recalcula o valor total de um carrinho a partir do catálogo oficial.
 * Nunca confie em preços ou subtotais enviados pelo navegador: esta função
 * é a fonte da verdade usada pelo backend da API de checkout.
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

  const total = Number(lines.reduce((sum, line) => sum + line.subtotal, 0).toFixed(2));
  return { lines, total, errors, valid: errors.length === 0 && lines.length > 0 };
}
