import "server-only";
import type { AnalyticsSettings } from "@/lib/types";
import { readJsonStore, writeJsonStore } from "./json-store";

const FILE = "analytics.json";
const DEFAULT_ANALYTICS: AnalyticsSettings = { gtmId: "", metaPixelId: "" };

export async function getAnalyticsSettings(): Promise<AnalyticsSettings> {
  return readJsonStore(FILE, DEFAULT_ANALYTICS);
}

export async function updateAnalyticsSettings(
  patch: Partial<AnalyticsSettings>
): Promise<AnalyticsSettings> {
  const current = await getAnalyticsSettings();
  const next: AnalyticsSettings = { ...current, ...patch };
  await writeJsonStore(FILE, next);
  return next;
}
