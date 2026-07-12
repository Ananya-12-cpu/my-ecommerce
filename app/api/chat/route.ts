import { NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/api";
import { parseChatQuery, type ParsedQuery } from "@/lib/chat-parser";
import type { Product } from "@/lib/types";

const MAX_RESULTS = 9;

function matchesFilters(product: Product, filters: ParsedQuery): boolean {
  if (filters.categoryId && product.category.id !== filters.categoryId) return false;
  if (filters.minPrice !== undefined) {
    if (filters.minPriceInclusive === false) {
      if (product.price <= filters.minPrice) return false;
    } else if (product.price < filters.minPrice) return false;
  }
  if (filters.maxPrice !== undefined) {
    if (filters.maxPriceInclusive === false) {
      if (product.price >= filters.maxPrice) return false;
    } else if (product.price > filters.maxPrice) return false;
  }
  return true;
}

export async function POST(request: Request) {
  const { message } = (await request.json()) as { message?: string };

  if (!message || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  const categories = await getCategories();
  const parsed = parseChatQuery(message, categories);

  // The upstream API doesn't reliably combine title/categoryId/price params
  // together, so only one server-side filter is sent per request and the
  // rest (price, category) are applied in-memory for correctness.
  let products = (
    await getProducts({ title: parsed.keyword, limit: 50 })
  ).filter((product) => matchesFilters(product, parsed));

  let usedKeyword = parsed.keyword;
  if (products.length === 0 && parsed.keyword) {
    usedKeyword = undefined;
    products = (
      await getProducts({ categoryId: parsed.categoryId, limit: 50 })
    ).filter((product) => matchesFilters(product, parsed));
  }

  products = products.slice(0, MAX_RESULTS);

  const appliedParams = new URLSearchParams();
  if (parsed.categoryId) appliedParams.set("category", String(parsed.categoryId));
  if (parsed.minPrice !== undefined)
    appliedParams.set("minPrice", String(parsed.minPrice));
  if (parsed.maxPrice !== undefined)
    appliedParams.set("maxPrice", String(parsed.maxPrice));
  const query = appliedParams.toString();
  const viewAllHref = query ? `/?${query}` : "/";

  const filterDescriptions: string[] = [];
  if (parsed.categoryName) filterDescriptions.push(parsed.categoryName.toLowerCase());
  if (usedKeyword) filterDescriptions.push(`"${usedKeyword}"`);
  if (parsed.minPrice !== undefined && parsed.maxPrice !== undefined) {
    filterDescriptions.push(`between $${parsed.minPrice} and $${parsed.maxPrice}`);
  } else if (parsed.maxPrice !== undefined) {
    filterDescriptions.push(`under $${parsed.maxPrice}`);
  } else if (parsed.minPrice !== undefined) {
    filterDescriptions.push(`over $${parsed.minPrice}`);
  }

  let reply: string;
  if (products.length === 0) {
    reply = filterDescriptions.length
      ? `I couldn't find anything matching ${filterDescriptions.join(", ")}. Try a different category or price range.`
      : "I couldn't find anything matching that. Try mentioning a category (like shoes or electronics) or a price range.";
  } else {
    reply = filterDescriptions.length
      ? `Here's what I found for ${filterDescriptions.join(", ")}:`
      : "Here's what I found:";
  }

  return NextResponse.json({
    reply,
    products,
    viewAllHref,
  });
}
