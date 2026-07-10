import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyPassword } from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (typeof password !== "string" || !(await verifyPassword(password))) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
