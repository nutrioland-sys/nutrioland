import "server-only";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");

// Reads a JSON data file, auto-creating it with the given default value the
// first time it's read (e.g. a fresh Railway volume that starts empty) so
// the app never crashes on a missing file instead of silently losing data.
export async function readJsonStore<T>(filename: string, defaultValue: T): Promise<T> {
  const dataFile = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeJsonStore(filename, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

export async function writeJsonStore<T>(filename: string, value: T): Promise<void> {
  const dataFile = path.join(DATA_DIR, filename);
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(value, null, 2), "utf-8");
}
