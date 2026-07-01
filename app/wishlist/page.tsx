"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Your wishlist is empty</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Save products you love for later.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Your wishlist
      </h1>

      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <Link href={`/products/${item.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-20 w-20 rounded-md object-cover"
              />
            </Link>
            <div className="flex-1">
              <Link
                href={`/products/${item.id}`}
                className="font-medium hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => addItem(item)}
              className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-black"
            >
              Add to cart
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-zinc-400 hover:text-red-500"
              aria-label="Remove from wishlist"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
