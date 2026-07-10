import "server-only";
import type { OrderRecord } from "@/lib/types";
import { readJsonStore, writeJsonStore } from "./json-store";

const FILE = "orders.json";

export async function getOrders(): Promise<OrderRecord[]> {
  return readJsonStore(FILE, [] as OrderRecord[]);
}

export async function getOrder(id: string): Promise<OrderRecord | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) ?? null;
}

async function saveOrders(orders: OrderRecord[]): Promise<void> {
  await writeJsonStore(FILE, orders);
}

export async function createOrder(
  input: Omit<OrderRecord, "id" | "createdAt">
): Promise<OrderRecord> {
  const orders = await getOrders();
  const newOrder: OrderRecord = {
    ...input,
    id: `NTL-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  await saveOrders(orders);
  return newOrder;
}

export async function updateOrder(
  id: string,
  patch: Partial<Omit<OrderRecord, "id" | "createdAt">>
): Promise<OrderRecord | null> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...patch, id, createdAt: orders[index].createdAt };
  await saveOrders(orders);
  return orders[index];
}
