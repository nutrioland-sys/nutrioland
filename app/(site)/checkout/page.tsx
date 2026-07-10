"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckIcon, ClockIcon, MapPinIcon } from "@/components/icons";
import Container from "@/components/Container";
import { useAccount } from "@/lib/account-context";
import { useCart } from "@/lib/cart-context";
import {
  calculateDeliveryFee,
  DELIVERY_SECTORS,
  DELIVERY_TIME_SLOTS,
  formatPKR,
  getEffectivePrice,
} from "@/lib/data";
import type { OrderRecord } from "@/lib/types";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart, isLoaded: isCartLoaded } = useCart();
  const {
    profile,
    addresses,
    addAddress,
    recordOrder,
    isLoaded: isAccountLoaded,
  } = useAccount();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [notes, setNotes] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const isLoaded = isCartLoaded && isAccountLoaded;

  // Prefill from the saved profile/default address once account data has loaded.
  useEffect(() => {
    if (!isAccountLoaded) return;
    setName((current) => current || profile.name);
    setPhone((current) => current || profile.phone);
    const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
    if (defaultAddress) {
      setSector((current) => current || defaultAddress.sector);
      setAddress((current) => current || defaultAddress.addressLine);
      setSaveAddress(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountLoaded]);

  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  function handleSelectSavedAddress(sectorValue: string, addressLine: string) {
    setSector(sectorValue);
    setAddress(addressLine);
    setSaveAddress(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      // Order is created server-side (data/orders.json) so it's visible in
      // the admin panel, not just this browser's local storage.
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            unit: item.product.unit,
            price: getEffectivePrice(item.product),
            quantity: item.quantity,
          })),
          subtotal,
          discountPercent: 0,
          deliveryFee,
          total,
          sector,
          addressLine: address,
          deliverySlot,
          status: "Confirmed",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      const order: OrderRecord = await response.json();
      recordOrder(order);

      if (saveAddress) {
        addAddress({
          label: addresses.length === 0 ? "Home" : `Address ${addresses.length + 1}`,
          sector,
          addressLine: address,
        });
      }

      setOrderId(order.id);
      clearCart();
    } catch {
      window.alert("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoaded) {
    return null;
  }

  if (orderId) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="max-w-lg text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
            <CheckIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Order placed!
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Thanks{name ? `, ${name}` : ""} — your order{" "}
            <span className="font-semibold text-brand-dark">{orderId}</span> has been received.
            We&apos;ll call you shortly to confirm delivery to {sector || "your sector"}
            {deliverySlot ? ` during your ${deliverySlot} slot` : ""}.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            (Demo checkout — no payment was charged and no order was actually sent anywhere yet.)
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/shop"
              className="inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="inline-block rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
            >
              View Order History
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-16 sm:py-24">
        <Container className="max-w-lg text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Add a few fresh picks before checking out.
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

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
          >
            <div>
              <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                Full name
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-semibold text-slate-800">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="03xx xxxxxxx"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            {addresses.length > 0 && (
              <div>
                <span className="text-sm font-semibold text-slate-800">Deliver to</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {addresses.map((saved) => (
                    <button
                      key={saved.id}
                      type="button"
                      onClick={() => handleSelectSavedAddress(saved.sector, saved.addressLine)}
                      className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                        sector === saved.sector && address === saved.addressLine
                          ? "border-brand bg-brand-50 text-brand-dark"
                          : "border-slate-200 text-slate-600 hover:border-brand"
                      }`}
                    >
                      <span className="block font-semibold">{saved.label}</span>
                      <span className="block text-slate-500">{saved.sector}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="checkout-sector"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"
              >
                <MapPinIcon className="h-4 w-4 text-brand" />
                Delivery sector
              </label>
              <select
                id="checkout-sector"
                required
                value={sector}
                onChange={(event) => {
                  setSector(event.target.value);
                  setSaveAddress(true);
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="">Select your sector…</option>
                <optgroup label="Islamabad">
                  {DELIVERY_SECTORS.filter((s) => s.city === "Islamabad").map((s) => (
                    <option key={`${s.city}-${s.sector}`} value={`${s.sector}, Islamabad`}>
                      {s.sector}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Rawalpindi">
                  {DELIVERY_SECTORS.filter((s) => s.city === "Rawalpindi").map((s) => (
                    <option key={`${s.city}-${s.sector}`} value={`${s.sector}, Rawalpindi`}>
                      {s.sector}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-semibold text-slate-800">
                House / street address
              </label>
              <input
                id="address"
                required
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setSaveAddress(true);
                }}
                placeholder="House #, street, landmark"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(event) => setSaveAddress(event.target.checked)}
                className="h-4 w-4 rounded accent-brand"
              />
              Save this address for next time
            </label>

            <div>
              <label
                htmlFor="delivery-slot"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-800"
              >
                <ClockIcon className="h-4 w-4 text-brand" />
                Delivery time slot
              </label>
              <select
                id="delivery-slot"
                required
                value={deliverySlot}
                onChange={(event) => setDeliverySlot(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                <option value="">Select a time slot…</option>
                {DELIVERY_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="text-sm font-semibold text-slate-800">
                Order notes <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Delivery instructions, preferred time, etc."
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <div>
              <span className="text-sm font-semibold text-slate-800">Payment method</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-brand/30 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-dark">
                <input type="radio" checked readOnly className="h-4 w-4 accent-brand" />
                Cash on Delivery
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Online payment is coming soon — for now, pay in cash when your order arrives.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
            >
              {isSubmitting ? "Placing order…" : `Place Order — ${formatPKR(total)}`}
            </button>
          </form>

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Order summary ({itemCount} item{itemCount === 1 ? "" : "s"})
            </h2>
            {deliverySlot && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-dark">
                <ClockIcon className="h-3.5 w-3.5" />
                {deliverySlot}
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {items.map((item) => (
                <li key={item.product.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    {item.product.name} <span className="text-slate-400">× {item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium text-slate-800">
                    {formatPKR(getEffectivePrice(item.product) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPKR(total)}</span>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
