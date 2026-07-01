"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface WishlistItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  isWishlisted: (id: number) => boolean;
  toggleItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "wishlist";

// Module-level store so wishlist state can be read via useSyncExternalStore
// without ever calling setState from inside an effect.
let items: WishlistItem[] = [];
let listeners: Array<() => void> = [];

function readFromStorage(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

items = readFromStorage();

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return [] as WishlistItem[];
}

function setItems(next: WishlistItem[]) {
  items = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((listener) => listener());
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isWishlisted = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const toggleItem = useCallback(
    (item: WishlistItem) => {
      const existing = items.find((i) => i.id === item.id);
      if (existing) {
        setItems(items.filter((i) => i.id !== item.id));
      } else {
        setItems([...items, item]);
      }
    },
    [items]
  );

  const removeItem = useCallback(
    (id: number) => {
      setItems(items.filter((i) => i.id !== id));
    },
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{ items, isWishlisted, toggleItem, removeItem }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
