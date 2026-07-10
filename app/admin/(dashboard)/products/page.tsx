"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";
import ProductForm, { type ProductFormValues } from "@/components/admin/ProductForm";
import ToggleSwitch from "@/components/admin/ToggleSwitch";
import { PencilIcon } from "@/components/icons";
import { formatPKR, getEffectivePrice } from "@/lib/data";
import type { Category, Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setIsLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/categories"),
    ]);
    setProducts(await productsRes.json());
    setCategories(await categoriesRes.json());
    setIsLoading(false);
  }

  async function handleSave(values: ProductFormValues) {
    if (editingId && editingId !== "new") {
      await fetch(`/api/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setEditingId(null);
    await loadProducts();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await loadProducts();
  }

  async function handleToggleActive(product: Product) {
    await fetch(`/api/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !product.isActive }),
    });
    await loadProducts();
  }

  async function handlePriceChange(id: string, rawValue: string, previousPrice: number) {
    const nextPrice = Number(rawValue);
    if (!Number.isFinite(nextPrice) || nextPrice < 0 || nextPrice === previousPrice) return;
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: nextPrice }),
    });
    await loadProducts();
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const response = await fetch("/api/products/import", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: buffer,
    });
    const result = await response.json();

    if (response.ok) {
      const skipped = result.errors?.length ?? 0;
      setImportMessage(
        `Imported ${result.updated} product(s).${skipped ? ` ${skipped} row(s) skipped — see console for details.` : ""}`
      );
      if (skipped) console.warn("Import row issues:", result.errors);
    } else {
      setImportMessage(result.error ?? "Import failed.");
    }

    event.target.value = "";
    await loadProducts();
  }

  const editingProduct =
    editingId && editingId !== "new" ? products.find((p) => p.id === editingId) : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Edit prices, discounts, photos, names, units, and active status. Changes go live on
            the site immediately.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/products/export"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            Export to Excel
          </a>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            Import from Excel
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleImportFile}
            className="hidden"
          />
          {editingId === null && (
            <button
              type="button"
              onClick={() => setEditingId("new")}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
            >
              + New Product
            </button>
          )}
        </div>
      </div>

      {importMessage && (
        <p className="mt-3 rounded-xl bg-brand-50 px-4 py-2.5 text-sm text-brand-dark">
          {importMessage}
        </p>
      )}

      {editingId !== null && (
        <div className="mt-6">
          <ProductForm
            categories={categories}
            initialValue={editingProduct}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {isLoading ? (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading products…
        </p>
      ) : (
        <>
          {/* Mobile: stacked cards (below md) */}
          <div className="mt-6 space-y-3 md:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
                  product.isActive ? "" : "opacity-60"
                }`}
              >
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {product.unit} · <span className="font-mono">{product.sku}</span>
                    </p>
                    <p className="text-xs capitalize text-slate-500">
                      {product.categories.map((c) => c.replace("-", " ")).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <label className="text-xs text-slate-500">Price (Rs.)</label>
                    <div className="mt-0.5">
                      <EditablePrice product={product} onSave={handlePriceChange} />
                    </div>
                    {(product.discountPercent ?? 0) > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        {formatPKR(getEffectivePrice(product))} after {product.discountPercent}% off
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={product.isActive}
                      onChange={() => handleToggleActive(product)}
                      label={`${product.isActive ? "Deactivate" : "Activate"} ${product.name}`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        product.isActive ? "text-brand-dark" : "text-slate-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingId(product.id)}
                    className="text-sm font-semibold text-brand-dark hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id)}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: data table (md and up) */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Discount</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className={product.isActive ? "" : "opacity-60"}>
                    <td className="flex items-center gap-3 px-4 py-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                        <Image
                          src={product.image}
                          alt={product.imageAlt}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.unit}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <EditablePrice product={product} onSave={handlePriceChange} />
                      {(product.discountPercent ?? 0) > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          {formatPKR(getEffectivePrice(product))} after {product.discountPercent}%
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(product.discountPercent ?? 0) > 0 ? `${product.discountPercent}%` : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{product.sku}</td>
                    <td className="px-4 py-3 capitalize text-slate-600">
                      {product.categories.map((c) => c.replace("-", " ")).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch
                          checked={product.isActive}
                          onChange={() => handleToggleActive(product)}
                          label={`${product.isActive ? "Deactivate" : "Activate"} ${product.name}`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            product.isActive ? "text-brand-dark" : "text-slate-400"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingId(product.id)}
                        className="text-sm font-semibold text-brand-dark hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="ml-3 text-sm font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function EditablePrice({
  product,
  onSave,
}: {
  product: Product;
  onSave: (id: string, rawValue: string, previousPrice: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onSave(product.id, event.target.value, product.price);
    setIsEditing(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.currentTarget.blur();
    if (event.key === "Escape") setIsEditing(false);
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min="0"
        step="0.01"
        defaultValue={product.price}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-24 rounded-lg border border-brand px-2 py-1 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-semibold text-slate-900">{formatPKR(product.price)}</span>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        aria-label={`Edit price for ${product.name}`}
        className="text-slate-400 transition hover:text-brand-dark"
      >
        <PencilIcon className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
