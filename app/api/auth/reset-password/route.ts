import { NextResponse } from "next/server";
import { getCustomerAccountByPhone, setCustomerPassword } from "@/lib/server/customer-accounts-store";

export const dynamic = "force-dynamic";

// There's no email/SMS provider configured for this site, so a true "reset
// link" flow isn't possible yet. As a lightweight stand-in, password reset
// is gated on the customer proving they know the phone number and the exact
// name on the account. This is not strong identity verification — anyone
// who knows those two details (e.g. shared with family) could reset the
// password. Upgrade to an SMS OTP or email link once a provider is set up.
export async function POST(request: Request) {
  const body = await request.json();
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!phone || !name || !newPassword) {
    return NextResponse.json(
      { error: "Phone number, name, and a new password are all required." },
      { status: 400 }
    );
  }
  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const customer = await getCustomerAccountByPhone(phone);
  if (!customer || customer.name.trim().toLowerCase() !== name.toLowerCase()) {
    return NextResponse.json(
      { error: "We couldn't find an account matching that phone number and name." },
      { status: 404 }
    );
  }

  await setCustomerPassword(customer.id, newPassword);
  return NextResponse.json({ success: true });
}
