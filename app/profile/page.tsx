"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import CustomerGuard from "@/components/CustomerGuard";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/orders-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useDeliveryLocation } from "@/lib/delivery-context";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-zinc-200 p-4 text-center transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
    >
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
    </Link>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          {title}
        </p>
        {action}
      </div>
      {children}
    </div>
  );
}

function ProfileView() {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const { totalItems: cartItems } = useCart();
  const { location } = useDeliveryLocation();

  const email = user?.email ?? "";
  const initials = email.slice(0, 2).toUpperCase();
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="flex items-center gap-4 rounded-lg bg-black px-6 py-8 text-white dark:bg-white dark:text-black">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-lg font-semibold dark:bg-black/10">
          {initials}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide opacity-70">
            Customer profile
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{email}</h1>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Orders" value={orders.length} href="/orders" />
        <StatCard label="Wishlist" value={wishlistItems.length} href="/wishlist" />
        <StatCard label="In cart" value={cartItems} href="/cart" />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <SectionCard title="Account details">
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd>{email}</dd>
            <dt className="text-zinc-500 dark:text-zinc-400">Account type</dt>
            <dd>Customer</dd>
            <dt className="text-zinc-500 dark:text-zinc-400">Total spent</dt>
            <dd>${totalSpent.toFixed(2)}</dd>
          </dl>
        </SectionCard>

        <SectionCard
          title="Delivery location"
          action={
            <Link
              href="/delivery"
              className="text-xs font-medium text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              {location ? "Update" : "Set location"}
            </Link>
          }
        >
          {location ? (
            <p className="mt-2 text-sm">{location.address}</p>
          ) : (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              No delivery location saved yet.{" "}
              <Link href="/delivery" className="underline underline-offset-2">
                Pin one on the map
              </Link>
              .
            </p>
          )}
        </SectionCard>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 text-sm text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
      >
        Log out
      </button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <CustomerGuard>
      <ProfileView />
    </CustomerGuard>
  );
}
