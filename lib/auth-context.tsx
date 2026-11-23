"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
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

  const [loggingOut, setLoggingOut] = useState(false);

  const logout = useCallback(() => {
    if (loggingOut) return;
    setLoggingOut(true);
    setTimeout(() => {
      setUser(null);
      setLoggingOut(false);
    }, 1900);
  }, [loggingOut]);

  return (
    <AuthContext.Provider value={{ user: currentUser, login, logout }}>
      {children}
      {loggingOut && (
        <>
          {/* Toast */}
          <div
            role="status"
            className="animate-toast-in fixed right-4 top-4 z-[60] w-72 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
          >
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" className="animate-draw-check" />
                </svg>
              </span>
              <div className="text-sm">
                <p className="font-semibold">Logged out successfully</p>
                <p className="text-zinc-500 dark:text-zinc-400">See you again soon</p>
              </div>
            </div>
            <div className="toast-progress h-1 bg-green-500" />
          </div>

          {/* Success overlay */}
          <div className="animate-overlay fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-md">
            <div className="animate-card-in w-72 rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
              <div className="relative mx-auto h-16 w-16">
                <span className="ripple absolute inset-0 rounded-full bg-green-500" />
                <svg viewBox="0 0 64 64" className="relative h-16 w-16 text-green-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="32" r="26" className="ring-draw" transform="rotate(-90 32 32)" />
                  <path d="M21 33l8 8 14-16" className="animate-draw-check" style={{ animationDelay: "0.55s" }} />
                </svg>
              </div>
              <p className="rise mt-5 text-lg font-semibold tracking-tight" style={{ animationDelay: "0.5s" }}>Goodbye</p>
              <p className="rise mt-1 text-sm text-zinc-500 dark:text-zinc-400" style={{ animationDelay: "0.65s" }}>
                Signing you out…
              </p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="bar-fill h-full rounded-full bg-green-500" />
              </div>
            </div>
          </div>
        </>
      )}
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
