export const ADMIN_SESSION_COOKIE = "admin_session";

// Uses the Web Crypto API (not Node's `crypto` module) so this works
// identically in Node.js API routes and in Edge middleware.
async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export async function verifyPassword(password: string): Promise<boolean> {
  const expected = getAdminPassword();
  return expected.length > 0 && password === expected;
}

export async function createSessionToken(): Promise<string> {
  return sha256Hex(`nutrioland-admin-session:${getAdminPassword()}`);
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  return token === expected;
}
