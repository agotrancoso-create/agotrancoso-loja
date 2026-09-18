'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem } from '@/lib/types';

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'agotrancoso_carrinho_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Carrega o carrinho salva no navegador ao abrir o site
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        const safeItems = Array.isArray(parsed)
          ? parsed
              .map((entry): CartItem | null => {
                if (!entry || typeof entry !== 'object') return null;
                const value = entry as { productId?: unknown; id?: unknown; quantity?: unknown };
                const productId =
                  typeof value.productId === 'string'
                    ? value.productId
                    : typeof value.id === 'string'
                      ? value.id
                      : '';
                const quantity = Number(value.quantity);
                if (!productId || !Number.isInteger(quantity) || quantity < 1) return null;
                return { productId, quantity };
              })
              .filter((item): item is CartItem => Boolean(item))
          : [];
        setItems(safeItems);
      }
    } catch {
      // localStorage indisponível ou corrompido — começa com carrinho vazio.
    }
    setHydrated(true);
  }, []);

  // Salva o carrinho sempre que ela mudar
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora */
    }
  }, [items, hydrated]);

  function addItem(productId: string, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, quantity }];
    });
    setIsDrawerOpen(true);
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
