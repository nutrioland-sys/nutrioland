"use client";

import Image from "next/image";
import { formatPKR, getEffectivePrice } from "@/lib/data";
import type { CartItem } from "@/lib/cart-context";
import { TrashIcon } from "./icons";

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  const { product, quantity } = item;
  const unitPrice = getEffectivePrice(product);

  return (
    <li className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-brand-50">
        <Image src={product.image} alt={product.imageAlt} fill sizes="80px" className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">{product.name}</p>
            <p className="text-xs text-slate-500">
              {formatPKR(unitPrice)} / {product.unit}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${product.name} from cart`}
            onClick={() => onRemove(product.id)}
            className="text-slate-400 transition hover:text-accent-dark"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-slate-200">
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.name}`}
              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
              className="flex h-8 w-8 items-center justify-center text-lg font-semibold text-slate-600 hover:text-brand"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-semibold text-slate-800">{quantity}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${product.name}`}
              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-lg font-semibold text-slate-600 hover:text-brand"
            >
              +
            </button>
          </div>
          <p className="text-sm font-bold text-brand-dark">
            {formatPKR(unitPrice * quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
