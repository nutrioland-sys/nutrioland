import { NextResponse } from "next/server";
import {
  createCustomerAccount,
  getCustomerAccountByPhone,
  toPublicCustomer,
} from "@/lib/server/customer-accounts-store";
import { CUSTOMER_SESSION_COOKIE, createCustomerSessionToken } from "@/lib/server/customer-session";
import type { SavedAddress } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const address = body.address as Omit<SavedAddress, "id"> | undefined;

  if (!name || !phone || !password) {
    return NextResponse.json(
      { error: "Name, phone number, and password are required." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const existing = await getCustomerAccountByPhone(phone);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this phone number already exists. Try signing in instead." },
      { status: 409 }
    );
  }

  const customer = await createCustomerAccount({
    name,
    phone,
    email: email || undefined,
    password,
    addresses:
      address && address.sector && address.addressLine
        ? [{ ...address, id: `addr-${Date.now()}`, isDefault: true }]
        : [],
  });

  const token = await createCustomerSessionToken(customer.id);
  const response = NextResponse.json({ customer: toPublicCustomer(customer) });
  response.cookies.set(CUSTOMER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
