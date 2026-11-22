import Link from "next/link";
import { getProductImage } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductRow({
  title,
  products,
  href,
  linkLabel = "See all",
}: {
  title: string;
  products: Product[];
  href?: string;
  linkLabel?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="rounded-md bg-white p-5 shadow-sm dark:bg-zinc-900">
      <div className="mb-4 flex items-baseline gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-sky-700 hover:text-orange-600 hover:underline dark:text-sky-400"
          >
            {linkLabel}
          </Link>
        )}
      </div>
      <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-2">
        {products.map((product) => (
          <li key={product.id} className="w-40 shrink-0 snap-start sm:w-48">
            <Link href={`/products/${product.id}`} className="group block">
              <div className="aspect-square overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getProductImage(product.images)}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm group-hover:text-orange-600">
                {product.title}
              </p>
              <p className="mt-1 text-lg font-semibold">
                <span className="align-top text-xs">$</span>
                {product.price.toFixed(2)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
