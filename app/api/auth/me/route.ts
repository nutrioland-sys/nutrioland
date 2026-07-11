import { NextResponse } from "next/server";
import { getCustomerAccountById, toPublicCustomer } from "@/lib/server/customer-accounts-store";
import { getCustomerIdFromSession } from "@/lib/server/customer-session";

export const dynamic = "force-dynamic";

export async function GET() {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ customer: null });
  }

  const customer = await getCustomerAccountById(customerId);
  if (!customer) {
    return NextResponse.json({ customer: null });
  }

  return NextResponse.json({ customer: toPublicCustomer(customer) });
}
