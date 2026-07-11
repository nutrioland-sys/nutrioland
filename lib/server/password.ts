import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPasswordHash(password: string, hash: string, salt: string): boolean {
  const attempted = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return attempted.length === expected.length && timingSafeEqual(attempted, expected);
}
