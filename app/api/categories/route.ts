import { NextResponse } from "next/server";
import { getCategories } from "@/lib/server/categories-store";

// Must regenerate on every request — otherwise Next.js would statically
// cache the response from whatever data existed at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json(categories);
}
