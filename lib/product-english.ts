import type { Product, Category } from './types';

type EnglishCopy = { name: string; description: string; title?: string };

const COPY: Record<string, EnglishCopy> = {
  'igreja-quadrado-p': {
    name: 'Trancoso Quadrado Church — Small Ceramic Miniature',
    title: 'Trancoso Quadrado Church Small Ceramic Miniature | Agô',
    description: 'Ceramic miniature of São João Batista Church in Trancoso’s historic Quadrado. A compact decorative keepsake for shelves, niches, sideboards or gifting.',
  },
  'igreja-quadrado-m': {
    name: 'Trancoso Quadrado Church — Medium Ceramic Miniature',
    title: 'Trancoso Quadrado Church Medium Ceramic Miniature | Agô',
    description: 'Medium ceramic miniature of São João Batista Church in Trancoso’s Quadrado, designed as a decorative keepsake for shelves, niches, sideboards or gifting.',
  },
  'igreja-quadrado-gg': {
    name: 'Trancoso Quadrado Church — Large Ceramic Lamp',
    title: 'Trancoso Quadrado Church Large Ceramic Lamp | Agô',
    description: 'Large ceramic sculpture of São João Batista Church in Trancoso’s Quadrado. The piece also works as a decorative lamp.',
  },
  'igrejinha-luminaria-trancoso': {
    name: 'Trancoso Church Ceramic Luminary',
    title: 'Trancoso Quadrado Church Ceramic Luminary | Agô',
    description: 'Ceramic luminary inspired by São João Batista Church in Trancoso. A small LED candle or tea light can illuminate the façade cutouts.',
  },
  'casinha-luminaria': {
    name: 'Trancoso-Inspired Ceramic House Luminary',
    title: 'Trancoso-Inspired Ceramic House Luminary | Agô',
    description: 'Ceramic house luminary inspired by Trancoso’s colorful architecture. Light shines through the doors and windows when used with an LED candle or tea light.',
  },
  'miniatura-quadrado-trancoso': {
    name: 'Trancoso Quadrado Ceramic Wall Miniature',
    title: 'Trancoso Quadrado Ceramic Wall Miniature | Agô',
    description: 'A ceramic miniature of Trancoso’s Quadrado with colorful houses and the church. It can be hung on a wall or displayed on a shelf.',
  },
  'cruzeiro-do-quadrado': {
    name: 'Trancoso Quadrado Cross Ceramic Miniature',
    title: 'Trancoso Quadrado Cross Ceramic Miniature | Agô',
    description: 'Ceramic miniature of the historic cross in Trancoso’s Quadrado, a decorative keepsake connected to one of the village’s best-known landmarks.',
  },
  'mobile-trancoso': {
    name: 'Trancoso Ceramic House Mobile',
    title: 'Trancoso Ceramic House Mobile | Agô',
    description: 'Hanging mobile with small ceramic houses inspired by Trancoso’s architecture, designed to move gently with the breeze.',
  },
  'estatueta-iemanja': {
    name: 'Iemanjá Ceramic Figurine',
    title: 'Iemanjá Ceramic Figurine | Agô Trancoso',
    description: 'Ceramic representation of Iemanjá for an altar, shelf or devotional space.',
  },
  'nossa-senhora-grande': {
    name: 'Large Our Lady Ceramic Figurine',
    title: 'Large Our Lady Ceramic Figurine | Agô Trancoso',
    description: 'Large ceramic representation of Our Lady with detailed garments, suitable for a home altar or devotional setting.',
  },
  'presepio-em-ceramica': {
    name: 'Five-Piece Ceramic Nativity Set',
    title: 'Five-Piece Ceramic Nativity Set | Agô Trancoso',
    description: 'Five-piece ceramic nativity set with Baby Jesus, Mary, Joseph, an angel and the Star of Bethlehem for Christmas décor.',
  },
  'casal-pretos-velhos': {
    name: 'Pretos-Velhos Couple Ceramic Figurine',
    title: 'Pretos-Velhos Couple Ceramic Figurine | Agô Trancoso',
    description: 'Ceramic representation of a Pretos-Velhos couple, connected to traditions of faith, respect and ancestry.',
  },
  'nossa-senhora-aparecida': {
    name: 'Our Lady of Aparecida Ceramic Figurine',
    title: 'Our Lady of Aparecida Ceramic Figurine | Agô Trancoso',
    description: 'Ceramic representation of Our Lady of Aparecida with a blue mantle and gold details, for prayer spaces, altars or gifting.',
  },
  'divino-espirito-santo': {
    name: 'Holy Spirit Ceramic Wall Plaque',
    title: 'Holy Spirit Ceramic Wall Plaque | Agô Trancoso',
    description: 'Round ceramic wall piece with a raised dove representing the Holy Spirit, designed for indoor devotional spaces.',
  },
  'terco-em-ceramica': {
    name: 'White Bead Ceramic Rosary',
    title: 'White Bead Ceramic Rosary | Agô Trancoso',
    description: 'Rosary with white ceramic beads and a cross, for prayer or a devotional setting.',
  },
  'rosario-trancoso': {
    name: 'Trancoso Church Ceramic Rosary',
    title: 'Trancoso Church Ceramic Rosary | Agô',
    description: 'Ceramic-bead rosary with a medallion depicting the Trancoso Quadrado Church, combining devotion with a keepsake of the village.',
  },
  'esfera-decorativa': {
    name: 'Terracotta Ceramic Decorative Sphere',
    title: 'Terracotta Ceramic Decorative Sphere | Agô Trancoso',
    description: 'Earth-toned ceramic decorative sphere with light floral motifs for tables, sideboards and shelves.',
  },
  'colar-igreja-quadrado': {
    name: 'Trancoso Quadrado Church Ceramic Necklace',
    title: 'Trancoso Quadrado Church Ceramic Necklace | Agô',
    description: 'Necklace with a ceramic pendant inspired by São João Batista Church in Trancoso’s Quadrado.',
  },
  'ima-igrejinha-trancoso': {
    name: 'Trancoso Quadrado Church Ceramic Magnet',
    title: 'Trancoso Quadrado Church Ceramic Magnet | Agô',
    description: 'Ceramic magnet featuring the façade of São João Batista Church in Trancoso’s Quadrado, a compact keepsake or gift.',
  },
  'rabo-de-baleia': {
    name: 'Ceramic Whale Tail Sculpture',
    title: 'Ceramic Whale Tail Sculpture — S, M and L | Agô Trancoso',
    description: 'Decorative ceramic whale-tail sculpture available in three sizes, from 10 to 16 cm tall, for shelves, sideboards and home décor.',
  },
  'sagrada-familia': {
    name: 'Holy Family Ceramic Piece',
    title: 'Holy Family Ceramic Piece — Color or Gold | Agô',
    description: 'Ceramic Holy Family with Joseph, Mary and Baby Jesus, available in color and gold finishes.',
  },
};

