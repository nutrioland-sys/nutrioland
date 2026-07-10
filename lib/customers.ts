import type { OrderRecord } from "./types";

export interface CustomerSummary {
  phone: string;
  name: string;
  addresses: string[];
  totalOrders: number;
  totalSpent: number;
  firstOrderAt: string;
  lastOrderAt: string;
}

export function getCustomersFromOrders(orders: OrderRecord[]): CustomerSummary[] {
  const byPhone = new Map<string, OrderRecord[]>();
  for (const order of orders) {
    const phone = order.customerPhone.trim();
    const existing = byPhone.get(phone);
    if (existing) existing.push(order);
    else byPhone.set(phone, [order]);
  }

  const customers: CustomerSummary[] = [];
  for (const [phone, customerOrders] of byPhone) {
    const sorted = [...customerOrders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const addresses = Array.from(new Set(sorted.map((o) => `${o.addressLine}, ${o.sector}`)));

    customers.push({
      phone,
      name: sorted[0].customerName,
      addresses,
      totalOrders: sorted.length,
      totalSpent: sorted.reduce((sum, o) => sum + o.total, 0),
      firstOrderAt: sorted[sorted.length - 1].createdAt,
      lastOrderAt: sorted[0].createdAt,
    });
  }

  return customers.sort(
    (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime()
  );
}
