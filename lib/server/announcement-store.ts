import "server-only";
import type { AnnouncementSettings } from "@/lib/types";
import { readJsonStore, writeJsonStore } from "./json-store";

const FILE = "announcement.json";
const DEFAULT_ANNOUNCEMENT: AnnouncementSettings = {
  enabled: true,
  messages: [
    "🎉 20% off your first order — use code FRESH20",
    "🚚 Free delivery on orders over Rs. 1,500",
  ],
};

export async function getAnnouncement(): Promise<AnnouncementSettings> {
  return readJsonStore(FILE, DEFAULT_ANNOUNCEMENT);
}

export async function updateAnnouncement(
  patch: Partial<AnnouncementSettings>
): Promise<AnnouncementSettings> {
  const current = await getAnnouncement();
  const next: AnnouncementSettings = { ...current, ...patch };
  await writeJsonStore(FILE, next);
  return next;
}
