import Reveal from "@/components/Reveal";
import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";
import CategoryCard from "@/components/CategoryCard";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import ProductRow from "@/components/ProductRow";
import { getCategories, getProductImage, getProducts } from "@/lib/api";
import { activeOffers } from "@/lib/offers-data";

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({}),
  ]);

  // ---- Landing page ----
  const byCategory = (id: number) => products.filter((p) => p.category.id === id);
  const firstOf = (id: number) => byCategory(id)[0] ?? products[0];

  const gradients = [
    "bg-gradient-to-r from-sky-800 via-sky-600 to-cyan-500",
    "bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-500",
    "bg-gradient-to-r from-violet-800 via-fuchsia-700 to-rose-500",
    "bg-gradient-to-r from-orange-700 via-orange-500 to-amber-400",
  ];
  const heroCopy = [
    { eyebrow: "Top picks", title: "Tech that keeps up with you", subtitle: "Headphones, watches and gadgets at honest prices." },
    { eyebrow: "Step into style", title: "Fresh looks for every day", subtitle: "Footwear and apparel you'll actually reach for." },
    { eyebrow: "Make it home", title: "Little upgrades, big comfort", subtitle: "Home essentials to brighten every room." },
    { eyebrow: "Complete the look", title: "Accessories worth adding", subtitle: "Small things that make a big difference." },
  ];
  const slides: HeroSlide[] = categories.slice(0, 4).map((cat, i) => ({
    ...heroCopy[i],
    cta: `Shop ${cat.name}`,
    href: `/shop?category=${cat.id}`,
    image: getProductImage(firstOf(cat.id)?.images ?? []),
    gradient: gradients[i % gradients.length],
  }));

  const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 10);
  const under50 = products.filter((p) => p.price <= 50).slice(0, 10);
  const premium = [...products].sort((a, b) => b.price - a.price).slice(0, 10);

  const perks = [
    { title: "Free shipping", text: "On orders over $50" },
    { title: "Easy returns", text: "Hassle-free within 30 days" },
    { title: "Secure checkout", text: "Your details stay protected" },
    { title: "Offer Zone", text: "Fresh coupon codes, always" },
  ];

  return (
    <div className="flex-1 bg-zinc-100 pb-12 dark:bg-zinc-950">
      <HeroCarousel slides={slides} />

      <div className="relative z-[1] mx-auto -mt-20 w-full max-w-[1500px] space-y-5 px-4 sm:-mt-28 sm:px-6">
        {/* Category cards */}
        <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} products={byCategory(cat.id)} />
          ))}

          <div className="flex flex-col rounded-md bg-white p-5 shadow-sm dark:bg-zinc-900">
            <h2 className="mb-3 text-xl font-bold">Today&apos;s offers</h2>
            <ul className="flex-1 space-y-3">
              {activeOffers.slice(0, 3).map((offer) => (
                <li
                  key={offer.code}
                  className="flex items-center justify-between gap-3 rounded border border-dashed border-zinc-300 p-3 dark:border-zinc-700"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{offer.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Code{" "}
                      <span className="font-mono font-semibold">{offer.code}</span>
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded px-2 py-1 text-[11px] font-bold text-white"
                    style={{ backgroundColor: offer.color }}
                  >
                    {offer.discount}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/offers"
              className="mt-4 text-sm text-sky-700 hover:text-orange-600 hover:underline dark:text-sky-400"
            >
              Visit the Offer Zone
            </Link>
          </div>
        </div>

        <Reveal><ProductRow title="New arrivals" products={newArrivals} href="/shop" /></Reveal>
        <Reveal><ProductRow title="Under $50" products={under50} href="/shop?maxPrice=50" /></Reveal>

        {/* Promo banner */}
        <Reveal><Link
          href="/offers"
          className="block rounded-md bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 p-8 text-white shadow-sm transition-opacity hover:opacity-95 sm:p-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
            Members only
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
            Sign in to unlock exclusive coupon codes
          </h2>
          <p className="mt-2 text-sm text-white/75 sm:text-base">
            Save more on every order with offers picked just for you.
          </p>
          <span className="mt-5 inline-block rounded-full bg-amber-400 px-6 py-2.5 text-sm font-semibold text-zinc-900">
            Explore offers
          </span>
        </Link></Reveal>

        <Reveal><ProductRow title="Premium picks" products={premium} href="/shop" /></Reveal>

        {/* Perks */}
        <Reveal><div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-md bg-white p-5 text-center shadow-sm dark:bg-zinc-900"
            >
              <p className="font-semibold">{perk.title}</p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {perk.text}
              </p>
            </div>
          ))}
        </div></Reveal>

        {/* Full catalogue */}
        <Reveal><section
          id="all-products"
          className="scroll-mt-20 rounded-md bg-white p-5 shadow-sm dark:bg-zinc-900"
        >
          <h2 className="mb-4 text-xl font-bold">Explore all products</h2>
          <div className="stagger grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section></Reveal>
      </div>
    </div>
  );
}
