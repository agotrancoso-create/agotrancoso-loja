'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartItem } from '@/lib/types';
import { getProductById } from '@/lib/products';

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  isDrawerOpen: boolean;
  hydrated: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'agotrancoso_carrinho_v1';

function normalizeStoredItems(parsed: unknown): CartItem[] {
  if (!Array.isArray(parsed)) return [];
  const merged = new Map<string, number>();

  for (const entry of parsed) {
    if (!entry || typeof entry !== 'object') continue;

    const value = entry as { productId?: unknown; id?: unknown; quantity?: unknown };
    const productId = typeof value.productId === 'string' ? value.productId : typeof value.id === 'string' ? value.id : '';
    const quantity = Number(value.quantity);
    const product = productId ? getProductById(productId) : undefined;

    if (!product || !product.available) continue;
    if (!Number.isInteger(quantity) || quantity < 1) continue;

    const current = merged.get(productId) ?? 0;
    merged.set(productId, Math.min(99, current + quantity));
  }

  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(normalizeStoredItems(JSON.parse(raw)));
    } catch {
      try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* armazenamento local indisponível: mantém a sacola em memória */
    }
  }, [items, hydrated]);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = getProductById(productId);
    if (!product?.available || !Number.isInteger(quantity) || quantity < 1) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item);
      }
      return [...prev, { productId, quantity: Math.min(99, quantity) }];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setItems((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, quantity) } : item));
  }, []);

  const clearCart = useCallback(() => {
    setItems((current) => current.length ? [] : current);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    isDrawerOpen,
    hydrated,
    openDrawer,
    closeDrawer,
  }), [items, addItem, removeItem, updateQuantity, clearCart, totalItems, isDrawerOpen, hydrated, openDrawer, closeDrawer]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
