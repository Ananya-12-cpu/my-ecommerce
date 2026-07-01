"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Browse the shop and add something you like.
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
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Your cart</h1>

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
              <Link href={`/products/${item.id}`} className="font-medium hover:underline">
                {item.title}
              </Link>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 rounded-full border border-zinc-300 hover:border-zinc-500 dark:border-zinc-700"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 rounded-full border border-zinc-300 hover:border-zinc-500 dark:border-zinc-700"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-sm text-zinc-400 hover:text-red-500"
              aria-label="Remove item"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <button
          onClick={clearCart}
          className="text-sm text-zinc-500 hover:text-red-500 dark:text-zinc-400"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total</p>
          <p className="text-2xl font-semibold">${totalPrice.toFixed(2)}</p>
        </div>
      </div>

      <button className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black">
        Checkout
      </button>
    </div>
  );
}
