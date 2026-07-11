import { NextResponse } from "next/server";
import { getCustomerAccountByPhone, toPublicCustomer } from "@/lib/server/customer-accounts-store";
import { CUSTOMER_SESSION_COOKIE, createCustomerSessionToken } from "@/lib/server/customer-session";
import { verifyPasswordHash } from "@/lib/server/password";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!phone || !password) {
    return NextResponse.json({ error: "Phone number and password are required." }, { status: 400 });
  }

  const customer = await getCustomerAccountByPhone(phone);
  if (!customer || !verifyPasswordHash(password, customer.passwordHash, customer.passwordSalt)) {
    return NextResponse.json({ error: "Incorrect phone number or password." }, { status: 401 });
  }

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
