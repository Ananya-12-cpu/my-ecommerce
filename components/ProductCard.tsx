import Link from "next/link";
import { getProductImage } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-shadow hover:shadow-md dark:border-zinc-800"
    >
      <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getProductImage(product.images)}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          {product.category.name}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
        <p className="mt-auto pt-2 text-base font-semibold">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
