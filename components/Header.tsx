"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Shoply
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">
            Shop
          </Link>
          <Link
            href="/wishlist"
            className="relative hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black">
                {totalItems}
              </span>
            )}
          </Link>
          {user && (
            <Link href="/offers" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              Offer Zone
            </Link>
          )}
          {user?.role === "admin" && (
            <>
              <Link href="/admin/analytics" className="hover:text-zinc-600 dark:hover:text-zinc-300">
                Analytics
              </Link>
              <Link href="/admin/reports" className="hover:text-zinc-600 dark:hover:text-zinc-300">
                Reports
              </Link>
              <Link href="/admin/customers" className="hover:text-zinc-600 dark:hover:text-zinc-300">
                Customers
              </Link>
            </>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {user.email}
                {user.role === "admin" && (
                  <span className="ml-1 rounded bg-black px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white dark:bg-white dark:text-black">
                    Admin
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={logout}
                className="hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="hover:text-zinc-600 dark:hover:text-zinc-300">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
