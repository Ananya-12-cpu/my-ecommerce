"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const [successRole, setSuccessRole] = useState<string | null>(null);

  function submitCredentials(email: string, password: string, role?: string) {
    setEmail(email);
    setPassword(password);
    const result = login(email, password);

    if (!result.success) {
      setError(result.error ?? "Invalid email or password.");
      setAttempts((n) => n + 1);
      return;
    }

    setError(null);
    setSuccessRole(role ?? "User");
    setTimeout(() => router.push("/"), 1900);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitCredentials(email, password);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Use your admin or customer account to continue.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
        <button
          type="button"
          disabled={!!successRole}
          onClick={() => submitCredentials("ananya@gmail.com", "123456", "Customer")}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition-transform hover:bg-zinc-100 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Login as Customer
        </button>
        <button
          type="button"
          disabled={!!successRole}
          onClick={() => submitCredentials("admin@gmail.com", "123456", "Admin")}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium transition-transform hover:bg-zinc-100 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Login as Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <FormField
          id="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p key={error + attempts} className="animate-shake text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          className="mt-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Log in
        </button>
      </form>

      <Link
        href="/"
        className="mt-6 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        ← Back to shop
      </Link>

      {successRole && (
        <>
          {/* Toast */}
          <div
            role="status"
            className="animate-toast-in fixed right-4 top-4 z-[60] w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10"
          >
            <div className="flex items-center gap-3 p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" className="animate-draw-check" />
                </svg>
              </span>
              <div className="text-sm">
                <p className="font-semibold">Logged in successfully</p>
                <p className="text-zinc-500 dark:text-zinc-400">Signed in as {successRole}</p>
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
              <p className="rise mt-5 text-lg font-semibold tracking-tight" style={{ animationDelay: "0.5s" }}>Welcome back</p>
              <p className="rise mt-1 text-sm text-zinc-500 dark:text-zinc-400" style={{ animationDelay: "0.65s" }}>
                Signing you in as {successRole}…
              </p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="bar-fill h-full rounded-full bg-green-500" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
