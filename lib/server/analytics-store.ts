import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { AnalyticsSettings } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "analytics.json");

export async function getAnalyticsSettings(): Promise<AnalyticsSettings> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as AnalyticsSettings;
}

export async function updateAnalyticsSettings(
  patch: Partial<AnalyticsSettings>
): Promise<AnalyticsSettings> {
  const current = await getAnalyticsSettings();
  const next: AnalyticsSettings = { ...current, ...patch };
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
