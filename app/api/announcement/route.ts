import { NextResponse } from "next/server";
import { getAnnouncement, updateAnnouncement } from "@/lib/server/announcement-store";

export async function GET() {
  const settings = await getAnnouncement();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const patch = await request.json();
  const settings = await updateAnnouncement(patch);
  return NextResponse.json(settings);
}
