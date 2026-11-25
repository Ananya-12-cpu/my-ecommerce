"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const LoginPromptContext = createContext<(() => void) | null>(null);

// The animated "Please login to proceed" card. Used inside the pop-up and as
// the content of pages that guests are not allowed to open.
export function LoginPromptCard({ onDismiss }: { onDismiss?: () => void }) {
  const router = useRouter();

  return (
    <div className="animate-card-in w-full max-w-xs rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
      <div aria-hidden className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <span className="gate-ring absolute inset-0 rounded-full bg-amber-400" />
        <span className="gate-ring absolute inset-0 rounded-full bg-amber-400 [animation-delay:0.9s]" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
          <svg viewBox="0 0 24 24" className="gate-wiggle h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 11V7a4 4 0 0 1 8 0v4" className="gate-shackle" />
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M12 15v2" />
          </svg>
        </span>
      </div>

      <h2 id="login-prompt-title" className="rise mt-5 text-lg font-semibold tracking-tight" style={{ animationDelay: "0.15s" }}>
        Please login to proceed
      </h2>
      <p className="rise mt-1 text-sm text-zinc-500 dark:text-zinc-400" style={{ animationDelay: "0.25s" }}>
        Sign in to use your cart, wishlist and checkout.
      </p>

      <button
        type="button"
        autoFocus
        onClick={() => router.push("/login")}
        className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Continue to login
      </button>
      <button
        type="button"
        onClick={onDismiss ?? (() => router.push("/shop"))}
        className="mt-3 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        {onDismiss ? "Not now" : "Keep browsing"}
      </button>
    </div>
  );
}

export function LoginPromptProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // The pop-up belongs to the page it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const showLoginPrompt = useCallback(() => setOpenPath(pathname), [pathname]);
  const close = () => setOpenPath(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <LoginPromptContext.Provider value={showLoginPrompt}>
      {children}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-prompt-title"
          onClick={(e) => e.target === e.currentTarget && close()}
          className="animate-overlay fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/50 px-4 backdrop-blur-md"
        >
          <LoginPromptCard onDismiss={close} />
        </div>
      )}
    </LoginPromptContext.Provider>
  );
}

export function useLoginPrompt() {
  const ctx = useContext(LoginPromptContext);
  if (!ctx) {
    throw new Error("useLoginPrompt must be used within a LoginPromptProvider");
  }
  return ctx;
}
