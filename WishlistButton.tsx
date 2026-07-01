"use client";

import { useWishlist } from "@/lib/wishlist-context";

export default function WishlistButton({
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
  const { isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(id);

  return (
    <button
      onClick={() => toggleItem({ id, title, price, image })}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-colors ${
        wishlisted
          ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40"
          : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
      }`}
    >
      <span aria-hidden="true">{wishlisted ? "♥" : "♡"}</span>
      {wishlisted ? "Wishlisted" : "Add to wishlist"}
    </button>
  );
}
