"use client";

import Image from "next/image";
import { formatPKR, getEffectivePrice } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";
import { CartIcon } from "./icons";

export default function FeaturedProductCard({ product }: { product: Product }) {
  const { items, addItem, updateQuantity } = useCart();
  const quantity = items.find((item) => item.product.id === product.id)?.quantity ?? 0;
  const hasDiscount = (product.discountPercent ?? 0) > 0;
  const effectivePrice = getEffectivePrice(product);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="relative aspect-square w-full overflow-hidden bg-brand-50">
        {/* Placeholder image (Unsplash) — replace with real product photography. */}
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 640px) 208px, 176px"
          className="object-cover"
        />
        {(product.badge || hasDiscount) && (
          <span className="absolute left-2 top-2 flex flex-col gap-1">
            {hasDiscount && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                -{product.discountPercent}%
              </span>
            )}
            {product.badge && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">Per {product.unit}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <span className="inline-block rounded-lg bg-accent px-2.5 py-1 text-sm font-bold text-white">
            {formatPKR(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">{formatPKR(product.price)}</span>
          )}
        </div>

        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => addItem(product, 1)}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-brand py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <CartIcon className="h-4 w-4" />
            Add
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-lg bg-brand px-2 py-1 text-white">
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-semibold leading-none transition hover:bg-brand-dark"
            >
              −
            </button>
            <span className="text-sm font-bold" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${product.name}`}
              onClick={() => addItem(product, 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-lg font-semibold leading-none transition hover:bg-brand-dark"
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
