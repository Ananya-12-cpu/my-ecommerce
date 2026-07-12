const FALLBACK_IMAGE = "https://placehold.co/600x600?text=No+Image";

export function getProductImage(images: string[]): string {
  const valid = images?.find((src) => /^https?:\/\//.test(src));
  return valid ?? FALLBACK_IMAGE;
}
