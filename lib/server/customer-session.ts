import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAuthSecret } from "./auth-secret";

export const CUSTOMER_SESSION_COOKIE = "customer_session";
const SESSION_DAYS = 30;

async function sign(payload: string): Promise<string> {
  const secret = await getAuthSecret();
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export async function createCustomerSessionToken(customerId: string): Promise<string> {
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${customerId}.${expiry}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function verifyCustomerSessionToken(
  token: string | undefined | null
): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [customerId, expiryStr, signature] = parts;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return null;

  const expectedSignature = await sign(`${customerId}.${expiryStr}`);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  return customerId;
}

// Reads and verifies the session cookie for the current request — the one
// helper every protected /api/auth/* route should call.
export async function getCustomerIdFromSession(): Promise<string | null> {
  const token = cookies().get(CUSTOMER_SESSION_COOKIE)?.value;
  return verifyCustomerSessionToken(token);
}
