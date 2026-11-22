"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/orders-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useDeliveryLocation } from "@/lib/delivery-context";

const icons = {
  orders: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  wishlist:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z",
  cart: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  chevron: "m9 18 6-6-6-6",
};

function Icon({ name, className = "h-4 w-4" }: { name: keyof typeof icons; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={icons[name]} />
    </svg>
  );
}

function StatCard({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: number;
  href: string;
  icon: keyof typeof icons;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-600"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-black group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-black">
          <Icon name={icon} />
        </span>
        <Icon
          name="chevron"
          className="h-4 w-4 text-zinc-300 transition-transform group-hover:translate-x-0.5 dark:text-zinc-600"
        />
      </div>
      <p className="mt-4 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
    </Link>
  );
}

function SectionCard({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: keyof typeof icons;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
      <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Icon name={icon} className="h-4 w-4 text-zinc-400" />
          {title}
        </h2>
        {action}
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm [&:not(:last-child)]:border-b [&:not(:last-child)]:border-zinc-100 dark:[&:not(:last-child)]:border-zinc-800">
      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="min-w-0 truncate text-right font-medium">{children}</dd>
    </div>
  );
}

function ProfileView() {
  const { user, logout } = useAuth();
  const { orders: allOrders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const { totalItems: cartItems } = useCart();
  const { location } = useDeliveryLocation();

  const email = user?.email ?? "";
  const orders = allOrders.filter((o) => o.userEmail === email);
  const initials = email.slice(0, 2).toUpperCase();
  const isAdmin = user?.role === "admin";
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const lastOrder = orders.reduce<string | null>(
    (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
    null,
  );
  const name = email.split("@")[0];

  return (
    <div className="animate-fade-in-up mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="h-24 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-500 dark:from-zinc-100 dark:via-zinc-400 dark:to-zinc-600" />
        <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-black text-xl font-semibold text-white shadow-md dark:border-zinc-900 dark:bg-white dark:text-black">
              {initials}
            </div>
            <div className="min-w-0 pb-1">
              <h1 className="truncate text-xl font-semibold capitalize tracking-tight">{name}</h1>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">{email}</p>
            </div>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              isAdmin
                ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {isAdmin ? "Administrator" : "Customer"}
          </span>
        </div>
      </div>

      {/* Stats */}
      {!isAdmin && (
        <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Orders" value={orders.length} href="/orders" icon="orders" />
          <StatCard label="Wishlist" value={wishlistItems.length} href="/wishlist" icon="wishlist" />
          <StatCard label="In cart" value={cartItems} href="/cart" icon="cart" />
        </div>
      )}

      <div className="mt-6 grid gap-6">
        <SectionCard title="Account details" icon="user">
          <dl>
            <DetailRow label="Email">{email}</DetailRow>
            <DetailRow label="Account type">{isAdmin ? "Admin" : "Customer"}</DetailRow>
            {!isAdmin && (
              <>
                <DetailRow label="Total spent">${totalSpent.toFixed(2)}</DetailRow>
                <DetailRow label="Last order">
                  {lastOrder
                    ? new Date(lastOrder).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "No orders yet"}
                </DetailRow>
              </>
            )}
          </dl>
        </SectionCard>

        {!isAdmin && (
          <SectionCard
            title="Delivery location"
            icon="pin"
            action={
              <Link
                href="/delivery"
                className="rounded-md border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-black dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
              >
                {location ? "Update" : "Set location"}
              </Link>
            }
          >
            {location ? (
              <p className="text-sm leading-relaxed">{location.address}</p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No delivery location saved yet.{" "}
                <Link href="/delivery" className="font-medium underline underline-offset-2">
                  Pin one on the map
                </Link>
                .
              </p>
            )}
          </SectionCard>
        )}
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <Icon name="logout" />
        Log out
      </button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileView />
    </AuthGuard>
  );
}
