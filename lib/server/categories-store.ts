import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Category } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "categories.json");

export async function getCategories(): Promise<Category[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Category[];
}

async function saveCategories(categories: Category[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

// Slugs are fixed (they're the join key to Product.category), so this only
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
