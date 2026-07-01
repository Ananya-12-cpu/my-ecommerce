"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export default function Header() {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

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
        </nav>
      </div>
    </header>
  );
}
