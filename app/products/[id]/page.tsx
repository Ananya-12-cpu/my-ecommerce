import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import { getProductById, getProductImage } from "@/lib/api";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    notFound();
  }

  const image = getProductImage(product.images);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        &larr; Back to shop
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {product.category.name}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
          <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>

          <div className="mt-4 flex max-w-xs flex-col gap-3">
            <AddToCartButton
              id={product.id}
              title={product.title}
              price={product.price}
              image={image}
            />
            <WishlistButton
              id={product.id}
              title={product.title}
              price={product.price}
              image={image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
