import Link from "next/link";
import { getProductImage } from "@/lib/api";
import type { Category, Product } from "@/lib/types";

export default function CategoryCard({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  const tiles = products.length >= 4 ? products.slice(0, 4) : products.slice(0, 1);
  const grid = tiles.length === 4;

  return (
    <div className="flex flex-col rounded-md bg-white p-5 shadow-sm dark:bg-zinc-900">
      <h2 className="mb-3 text-xl font-bold">Shop {category.name}</h2>
      <div className={`grid flex-1 gap-3 ${grid ? "grid-cols-2" : "grid-cols-1"}`}>
        {tiles.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group">
            <div className="aspect-square overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getProductImage(product.images)}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <p className="mt-1 line-clamp-1 text-xs">{product.title}</p>
          </Link>
        ))}
      </div>
      <Link
        href={`/shop?category=${category.id}`}
        className="mt-4 text-sm text-sky-700 hover:text-orange-600 hover:underline dark:text-sky-400"
      >
        See all in {category.name}
      </Link>
    </div>
  );
}
