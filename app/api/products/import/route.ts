import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getCategories } from "@/lib/server/categories-store";
import { upsertProductBySku } from "@/lib/server/products-store";

interface ParsedRow {
  rowNumber: number;
  sku: string;
  name: string;
  categories: string[];
  price: number;
  unit: string;
  discountPercent: number;
  badge: string;
  featured: boolean;
  isActive: boolean;
  image: string;
  imageAlt: string;
}

function cellText(value: ExcelJS.CellValue): string {
  return value === null || value === undefined ? "" : String(value).trim();
}

export async function POST(request: Request) {
  const categories = await getCategories();
  const validCategories = new Set(categories.map((category) => category.slug));

  const arrayBuffer = await request.arrayBuffer();
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.load(arrayBuffer);
  } catch {
    return NextResponse.json({ error: "Could not read that file as an Excel workbook." }, {
      status: 400,
    });
  }

  const sheet = workbook.worksheets[0];
  if (!sheet) {
    return NextResponse.json({ error: "No worksheet found in the uploaded file." }, {
      status: 400,
    });
  }

  // Collect rows first — the actual upserts below must run one at a time
  // (not in this synchronous callback) since each one reads-modifies-writes
  // the same products.json file; running them concurrently would clobber
  // each other's writes.
  const rows: ParsedRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    rows.push({
      rowNumber,
      sku: cellText(row.getCell(1).value),
      name: cellText(row.getCell(2).value),
      categories: cellText(row.getCell(3).value)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      price: Number(row.getCell(4).value ?? 0),
      unit: cellText(row.getCell(5).value),
      discountPercent: Number(row.getCell(6).value ?? 0),
      badge: cellText(row.getCell(7).value),
      featured: Boolean(row.getCell(8).value),
      isActive: row.getCell(9).value !== false,
      image: cellText(row.getCell(10).value),
      imageAlt: cellText(row.getCell(11).value),
    });
  });

  let updated = 0;
  const errors: string[] = [];

  for (const row of rows) {
    if (!row.sku || !row.name) {
      errors.push(`Row ${row.rowNumber}: missing SKU or Name — skipped.`);
      continue;
    }
    const unknownCategory = row.categories.find((c) => !validCategories.has(c));
    if (row.categories.length === 0 || unknownCategory) {
      errors.push(
        `Row ${row.rowNumber}: unknown or missing category "${unknownCategory ?? ""}" — skipped.`
      );
      continue;
    }

    await upsertProductBySku({
      sku: row.sku,
      name: row.name,
      categories: row.categories,
      price: row.price,
      unit: row.unit,
      discountPercent: Math.min(Math.max(row.discountPercent || 0, 0), 100),
      badge: row.badge || undefined,
      featured: row.featured,
      isActive: row.isActive,
      image: row.image,
      imageAlt: row.imageAlt || `Photo of ${row.name}`,
    });
    updated += 1;
  }

  return NextResponse.json({ updated, errors });
}
