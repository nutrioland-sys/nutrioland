import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { AnnouncementSettings } from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "announcement.json");

export async function getAnnouncement(): Promise<AnnouncementSettings> {
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as AnnouncementSettings;
}

export async function updateAnnouncement(
  patch: Partial<AnnouncementSettings>
): Promise<AnnouncementSettings> {
  const current = await getAnnouncement();
  const next: AnnouncementSettings = { ...current, ...patch };
  await fs.writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
