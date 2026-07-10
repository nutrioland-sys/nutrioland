import "server-only";
import type { HeroSettings } from "@/lib/types";
import { readJsonStore, writeJsonStore } from "./json-store";

const FILE = "hero.json";

const DEFAULT_HERO: HeroSettings = {
  images: [
    {
      image:
        "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=1200&auto=format&fit=crop",
      imageAlt: "Placeholder photo of an assortment of fresh fruits and vegetables",
    },
  ],
};

export async function getHeroSettings(): Promise<HeroSettings> {
  return readJsonStore(FILE, DEFAULT_HERO);
}

export async function updateHeroSettings(
  patch: Partial<HeroSettings>
): Promise<HeroSettings> {
  const current = await getHeroSettings();
  const next: HeroSettings = { ...current, ...patch };
  await writeJsonStore(FILE, next);
  return next;
}
