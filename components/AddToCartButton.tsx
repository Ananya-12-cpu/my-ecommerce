"use client";

import Link from "next/link";
import { useLoginPrompt } from "@/components/LoginPrompt";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const buttonClass =
  "block w-full rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200";

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
  const { user } = useAuth();
  const showLoginPrompt = useLoginPrompt();
  const inCart = !!user && items.some((item) => item.id === id);

  if (inCart) {
    return (
      <Link href="/cart" className={`${buttonClass} animate-scale-in`}>
        Go to cart
      </Link>
    );
  }

  return (
    <button
      onClick={() =>
        user ? addItem({ id, title, price, image }) : showLoginPrompt()
      }
      className={buttonClass}
    >
      Add to cart
    </button>
  );
}
