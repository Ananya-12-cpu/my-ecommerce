import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts } from "@/lib/api";

export default async function Home({
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
      limit: 24,
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Shop the collection
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Quality products, honest prices.
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
