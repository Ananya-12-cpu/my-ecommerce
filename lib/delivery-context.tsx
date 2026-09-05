"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

interface DeliveryContextValue {
  location: DeliveryLocation | null;
  setLocation: (location: DeliveryLocation) => void;
  clearLocation: () => void;
}

const DeliveryContext = createContext<DeliveryContextValue | null>(null);
const STORAGE_KEY = "delivery-location";

let location: DeliveryLocation | null = null;
let listeners: Array<() => void> = [];

function readFromStorage(): DeliveryLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

location = readFromStorage();

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  return location;
}

function getServerSnapshot() {
  return null;
}

function set(next: DeliveryLocation | null) {
  location = next;
  if (typeof window !== "undefined") {
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
  listeners.forEach((listener) => listener());
}

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const currentLocation = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setLocation = useCallback((next: DeliveryLocation) => {
    set(next);
  }, []);

  const clearLocation = useCallback(() => {
    set(null);
  }, []);

  return (
    <DeliveryContext.Provider
      value={{ location: currentLocation, setLocation, clearLocation }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDeliveryLocation() {
  const ctx = useContext(DeliveryContext);
  if (!ctx) {
    throw new Error(
      "useDeliveryLocation must be used within a DeliveryProvider"
    );
  }
  return ctx;
}
