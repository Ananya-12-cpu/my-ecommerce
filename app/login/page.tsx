"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui";
import { useAuth, type UserRole } from "@/lib/auth-context";

const PASSES: Record<
  UserRole,
  {
    name: string;
    icon: string;
    email: string;
    password: string;
    tagline: string;
    headline: string;
    perks: { icon: string; label: string; detail: string }[];
    stage: string;
    chip: string;
    ring: string;
  }
> = {
  user: {
    name: "Customer",
    icon: "🛍️",
    email: "ananya@gmail.com",
    password: "123456",
    tagline: "Browse, wishlist and checkout",
    headline: "Your next favourite thing is waiting.",
    perks: [
      { icon: "🛒", label: "Cart", detail: "Add items and check out" },
      { icon: "💖", label: "Wishlist", detail: "Save things for later" },
      { icon: "📦", label: "Orders", detail: "Review what you bought" },
      { icon: "🎁", label: "Offer Zone", detail: "Browse current deals" },
    ],
    stage: "from-orange-500 via-rose-500 to-fuchsia-600",
    chip: "bg-rose-100 dark:bg-rose-950",
    ring: "hover:border-rose-400 focus-visible:border-rose-400 focus-visible:ring-rose-400/40",
  },
  admin: {
    name: "Admin",
    icon: "🧑‍💼",
    email: "admin@gmail.com",
    password: "123456",
    tagline: "Run the store and track sales",
    headline: "Your whole store, at a glance.",
    perks: [
      { icon: "📈", label: "Analytics", detail: "See how the store is doing" },
      { icon: "🧾", label: "Reports", detail: "Review store reports" },
      { icon: "👥", label: "Customers", detail: "Look up your shoppers" },
      { icon: "🏷️", label: "Offer Zone", detail: "Browse current deals" },
    ],
    stage: "from-indigo-600 via-blue-600 to-cyan-500",
    chip: "bg-indigo-100 dark:bg-indigo-950",
    ring: "hover:border-indigo-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-400/40",
  },
};

const ROLES: UserRole[] = ["user", "admin"];

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  // Which role the side panel is previewing.
  const [preview, setPreview] = useState<UserRole>("user");

  const [successRole, setSuccessRole] = useState<string | null>(null);

  function submitCredentials(email: string, password: string) {
    if (successRole) return;
    const result = login(email, password);

    if (!result.success) {
      setError(result.error ?? "Invalid email or password.");
      setAttempts((n) => n + 1);
      return;
    }

    const isAdmin = email.trim().toLowerCase() === PASSES.admin.email;
    setError(null);
    setSuccessRole(isAdmin ? "Admin" : "Customer");
    setTimeout(() => router.push("/"), 1900);
  }

  function continueAs(role: UserRole) {
    const pass = PASSES[role];
    setPreview(role);
    setEmail(pass.email);
    setPassword(pass.password);
    submitCredentials(pass.email, pass.password);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitCredentials(email, password);
  }

  const active = PASSES[preview];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 lg:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-950">
        {/* Stage: shows the access pass for the selected, hovered or focused role */}
        <aside className="relative isolate order-last flex flex-col gap-6 overflow-hidden p-6 text-white sm:p-10 lg:order-first">
          {/* Both gradients stay mounted so they can cross-fade */}
          {ROLES.map((role) => (
            <div
              key={role}
              aria-hidden
              className={`absolute inset-0 -z-20 bg-gradient-to-br transition-opacity duration-500 ${PASSES[role].stage} ${
                preview === role ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div aria-hidden className="login-dots absolute inset-0 -z-10" />
          <div aria-hidden className="login-blob absolute -right-16 -top-16 -z-10 h-64 w-64 rounded-full bg-white/25 blur-3xl" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-bold tracking-tight">Cartify</p>
            <div role="group" aria-label="Preview a pass" className="flex rounded-full bg-black/20 p-1 text-xs font-medium">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  aria-pressed={preview === role}
                  onClick={() => setPreview(role)}
                  className={`rounded-full px-3 py-1.5 ${
                    preview === role ? "bg-white text-zinc-900 shadow" : "text-white/80 hover:text-white"
                  }`}
                >
                  {PASSES[role].name}
                </button>
              ))}
            </div>
          </div>

          {/* Reserves two lines so the card doesn't jump when headlines wrap differently */}
          <h2 key={preview} className="animate-fade-in-up min-h-[2lh] text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {active.headline}
          </h2>

          <div className="relative mx-auto my-auto w-full max-w-sm">
            {/* A second card peeking out from behind */}
            <div aria-hidden className="absolute inset-0 rotate-3 rounded-3xl border border-white/30 bg-white/15" />

            <div key={preview} className="login-pass relative rounded-3xl bg-white text-zinc-900 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between gap-3 px-5 pt-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">Access pass</p>
                  <p className="text-xl font-bold tracking-tight">{active.name}</p>
                </div>
                <span aria-hidden className="login-float text-4xl">{active.icon}</span>
              </div>

              <ul className="stagger mt-3 divide-y divide-zinc-100 px-5">
                {active.perks.map((perk) => (
                  <li key={perk.label} className="flex items-center gap-3 py-2.5">
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-lg">
                      {perk.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{perk.label}</span>
                      <span className="block text-xs text-zinc-500">{perk.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Tear-off stub */}
              <div aria-hidden className="mt-2 border-t-2 border-dashed border-zinc-200 px-5 py-4">
                <div className="login-barcode h-8" />
              </div>
            </div>
          </div>
        </aside>

        {/* Sign-in side */}
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome in 👋</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Pick a pass to explore instantly. No typing needed.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {ROLES.map((role) => {
              const pass = PASSES[role];
              return (
                <button
                  key={role}
                  type="button"
                  disabled={!!successRole}
                  onClick={() => continueAs(role)}
                  onMouseEnter={() => setPreview(role)}
                  onFocus={() => setPreview(role)}
                  className={`group flex items-center gap-4 rounded-2xl border-2 border-zinc-200 p-3 text-left outline-none hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-4 disabled:opacity-50 dark:border-zinc-800 ${pass.ring}`}
                >
                  <span
                    aria-hidden
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-transform group-hover:-rotate-6 group-hover:scale-110 ${pass.chip}`}
                  >
                    {pass.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">Continue as {pass.name}</span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400">{pass.tagline}</span>
                  </span>
                  {/* Ticket-stub divider */}
                  <span className="flex self-stretch border-l-2 border-dashed border-zinc-200 pl-3 dark:border-zinc-800">
                    <span aria-hidden className="self-center text-lg transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            or sign in with email
            <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <div className="relative">
              <FormField
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label="Show password"
                className="absolute bottom-0 right-0 h-10 px-3 text-xs font-medium text-zinc-500 hover:text-zinc-900 sm:h-9.5 dark:hover:text-zinc-100"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error && (
              <p key={error + attempts} role="alert" className="animate-shake text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!!successRole}
              className="mt-1 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Log in
            </button>
          </form>

          <Link
            href="/"
            className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to shop
          </Link>
        </div>
      </div>

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
