import { NextResponse } from "next/server";
import { getCustomerAccountById } from "@/lib/server/customer-accounts-store";
import { getCustomerIdFromSession } from "@/lib/server/customer-session";
import { getOrders } from "@/lib/server/orders-store";

export const dynamic = "force-dynamic";

// A logged-in customer's order history is derived from the shared orders
// ledger by matching phone number — the same approach the admin "Customers"
// view uses — so history follows the account across devices instead of
// being trapped in one browser's local storage.
export async function GET() {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customer = await getCustomerAccountById(customerId);
  if (!customer) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const orders = await getOrders();
  const myOrders = orders.filter((order) => order.customerPhone.trim() === customer.phone);
  return NextResponse.json(myOrders);
}
