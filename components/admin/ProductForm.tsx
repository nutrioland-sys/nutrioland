"use client";

import { useState, type FormEvent } from "react";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import type { Category, Product, ProductCategory } from "@/lib/types";

export interface ProductFormValues {
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  image: string;
  imageAlt: string;
  badge: string;
  discountPercent: number;
  featured: boolean;
  isActive: boolean;
}

export default function ProductForm({
  categories,
  initialValue,
  onSave,
  onCancel,
}: {
  categories: Category[];
  initialValue?: Product;
  onSave: (values: ProductFormValues) => void;
  onCancel: () => void;
}) {
  const [sku, setSku] = useState(initialValue?.sku ?? "");
  const [name, setName] = useState(initialValue?.name ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    initialValue?.category ?? (categories[0]?.slug as ProductCategory)
  );
  const [price, setPrice] = useState(String(initialValue?.price ?? ""));
  const [unit, setUnit] = useState(initialValue?.unit ?? "kg");
  const [image, setImage] = useState(initialValue?.image ?? "");
  const [badge, setBadge] = useState(initialValue?.badge ?? "");
  const [discountPercent, setDiscountPercent] = useState(
    String(initialValue?.discountPercent ?? 0)
  );
  const [featured, setFeatured] = useState(initialValue?.featured ?? false);
  const [isActive, setIsActive] = useState(initialValue?.isActive ?? true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      sku,
      name,
      category,
      price: Number(price) || 0,
      unit,
      image,
      imageAlt: `Photo of ${name}`,
      badge,
      discountPercent: Math.min(Math.max(Number(discountPercent) || 0, 0), 100),
      featured,
      isActive,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-sku" className="text-sm font-semibold text-slate-800">
            SKU
          </label>
          <input
            id="product-sku"
            required
            value={sku}
            onChange={(event) => setSku(event.target.value)}
            placeholder="e.g. FRU-001"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm uppercase focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <p className="mt-1 text-xs text-slate-500">
            Unique product code — used to match rows when you re-import an edited spreadsheet.
          </p>
        </div>
        <div>
          <label htmlFor="product-name" className="text-sm font-semibold text-slate-800">
            Name
          </label>
          <input
            id="product-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-category" className="text-sm font-semibold text-slate-800">
            Category
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as ProductCategory)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="product-price" className="text-sm font-semibold text-slate-800">
            Price (Rs.)
          </label>
          <input
            id="product-price"
            type="number"
            min="0"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label htmlFor="product-unit" className="text-sm font-semibold text-slate-800">
            Unit
          </label>
          <input
            id="product-unit"
            required
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            placeholder="kg, dozen, bunch…"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label htmlFor="product-discount" className="text-sm font-semibold text-slate-800">
            Discount %
          </label>
          <input
            id="product-discount"
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(event) => setDiscountPercent(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-image" className="text-sm font-semibold text-slate-800">
          Image URL
        </label>
        <input
          id="product-image"
          type="url"
          required
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="https://images.unsplash.com/…"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <p className="mt-1 text-xs text-slate-500">
          Paste a photo URL — there&apos;s no file upload yet, so use a hosted image link (e.g.
          Unsplash) or a URL to your own hosted photo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-badge" className="text-sm font-semibold text-slate-800">
            Badge <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="product-badge"
            value={badge}
            onChange={(event) => setBadge(event.target.value)}
            placeholder="Best Seller, Seasonal…"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="h-4 w-4 rounded accent-brand"
            />
            Show in homepage &quot;Best-selling&quot; carousel
          </label>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ToggleSwitch
              checked={isActive}
              onChange={() => setIsActive((current) => !current)}
              label="Active — visible on the site"
            />
            <span>
              {isActive ? "Active" : "Inactive"} — toggle off to hide seasonally (e.g.
              off-season produce)
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save Product
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
