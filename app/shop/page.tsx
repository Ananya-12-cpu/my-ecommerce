import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import ProductListItem from "@/components/ProductListItem";
import SortSelect from "@/components/SortSelect";
import { getCategories, getProducts } from "@/lib/api";

const PROMOS = [
  {
    title: "Summer Dresses",
    eyebrow: "New season",
    alt: "Model wearing a floral wrap dress",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Statement Jewellery",
    eyebrow: "Trending now",
    alt: "Model wearing bracelets, necklace and sunglasses",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Designer Handbags",
    eyebrow: "Just in",
    alt: "Woman holding a leather handbag",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Street Sneakers",
    eyebrow: "Best sellers",
    alt: "Pair of white sneakers on a colourful background",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const { category, minPrice, maxPrice, sort = "featured" } = await searchParams;
  const categoryId = category ? Number(category) : undefined;

  const [categories, fetched] = await Promise.all([
    getCategories(),
    getProducts({
      categoryId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }),
  ]);

  const products = [...fetched];
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  else if (sort === "name") products.sort((a, b) => a.title.localeCompare(b.title));

  const title = categories.find((c) => c.id === categoryId)?.name ?? "All products";

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
      <nav className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-1">›</span>
        <Link href="/shop" className="hover:underline">
          Shop
        </Link>
        {categoryId && (
          <>
            <span className="mx-1">›</span>
            <span className="text-zinc-900 dark:text-zinc-100">{title}</span>
          </>
        )}
      </nav>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {products.length} {products.length === 1 ? "result" : "results"}
          </p>
        </div>
        <SortSelect value={sort} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <div className="flex flex-col gap-8 md:w-56 md:shrink-0">
          <CategoryFilter categories={categories} activeCategoryId={categoryId} />
          <div className="hidden min-h-96 flex-1 flex-col gap-4 md:flex">
            {PROMOS.map((promo) => (
              <Link
                key={promo.title}
                href="/offers"
                className="group relative min-h-44 flex-1 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={promo.image}
                  alt={promo.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-xs uppercase tracking-wide opacity-80">
                    {promo.eyebrow}
                  </p>
                  <p className="text-lg font-semibold leading-tight">{promo.title}</p>
                  <p className="mt-1 text-xs underline">Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-10 text-center dark:border-zinc-700">
              <p className="font-medium">No results found</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Try removing some filters or{" "}
                <Link href="/shop" className="text-sky-700 underline dark:text-sky-400">
                  browse all products
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="stagger flex flex-col gap-4">
              {products.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
