import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/server/orders-store";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json(orders);
}

// Public: used by the customer-facing checkout page to submit a new order.
export async function POST(request: Request) {
  const body = await request.json();
  const order = await createOrder(body);
  return NextResponse.json(order, { status: 201 });
}
