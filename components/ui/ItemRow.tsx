"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

/** Slide-out-then-remove behavior shared by cart/wishlist style lists. */
export function useAnimatedRemove(
  onRemove: (id: number) => void,
  delay = 300,
) {
  const [removing, setRemoving] = useState<number[]>([]);

  function remove(id: number) {
    setRemoving((r) => [...r, id]);
    setTimeout(() => {
      onRemove(id);
      setRemoving((r) => r.filter((x) => x !== id));
    }, delay);
  }

  return { removing, remove };
}

export default function ItemRow({
  id,
  title,
  price,
  image,
  removing,
  onRemove,
  removeLabel = "Remove",
  children,
}: {
  id: number;
  title: string;
  price: number;
  image: string;
  removing?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  /** Row-specific controls (quantity stepper, add-to-cart, line total…). */
  children?: ReactNode;
}) {
  return (
    <li
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-zinc-200 p-3 transition-shadow sm:p-4 hover:shadow-md dark:border-zinc-800 ${removing ? "animate-slide-out" : ""}`}
    >
      <Link href={`/products/${id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="h-16 w-16 rounded-md object-cover sm:h-20 sm:w-20"
        />
      </Link>
      <div className="min-w-0 flex-1 basis-32">
        <Link href={`/products/${id}`} className="line-clamp-2 font-medium hover:underline">
          {title}
        </Link>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          ${price.toFixed(2)}
        </p>
      </div>
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-sm text-zinc-400 hover:text-red-500"
          aria-label={removeLabel}
        >
          Remove
        </button>
      )}
    </li>
  );
}
