import { NextResponse } from "next/server";
import { deleteProduct, updateProduct } from "@/lib/server/products-store";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const patch = await request.json();
  const product = await updateProduct(params.id, patch);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const success = await deleteProduct(params.id);
  if (!success) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
