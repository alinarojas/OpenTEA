// src/utils/urlHelpers.ts
import { CATEGORY_CONFIG } from "../config/categories";

export function getTranslatedSlug(currentSlug: string, targetLang: 'en' | 'es') {
  // 1. Find which category this slug belongs to
  const entry = Object.values(CATEGORY_CONFIG).find((cat) => 
    cat.slug.en === currentSlug || cat.slug.es === currentSlug
  );

  // 2. If found, return the slug for the TARGET language
  if (entry) {
    return entry.slug[targetLang];
  }

  // 3. If not found (e.g., it's a random word), return it as is
  return currentSlug;
}