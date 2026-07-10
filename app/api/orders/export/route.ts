import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getOrders } from "@/lib/server/orders-store";
import { getProducts } from "@/lib/server/products-store";

// Must regenerate on every request — otherwise Next.js would statically
// cache the exported file from whatever data existed at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const [orders, products] = await Promise.all([getOrders(), getProducts()]);
  const skuByProductId = new Map(products.map((product) => [product.id, product.sku]));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Orders");

  sheet.columns = [
    { header: "Order ID", key: "orderId", width: 14 },
    { header: "Item SKU", key: "sku", width: 14 },
    { header: "Qty", key: "qty", width: 8 },
    { header: "Price", key: "price", width: 10 },
    { header: "Discount %", key: "discountPercent", width: 12 },
    { header: "Final Price", key: "finalPrice", width: 12 },
    { header: "Status", key: "status", width: 14 },
    { header: "Date", key: "date", width: 14 },
    { header: "Time", key: "time", width: 10 },
    { header: "Time Slot", key: "timeSlot", width: 22 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);
    const date = createdAt.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    for (const item of order.items) {
      const finalPrice = Math.round(
        item.price * item.quantity * (1 - order.discountPercent / 100)
      );
      sheet.addRow({
        orderId: order.id,
        sku: skuByProductId.get(item.productId) ?? item.name,
        qty: item.quantity,
        price: item.price,
        discountPercent: order.discountPercent,
        finalPrice,
        status: order.status,
        date,
        time,
        timeSlot: order.deliverySlot,
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="nutrioland-orders-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx"`,
    },
  });
}
