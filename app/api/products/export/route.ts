import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/server/products-store";

// Must regenerate on every request — otherwise Next.js would statically
// cache the exported file from whatever data existed at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Products");

  sheet.columns = [
    { header: "SKU", key: "sku", width: 14 },
    { header: "Name", key: "name", width: 24 },
    { header: "Category", key: "category", width: 18 },
    { header: "Price", key: "price", width: 10 },
    { header: "Unit", key: "unit", width: 10 },
    { header: "Discount %", key: "discountPercent", width: 12 },
    { header: "Badge", key: "badge", width: 16 },
    { header: "Featured", key: "featured", width: 10 },
    { header: "Active", key: "isActive", width: 10 },
    { header: "Image URL", key: "image", width: 50 },
    { header: "Image Alt", key: "imageAlt", width: 40 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const product of products) {
    sheet.addRow({
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      discountPercent: product.discountPercent ?? 0,
      badge: product.badge ?? "",
      featured: product.featured ?? false,
      isActive: product.isActive,
      image: product.image,
      imageAlt: product.imageAlt,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="nutrioland-products-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx"`,
    },
  });
}
