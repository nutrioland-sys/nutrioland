import { NextResponse } from "next/server";
import { toPublicCustomer, updateCustomerAccount } from "@/lib/server/customer-accounts-store";
import { getCustomerIdFromSession } from "@/lib/server/customer-session";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const patch: { name?: string; email?: string } = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if (typeof body.email === "string") patch.email = body.email.trim() || undefined;

  const updated = await updateCustomerAccount(customerId, patch);
  if (!updated) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  return NextResponse.json({ customer: toPublicCustomer(updated) });
}
