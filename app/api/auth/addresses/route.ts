import { NextResponse } from "next/server";
import { addCustomerAddress, toPublicCustomer } from "@/lib/server/customer-accounts-store";
import { getCustomerIdFromSession } from "@/lib/server/customer-session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.sector || !body.addressLine) {
    return NextResponse.json({ error: "Sector and address are required." }, { status: 400 });
  }

  const updated = await addCustomerAddress(customerId, {
    label: body.label || "Home",
    sector: body.sector,
    addressLine: body.addressLine,
    pin: body.pin,
    isDefault: body.isDefault,
  });
  if (!updated) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }
  return NextResponse.json({ customer: toPublicCustomer(updated) });
}
