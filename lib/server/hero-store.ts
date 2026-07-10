import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { HeroSettings } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "hero.json");

export async function getHeroSettings(): Promise<HeroSettings> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as HeroSettings;
}

export async function updateHeroSettings(
  patch: Partial<HeroSettings>
): Promise<HeroSettings> {
  const current = await getHeroSettings();
  const next: HeroSettings = { ...current, ...patch };
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