const CATEGORY_COPY: Record<string, string> = {
  todas: 'All',
  igrejinhas: 'Trancoso Churches',
  trancoso: 'Trancoso',
  decoracao: 'Home décor',
  'fe-devocao': 'Faith & devotion',
  presentes: 'Gifts',
};

export function englishProductCopy(id: string, fallbackName: string, fallbackDescription: string): EnglishCopy {
  if (COPY[id]) return COPY[id];
  if (id.startsWith('rabo-de-baleia-')) {
    const size = id.split('-').at(-1)?.toUpperCase() || '';
    return {
      name: `Ceramic Whale Tail Sculpture — ${size}`,
      title: `Ceramic Whale Tail Sculpture ${size} | Agô Trancoso`,
      description: `Decorative ceramic whale-tail sculpture, size ${size}. A sculptural accent for shelves, sideboards and home décor.`,
    };
  }
  if (id.startsWith('sagrada-familia-')) {
    const finish = id.endsWith('-dourada') ? 'Gold' : 'Color';
    return {
      name: `Holy Family Ceramic Piece — ${finish}`,
      title: `Holy Family Ceramic Piece — ${finish} | Agô Trancoso`,
      description: `Ceramic Holy Family with Joseph, Mary and Baby Jesus in the ${finish.toLowerCase()} finish.`,
    };
  }
  return { name: fallbackName, description: fallbackDescription, title: `${fallbackName} | Agô Trancoso` };
}

export function englishProduct(product: Product): Product {
  const copy = englishProductCopy(product.id, product.name, product.description);
  return { ...product, name: copy.name, description: copy.description };
}

export function englishProducts(products: Product[]): Product[] {
  return products.map(englishProduct);
}

export function englishCategories(categories: Category[]): Category[] {
  return categories.map(category => ({ ...category, name: CATEGORY_COPY[category.id] ?? category.name }));
}

export function englishProductType(category: string) {
  const labels: Record<string, string> = {
    igrejinhas: 'Crafts > Ceramics > Trancoso Church Miniatures',
    trancoso: 'Crafts > Ceramics > Trancoso Keepsakes',
    decoracao: 'Home & Garden > Décor > Ceramics',
    'fe-devocao': 'Religious & Ceremonial > Devotional Ceramics',
    presentes: 'Gifts > Trancoso Keepsakes',
  };
  return labels[category] ?? 'Crafts > Ceramics';
}
