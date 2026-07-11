import { NextResponse } from "next/server";
import { getCustomerAccountById, setCustomerPassword } from "@/lib/server/customer-accounts-store";
import { getCustomerIdFromSession } from "@/lib/server/customer-session";
import { verifyPasswordHash } from "@/lib/server/password";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const customerId = await getCustomerIdFromSession();
  if (!customerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const customer = await getCustomerAccountById(customerId);
  if (!customer || !verifyPasswordHash(currentPassword, customer.passwordHash, customer.passwordSalt)) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await setCustomerPassword(customerId, newPassword);
  return NextResponse.json({ success: true });
}
