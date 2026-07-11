"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPKR } from "@/lib/data";
import { ArrowRightIcon, CartIcon } from "./icons";

// A persistent bottom bar rather than a fleeting "added to cart" toast —
// easy to miss a toast, but a bar that stays put until you either check out
// or empty the cart is much harder to overlook, especially for shoppers who
// aren't used to noticing a small cart icon in the header.
export default function CartBar() {
  const { items, itemCount, subtotal, isLoaded } = useCart();
  const pathname = usePathname();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (itemCount === 0) return;
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 500);
    return () => window.clearTimeout(timer);
  }, [itemCount]);

  const hideOnRoutes = pathname === "/cart" || pathname === "/checkout";

  if (!isLoaded || items.length === 0 || hideOnRoutes) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4">
      <Link
        href="/cart"
        className={`mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-2xl bg-brand px-4 py-3.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-transform sm:px-6 ${
          pulse ? "scale-[1.02]" : "scale-100"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
            <CartIcon className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
              {itemCount}
            </span>
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold leading-tight">
              {itemCount} item{itemCount === 1 ? "" : "s"} in cart
            </span>
            <span className="block text-xs text-white/80">{formatPKR(subtotal)}</span>
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-dark">
          View Cart
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}
