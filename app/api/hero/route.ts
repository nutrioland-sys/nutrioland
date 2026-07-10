import { NextResponse } from "next/server";
import { getHeroSettings, updateHeroSettings } from "@/lib/server/hero-store";

export async function GET() {
  const settings = await getHeroSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const patch = await request.json();
  const settings = await updateHeroSettings(patch);
  return NextResponse.json(settings);
}
