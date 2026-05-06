'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface WishlistItem {
  id: string;
  brand: string;
  title?: string;
  name?: string;
  price: number;
  originalPrice: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  isWishlisted: () => false,
  clearWishlist: () => {},
  itemCount: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('elevation-wishlist');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch { setItems([]); }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('elevation-wishlist', JSON.stringify(items));
  }, [items, mounted]);

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      console.log('Current items:', prev, 'Adding:', item);
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const isWishlisted = (id: string) => items.some((i) => i.id === id);

  const clearWishlist = () => setItems([]);

  const itemCount = items.length;

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isWishlisted, clearWishlist, itemCount }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}