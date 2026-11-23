"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";

const PRICE_RANGES: { label: string; min?: string; max?: string }[] = [
  { label: "Any price" },
  { label: "Under $25", max: "25" },
  { label: "$25 – $50", min: "25", max: "50" },
  { label: "$50 – $100", min: "50", max: "100" },
  { label: "$100 – $200", min: "100", max: "200" },
  { label: "$200 & above", min: "200" },
];

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
  // Price filter is collapsed behind a toggle on small screens.
  const [priceOpen, setPriceOpen] = useState(
    !!searchParams.get("minPrice") || !!searchParams.get("maxPrice"),
  );

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
    return query ? `/shop?${query}` : "/shop";
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
    router.push(
      searchParams.get("sort") ? `/shop?sort=${searchParams.get("sort")}` : "/shop"
    );
  }

  return (
    <aside className="w-full space-y-4 md:space-y-8">
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
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          <Link
            href={buildHref({ category: undefined })}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors md:rounded-md md:border-transparent md:px-3 ${
              !activeCategoryId
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildHref({ category: String(category.id) })}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors md:rounded-md md:border-transparent md:px-3 ${
                activeCategoryId === category.id
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setPriceOpen((v) => !v)}
          aria-expanded={priceOpen}
          aria-controls="price-filter"
          className="flex w-full items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium dark:border-zinc-800 md:hidden"
        >
          <span>Price{(searchParams.get("minPrice") || searchParams.get("maxPrice")) && " · filtered"}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${priceOpen ? "rotate-180" : ""}`}
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <h2 className="mb-3 hidden text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 md:block">
          Price
        </h2>
        <div id="price-filter" className={`mt-3 md:mt-0 md:block ${priceOpen ? "block" : "hidden"}`}>
        <ul className="mb-3 grid grid-cols-2 gap-1 text-sm md:block md:space-y-1">
          {PRICE_RANGES.map((range) => {
            const active =
              (searchParams.get("minPrice") ?? "") === (range.min ?? "") &&
              (searchParams.get("maxPrice") ?? "") === (range.max ?? "");
            return (
              <li key={range.label}>
                <Link
                  href={buildHref({ minPrice: range.min, maxPrice: range.max })}
                  className={`block rounded-md px-3 py-1 transition-colors ${
                    active
                      ? "font-semibold text-sky-700 dark:text-sky-400"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {range.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-2 py-2 text-base dark:border-zinc-800 md:py-1.5 md:text-sm"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full min-w-0 flex-1 rounded-md border border-zinc-200 bg-transparent px-2 py-2 text-base dark:border-zinc-800 md:py-1.5 md:text-sm"
          />
        </div>
        <button
          onClick={applyPriceFilter}
          className="mt-3 w-full rounded-md border border-zinc-200 py-2 text-sm md:py-1.5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        >
          Apply
        </button>
        </div>
      </div>
    </aside>
  );
}
