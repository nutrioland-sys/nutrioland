import { NextResponse } from "next/server";
import {
  removeCustomerAddress,
  toPublicCustomer,
  updateCustomerAddress,
} from "@/lib/server/customer-accounts-store";
import { getCustomerIdFromSession } from "@/lib/server/customer-session";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updated = await updateCustomerAddress(customerId, params.id, body);
  if (!updated) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  return NextResponse.json({ customer: toPublicCustomer(updated) });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = await removeCustomerAddress(customerId, params.id);
  if (!updated) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  return NextResponse.json({ customer: toPublicCustomer(updated) });
}
