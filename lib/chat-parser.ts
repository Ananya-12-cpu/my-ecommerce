import type { Category } from "./types";

export interface ParsedQuery {
  categoryId?: number;
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
  keywords: string[];
}

const STOPWORDS = new Set([
  "show",
  "me",
  "i",
  "want",
  "need",
  "looking",
  "for",
  "a",
  "an",
  "the",
  "some",
  "please",
  "with",
  "products",
  "product",
  "that",
  "are",
  "is",
  "find",
  "search",
  "get",
  "can",
  "you",
  "my",
  "requirement",
  "requirements",
  "under",
  "over",
  "price",
  "of",
  "in",
  "to",
  "and",
  "budget",
  "have",
  "any",
  "all",
  "at",
]);

const PRICE_RANGE_RE = /(?:between\s+)?\$?(\d+(?:\.\d+)?)\s*(?:-|to|and)\s*\$?(\d+(?:\.\d+)?)/;
const MAX_PRICE_RE = /(?:under|below|less than|cheaper than|up to|no more than|at most)\s*\$?(\d+(?:\.\d+)?)/;
const MIN_PRICE_RE = /(?:over|above|more than|starting at|at least)\s*\$?(\d+(?:\.\d+)?)/;

export function parseChatQuery(message: string, categories: Category[]): ParsedQuery {
  const lower = message.toLowerCase();

  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let strippedPrice = lower;

  const rangeMatch = lower.match(PRICE_RANGE_RE);
  if (rangeMatch) {
    minPrice = Number(rangeMatch[1]);
    maxPrice = Number(rangeMatch[2]);
    strippedPrice = strippedPrice.replace(rangeMatch[0], " ");
  } else {
    const maxMatch = lower.match(MAX_PRICE_RE);
    if (maxMatch) {
      maxPrice = Number(maxMatch[1]);
      strippedPrice = strippedPrice.replace(maxMatch[0], " ");
    }

    const minMatch = lower.match(MIN_PRICE_RE);
    if (minMatch) {
      minPrice = Number(minMatch[1]);
      strippedPrice = strippedPrice.replace(minMatch[0], " ");
    }
  }

  let matchedCategory: Category | undefined;
  for (const category of categories) {
    const name = category.name.toLowerCase();
    const singular = name.endsWith("s") ? name.slice(0, -1) : name;
    if (lower.includes(name) || lower.includes(singular)) {
      matchedCategory = category;
      break;
    }
  }

  let cleaned = strippedPrice.replace(/\$/g, "");
  if (matchedCategory) {
    const name = matchedCategory.name.toLowerCase();
    const singular = name.endsWith("s") ? name.slice(0, -1) : name;
    cleaned = cleaned.replace(name, " ").replace(singular, " ");
  }

  const keywords = cleaned
    .split(/[^a-z0-9]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

  return {
    categoryId: matchedCategory?.id,
    categoryName: matchedCategory?.name,
    minPrice,
    maxPrice,
    keyword: keywords.length > 0 ? keywords.sort((a, b) => b.length - a.length)[0] : undefined,
    keywords,
  };
}
