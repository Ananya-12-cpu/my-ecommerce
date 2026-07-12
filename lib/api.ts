import type { Category, Product } from "./types";
export { getProductImage } from "./image";

const BASE_URL = process.env.REACT_APP_BASE_URL;

if (!BASE_URL) {
  throw new Error("REACT_APP_BASE_URL is not set in the environment");
}

async function apiFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export function getProducts(params?: {
  categoryId?: number;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.categoryId) search.set("categoryId", String(params.categoryId));
  if (params?.title) search.set("title", params.title);
  if (params?.minPrice !== undefined)
    search.set("price_min", String(params.minPrice));
  if (params?.maxPrice !== undefined)
    search.set("price_max", String(params.maxPrice));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.offset) search.set("offset", String(params.offset));

  const query = search.toString();
  return apiFetch<Product[]>(`/products${query ? `?${query}` : ""}`);
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    return await apiFetch<Product>(`/products/${id}`);
  } catch {
    return null;
  }
}

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", 3600);
}
