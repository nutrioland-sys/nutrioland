"use client";

import Link from "next/link";
import CartItemRow from "@/components/CartItemRow";
import Container from "@/components/Container";
import { CartIcon } from "@/components/icons";
import { useCart } from "@/lib/cart-context";
import { calculateDeliveryFee, formatPKR, FREE_DELIVERY_THRESHOLD } from "@/lib/data";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, isLoaded } = useCart();

  if (!isLoaded) {
    return null;
  }

  if (items.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
            <CartIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Browse the shop and add some fresh picks to get started.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
          >
            Browse Shop
          </Link>
        </Container>
      </section>
    );
  }

  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Your Cart{" "}
          <span className="text-base font-medium text-slate-500">
            ({itemCount} item{itemCount === 1 ? "" : "s"})
          </span>
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}</span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-slate-400">
                  Free delivery on orders over {formatPKR(FREE_DELIVERY_THRESHOLD)}.
                </p>
              )}
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 block rounded-full bg-brand py-3 text-center text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/shop"
              className="mt-2 block rounded-full border border-slate-200 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}
