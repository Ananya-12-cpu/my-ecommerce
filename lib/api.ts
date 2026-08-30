import type { Category, Product } from "./types";
import data from "@/data/data.json";
export { getProductImage } from "./image";

const { categories, products } = data as {
  categories: Category[];
  products: Product[];
};

export function getProducts(params?: {
  categoryId?: number;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  let result = products;

  if (params?.categoryId) {
    result = result.filter((product) => product.category.id === params.categoryId);
  }
  if (params?.title) {
    const query = params.title.toLowerCase();
    result = result.filter((product) => product.title.toLowerCase().includes(query));
  }
  if (params?.minPrice !== undefined) {
    result = result.filter((product) => product.price >= params.minPrice!);
  }
  if (params?.maxPrice !== undefined) {
    result = result.filter((product) => product.price <= params.maxPrice!);
  }

  const offset = params?.offset ?? 0;
  result = params?.limit !== undefined
    ? result.slice(offset, offset + params.limit)
    : result.slice(offset);

  return Promise.resolve(result);
}

export async function getProductById(id: number): Promise<Product | null> {
  return products.find((product) => product.id === id) ?? null;
}

export function getCategories(): Promise<Category[]> {
  return Promise.resolve(categories);
}
