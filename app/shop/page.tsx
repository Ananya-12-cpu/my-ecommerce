import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const { category, minPrice, maxPrice } = await searchParams;
  const categoryId = category ? Number(category) : undefined;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categoryId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-10">
        <Link
          href="/"
          className="text-sm text-sky-700 hover:underline dark:text-sky-400"
        >
          ← Back to home
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {categories.find((c) => c.id === categoryId)?.name ?? "Shop"}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <CategoryFilter categories={categories} activeCategoryId={categoryId} />
        <div className="flex-1">
          {products.length === 0 ? (
            <p className="text-zinc-500 dark:text-zinc-400">
              No products found for this filter.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
