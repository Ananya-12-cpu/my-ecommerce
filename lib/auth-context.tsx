"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type UserRole = "admin" | "user";

export interface AuthUser {
  email: string;
  role: UserRole;
}

interface StoredAccount {
  email: string;
  password: string;
  role: UserRole;
}

const ACCOUNTS: StoredAccount[] = [
  { email: "admin@gmail.com", password: "123456", role: "admin" },
  { email: "ananya@gmail.com", password: "123456", role: "user" },
];

export interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "auth-user";

let user: AuthUser | null = null;
let listeners: Array<() => void> = [];

function readFromStorage(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

user = readFromStorage();

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot() {
  return user;
}

function getServerSnapshot() {
  return null;
}

function setUser(next: AuthUser | null) {
  user = next;
  if (typeof window !== "undefined") {
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
  listeners.forEach((listener) => listener());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const currentUser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = ACCOUNTS.find((a) => a.email === normalizedEmail);

    if (!account || account.password !== password) {
      return { success: false, error: "Invalid email or password." };
    }

    setUser({ email: account.email, role: account.role });
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user: currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
