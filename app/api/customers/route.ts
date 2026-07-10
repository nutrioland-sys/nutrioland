import { NextResponse } from "next/server";
import { getCustomersFromOrders } from "@/lib/customers";
import { getOrders } from "@/lib/server/orders-store";

// Reads data/orders.json fresh on every request so newly placed orders show
// up immediately instead of being frozen at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(getCustomersFromOrders(orders));
}
