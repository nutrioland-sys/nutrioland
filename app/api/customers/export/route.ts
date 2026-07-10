import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getCustomersFromOrders } from "@/lib/customers";
import { getOrders } from "@/lib/server/orders-store";

// Must regenerate on every request — otherwise Next.js would statically
// cache the exported file from whatever data existed at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await getOrders();
  const customers = getCustomersFromOrders(orders);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Customers");

  sheet.columns = [
    { header: "Name", key: "name", width: 22 },
    { header: "Phone", key: "phone", width: 16 },
    { header: "Total Orders", key: "totalOrders", width: 14 },
    { header: "Total Spent", key: "totalSpent", width: 14 },
    { header: "First Order", key: "firstOrder", width: 14 },
    { header: "Last Order", key: "lastOrder", width: 14 },
    { header: "Addresses", key: "addresses", width: 50 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const customer of customers) {
    sheet.addRow({
      name: customer.name,
      phone: customer.phone,
      totalOrders: customer.totalOrders,
      totalSpent: customer.totalSpent,
      firstOrder: new Date(customer.firstOrderAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      lastOrder: new Date(customer.lastOrderAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      addresses: customer.addresses.join("; "),
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="nutrioland-customers-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx"`,
    },
  });
}
