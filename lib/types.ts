export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number | null;
  currency: 'BRL';
  category: string;
  images: string[];
  imageAlt?: string;
  dimensions?: string;
  available: boolean;
  stock?: number | null;

  // Dados logísticos reais.
  // null significa que o dado ainda não foi informado.
  weight?: number | null;
  width?: number | null;
  height?: number | null;
  length?: number | null;
};

export type Category = {
  id: string;
  name: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
  };
};
