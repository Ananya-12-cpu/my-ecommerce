"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart-context";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
}

interface OrdersContextValue {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => Order;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);
const STORAGE_KEY = "orders";

let orders: Order[] = [];
let listeners: Array<() => void> = [];

function readFromStorage(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

orders = readFromStorage();

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  return orders;
}

const EMPTY_SERVER_SNAPSHOT: Order[] = [];

function getServerSnapshot() {
  return EMPTY_SERVER_SNAPSHOT;
}

function setOrders(next: Order[]) {
  orders = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
  listeners.forEach((listener) => listener());
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const orders = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addOrder = useCallback((items: CartItem[], total: number) => {
    const order: Order = {
      id: crypto.randomUUID(),
      items,
      total,
      createdAt: new Date().toISOString(),
    };
    setOrders([order, ...orders]);
    return order;
  }, [orders]);

  return (
    <OrdersContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return ctx;
}
