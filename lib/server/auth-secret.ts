import "server-only";
import { randomBytes } from "crypto";
import { readJsonStore } from "./json-store";

const FILE = "auth-secret.json";

interface AuthSecretRecord {
  secret: string;
}

let cached: string | null = null;

// Generated once and persisted on the same volume as the rest of the app's
// data, so customer session tokens stay valid across deploys without
// needing a manually configured environment variable.
export async function getAuthSecret(): Promise<string> {
  if (cached) return cached;
  const record = await readJsonStore<AuthSecretRecord>(FILE, {
    secret: randomBytes(32).toString("hex"),
  });
  cached = record.secret;
  return cached;
}
