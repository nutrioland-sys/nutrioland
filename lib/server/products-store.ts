import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "products.json");

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `product-${Date.now()}`
  );
}

export async function getProducts(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) ?? null;
}

async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export async function createProduct(input: Omit<Product, "id">): Promise<Product> {
  const products = await getProducts();
  const baseId = slugify(input.name);
  const id = products.some((p) => p.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
  const newProduct: Product = { ...input, id };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function updateProduct(
  id: string,
  patch: Partial<Omit<Product, "id">>
): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...patch, id };
  await saveProducts(products);
  return products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  await saveProducts(next);
  return true;
}

export async function getActiveProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.isActive);
}

/**
 * Used by the Excel import — SKU is the business/matching key there: an
 * existing product with this SKU gets updated in place, otherwise a new
 * product is created (with a fresh internal `id` generated from its name).
 */
export async function upsertProductBySku(
  input: Omit<Product, "id"> & { sku: string }
): Promise<Product> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.sku === input.sku);

  if (index !== -1) {
    products[index] = { ...products[index], ...input, id: products[index].id };
    await saveProducts(products);
    return products[index];
  }

  const baseId = slugify(input.name || input.sku);
  const id = products.some((p) => p.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
  const newProduct: Product = { ...input, id };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}
