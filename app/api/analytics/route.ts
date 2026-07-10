import { NextResponse } from "next/server";
import { getAnalyticsSettings, updateAnalyticsSettings } from "@/lib/server/analytics-store";

export async function GET() {
  const settings = await getAnalyticsSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const patch = await request.json();
  const settings = await updateAnalyticsSettings(patch);
  return NextResponse.json(settings);
}
