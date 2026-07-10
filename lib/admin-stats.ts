import type { OrderRecord } from "./types";

export interface DailyStat {
  date: string;
  label: string;
  orders: number;
  items: number;
  revenue: number;
}

export function buildDailyStats(orders: OrderRecord[], days = 14): DailyStat[] {
  const buckets: DailyStat[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    buckets.push({
      date: dateKey,
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      orders: 0,
      items: 0,
      revenue: 0,
    });
  }

  const bucketMap = new Map(buckets.map((bucket) => [bucket.date, bucket]));
  for (const order of orders) {
    const dateKey = order.createdAt.slice(0, 10);
    const bucket = bucketMap.get(dateKey);
    if (!bucket) continue;
    bucket.orders += 1;
    bucket.items += order.items.reduce((sum, item) => sum + item.quantity, 0);
    bucket.revenue += order.total;
  }

  return buckets;
}

export function getTodayStats(orders: OrderRecord[]) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter((order) => order.createdAt.slice(0, 10) === todayKey);
  return {
    orders: todaysOrders.length,
    items: todaysOrders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    ),
    revenue: todaysOrders.reduce((sum, order) => sum + order.total, 0),
  };
}
