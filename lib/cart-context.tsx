"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

// Module-level store (one cart per logged-in user, plus a guest cart) so state
// can be read via useSyncExternalStore without calling setState in an effect.
const stores = new Map<string, CartItem[]>();
let listeners: Array<() => void> = [];

function storageKey(email: string | null | undefined) {
  return email ? `cart:${email}` : "cart";
}

function readFromStorage(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function load(key: string): CartItem[] {
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

const EMPTY_SERVER_SNAPSHOT: CartItem[] = [];

function getServerSnapshot() {
  return EMPTY_SERVER_SNAPSHOT;
}

function writeItems(key: string, next: CartItem[]) {
  stores.set(key, next);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const key = storageKey(user?.email);
  const getSnapshot = useCallback(() => load(key), [key]);
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const setItems = useCallback((next: CartItem[]) => writeItems(key, next), [key]);

  useEffect(() => {
    const onLogout = () => writeItems(storageKey(null), []);
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, []);

  const addItem: CartContextValue["addItem"] = useCallback(
    (item, quantity = 1) => {
      const existing = items.find((i) => i.id === item.id);
      if (existing) {
        setItems(
          items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          )
        );
      } else {
        setItems([...items, { ...item, quantity }]);
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

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }
      setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    },
    [items, removeItem, setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const { totalItems, totalPrice } = useMemo(
    () => ({
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: items.reduce((sum, i) => sum + i.quantity * i.price, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
