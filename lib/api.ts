import type { Category, Product } from "./types";

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
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const search = new URLSearchParams();
  if (params?.categoryId) search.set("categoryId", String(params.categoryId));
  if (params?.title) search.set("title", params.title);
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

const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";

export function getProductImage(images: string[]): string {
  const valid = images?.find((src) => /^https?:\/\//.test(src));
  return valid ?? FALLBACK_IMAGE;
}
