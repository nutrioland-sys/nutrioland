import { NextResponse } from "next/server";
import { updateCategory } from "@/lib/server/categories-store";

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
  const patch = await request.json();
  const category = await updateCategory(params.slug, patch);
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }
  return NextResponse.json(category);
}
