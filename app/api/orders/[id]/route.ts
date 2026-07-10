import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/server/orders-store";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const patch = await request.json();
  const order = await updateOrder(params.id, patch);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}
