"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";

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

// Module-level store (one wishlist per logged-in user, plus a guest wishlist)
// so state can be read via useSyncExternalStore without setState in an effect.
const stores = new Map<string, WishlistItem[]>();
let listeners: Array<() => void> = [];
const EMPTY_ITEMS: WishlistItem[] = [];

function storageKey(email: string | null | undefined) {
  return email ? `wishlist:${email}` : "wishlist";
}

function readFromStorage(key: string): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function load(key: string): WishlistItem[] {
  let value = stores.get(key);
  if (!value) {
    value = readFromStorage(key);
    stores.set(key, value);
  }
  return value;
}

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getServerSnapshot() {
  return EMPTY_ITEMS;
}

function writeItems(key: string, next: WishlistItem[]) {
  stores.set(key, next);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const key = storageKey(user?.email);
  const getSnapshot = useCallback(() => load(key), [key]);
  const setItems = useCallback(
    (next: WishlistItem[]) => writeItems(key, next),
    [key]
  );
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
    [items, setItems]
  );

  const removeItem = useCallback(
    (id: number) => {
      setItems(items.filter((i) => i.id !== id));
    },
    [items, setItems]
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
