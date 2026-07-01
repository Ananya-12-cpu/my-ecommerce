import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryFilter({
  categories,
  activeCategoryId,
}: {
  categories: Category[];
  activeCategoryId?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          !activeCategoryId
            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
            : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/?category=${category.id}`}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeCategoryId === category.id
              ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
              : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
