import type { Category } from "./types";

export interface ParsedQuery {
  categoryId?: number;
  categoryName?: string;
  minPrice?: number;
  maxPrice?: number;
  minPriceInclusive?: boolean;
  maxPriceInclusive?: boolean;
  keyword?: string;
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
// Strict bounds ("under $10") exclude the boundary; inclusive phrasings
// ("up to $10", "at least $10") include it.
const MAX_PRICE_STRICT_RE = /(?:under|below|less than|cheaper than)\s*\$?(\d+(?:\.\d+)?)/;
const MAX_PRICE_INCLUSIVE_RE = /(?:up to|no more than|at most)\s*\$?(\d+(?:\.\d+)?)/;
const MIN_PRICE_STRICT_RE = /(?:over|above|more than)\s*\$?(\d+(?:\.\d+)?)/;
const MIN_PRICE_INCLUSIVE_RE = /(?:starting at|at least)\s*\$?(\d+(?:\.\d+)?)/;

export function parseChatQuery(message: string, categories: Category[]): ParsedQuery {
  const lower = message.toLowerCase();

  let minPrice: number | undefined;
  let maxPrice: number | undefined;
  let minPriceInclusive = true;
  let maxPriceInclusive = true;
  let strippedPrice = lower;

  const rangeMatch = lower.match(PRICE_RANGE_RE);
  if (rangeMatch) {
    minPrice = Number(rangeMatch[1]);
    maxPrice = Number(rangeMatch[2]);
    strippedPrice = strippedPrice.replace(rangeMatch[0], " ");
  } else {
    const maxInclusiveMatch = lower.match(MAX_PRICE_INCLUSIVE_RE);
    const maxStrictMatch = lower.match(MAX_PRICE_STRICT_RE);
    if (maxInclusiveMatch) {
      maxPrice = Number(maxInclusiveMatch[1]);
      strippedPrice = strippedPrice.replace(maxInclusiveMatch[0], " ");
    } else if (maxStrictMatch) {
      maxPrice = Number(maxStrictMatch[1]);
      maxPriceInclusive = false;
      strippedPrice = strippedPrice.replace(maxStrictMatch[0], " ");
    }

    const minInclusiveMatch = lower.match(MIN_PRICE_INCLUSIVE_RE);
    const minStrictMatch = lower.match(MIN_PRICE_STRICT_RE);
    if (minInclusiveMatch) {
      minPrice = Number(minInclusiveMatch[1]);
      strippedPrice = strippedPrice.replace(minInclusiveMatch[0], " ");
    } else if (minStrictMatch) {
      minPrice = Number(minStrictMatch[1]);
      minPriceInclusive = false;
      strippedPrice = strippedPrice.replace(minStrictMatch[0], " ");
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
    minPriceInclusive,
    maxPriceInclusive,
    keyword: keywords.length > 0 ? keywords.sort((a, b) => b.length - a.length)[0] : undefined,
  };
}
