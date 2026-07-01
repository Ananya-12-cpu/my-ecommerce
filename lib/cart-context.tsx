"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

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
const STORAGE_KEY = "cart";

// Module-level store so cart state can be read via useSyncExternalStore
// without ever calling setState from inside an effect.
let items: CartItem[] = [];
let listeners: Array<() => void> = [];

function readFromStorage(): CartItem[] {
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

const EMPTY_SERVER_SNAPSHOT: CartItem[] = [];

function getServerSnapshot() {
  return EMPTY_SERVER_SNAPSHOT;
}

function setItems(next: CartItem[]) {
  items = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

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
    [items]
  );

  const removeItem = useCallback(
    (id: number) => {
      setItems(items.filter((i) => i.id !== id));
    },
    [items]
  );

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }
      setItems(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    },
    [items, removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

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
