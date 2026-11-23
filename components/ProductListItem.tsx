import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductImage } from "@/lib/api";
import type { Product } from "@/lib/types";

export default function ProductListItem({ product }: { product: Product }) {
  const image = getProductImage(product.images);
  const [dollars, cents] = product.price.toFixed(2).split(".");

  return (
    <article className="flex gap-4 rounded-lg border border-zinc-200 p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:gap-6 sm:p-4 dark:border-zinc-800">
      <Link
        href={`/products/${product.id}`}
        className="aspect-square w-32 shrink-0 overflow-hidden rounded-md bg-zinc-100 sm:w-52 dark:bg-zinc-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-base font-medium hover:text-sky-700 hover:underline sm:text-lg dark:hover:text-sky-400"
        >
          {product.title}
        </Link>
        <Link
          href={`/shop?category=${product.category.id}`}
          className="w-fit text-xs text-sky-700 hover:underline dark:text-sky-400"
        >
          {product.category.name}
        </Link>

        <p className="mt-1 flex items-start leading-none">
          <span className="mt-0.5 text-sm">$</span>
          <span className="text-2xl font-semibold sm:text-3xl">{dollars}</span>
          <span className="mt-0.5 text-sm">{cents}</span>
        </p>

        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          FREE delivery on eligible orders
        </p>

        <p className="hidden line-clamp-2 text-sm text-zinc-500 sm:block dark:text-zinc-400">
          {product.description}
        </p>

        <div className="mt-auto w-full max-w-[200px] pt-2">
          <AddToCartButton
            id={product.id}
            title={product.title}
            price={product.price}
            image={image}
          />
        </div>
      </div>
    </article>
  );
}
