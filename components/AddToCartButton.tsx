"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const buttonClass =
  "w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200";

export default function AddToCartButton({
  id,
  title,
  price,
  image,
}: {
  id: number;
  title: string;
  price: number;
  image: string;
}) {
  const { items, addItem } = useCart();
  const inCart = items.some((item) => item.id === id);

  if (inCart) {
    return (
      <Link href="/cart" className={`${buttonClass} animate-scale-in`}>
        Go to cart
      </Link>
    );
  }

  return (
    <button
      onClick={() => addItem({ id, title, price, image })}
      className={buttonClass}
    >
      Add to cart
    </button>
  );
}
