import "server-only";
import type { Category } from "@/lib/types";
import { readJsonStore, writeJsonStore } from "./json-store";
import categoriesSeed from "./seed/categories-seed.json";

const FILE = "categories.json";

export async function getCategories(): Promise<Category[]> {
  return readJsonStore(FILE, categoriesSeed as Category[]);
}

async function saveCategories(categories: Category[]): Promise<void> {
  await writeJsonStore(FILE, categories);
}

// Slugs are fixed (they're the join key to Product.categories), so this only
// ever updates an existing category's display name/description/image — it
// never creates or deletes one.
export async function updateCategory(
  slug: string,
  patch: Partial<Pick<Category, "name" | "description" | "image" | "imageAlt">>
): Promise<Category | null> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.slug === slug);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...patch, slug };
  await saveCategories(categories);
  return categories[index];
}
