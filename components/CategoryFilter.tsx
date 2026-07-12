"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";

export default function CategoryFilter({
  categories,
  activeCategoryId,
}: {
  categories: Category[];
  activeCategoryId?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function buildHref(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    const query = params.toString();
    return query ? `/?${query}` : "/";
  }

  function applyPriceFilter() {
    router.push(
      buildHref({
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
      })
    );
  }

  const hasActiveFilters =
    !!activeCategoryId || !!searchParams.get("minPrice") || !!searchParams.get("maxPrice");

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    router.push("/");
  }

  return (
    <aside className="w-full shrink-0 space-y-8 sm:w-56">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Category
          </h2>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-zinc-500 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Link
            href={buildHref({ category: undefined })}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              !activeCategoryId
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref({ category: String(category.id) })}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                activeCategoryId === category.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Price
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-800"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-800"
          />
        </div>
        <button
          onClick={applyPriceFilter}
          className="mt-3 w-full rounded-md border border-zinc-200 py-1.5 text-sm transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          Apply
        </button>
      </div>
    </aside>
  );
}
