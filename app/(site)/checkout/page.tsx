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

type AuthStep = "choose" | "signin" | "signup" | "guest";

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clearCart, isLoaded: isCartLoaded } = useCart();
  const { customer, isLoggedIn, isLoaded: isAccountLoaded, login, signup, addAddress } =
    useAccount();

  const [authStep, setAuthStep] = useState<AuthStep>("choose");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [placedAsGuest, setPlacedAsGuest] = useState(false);

  const isLoaded = isCartLoaded && isAccountLoaded;

  // Prefill from the logged-in customer's profile / default address.
  useEffect(() => {
    if (!isLoggedIn || !customer) return;
    setName(customer.name);
    setPhone(customer.phone);
    const defaultAddress = customer.addresses.find((a) => a.isDefault) ?? customer.addresses[0];
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setSector(defaultAddress.sector);
      setAddress(defaultAddress.addressLine);
    }
  }, [isLoggedIn, customer]);

  const deliveryFee = calculateDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  function handleSelectSavedAddress(id: string, sectorValue: string, addressLine: string) {
    setSelectedAddressId(id);
    setSector(sectorValue);
    setAddress(addressLine);
  }

  function handleUseNewAddress() {
    setSelectedAddressId(null);
    setSector("");
    setAddress("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
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

      if (isLoggedIn && selectedAddressId === null && sector && address) {
        await addAddress({
          label: (customer?.addresses.length ?? 0) === 0 ? "Home" : "New address",
          sector,
          addressLine: address,
        });
      }

      setPlacedAsGuest(!isLoggedIn);
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

          {placedAsGuest && (
            <SaveGuestInfoPrompt
              name={name}
              phone={phone}
              sector={sector}
              address={address}
              onSaved={() => setPlacedAsGuest(false)}
            />
          )}

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

  const showGuestOrManualForm = isLoggedIn || authStep === "guest";

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            {!isLoggedIn && authStep === "choose" && (
              <AuthChoiceCard
                onChoose={setAuthStep}
                onSignedIn={() => setAuthStep("choose")}
              />
            )}

            {!isLoggedIn && authStep === "signin" && (
              <SignInCard
                onBack={() => setAuthStep("choose")}
                onSubmit={login}
                onSuccess={() => setAuthStep("choose")}
              />
            )}

            {!isLoggedIn && authStep === "signup" && (
              <SignUpCard
                onBack={() => setAuthStep("choose")}
                onSubmit={signup}
                onSuccess={() => setAuthStep("choose")}
              />
            )}

            {showGuestOrManualForm && (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
              >
                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={() => setAuthStep("choose")}
                    className="text-xs font-semibold text-brand-dark hover:underline"
                  >
                    &larr; Back
                  </button>
                )}

                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-slate-800">
                    Full name
                  </label>
                  <input
                    id="name"
                    required
                    readOnly={isLoggedIn}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className={`mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                      isLoggedIn ? "bg-slate-50 text-slate-500" : ""
                    }`}
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
                    readOnly={isLoggedIn}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="03xx xxxxxxx"
                    className={`mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                      isLoggedIn ? "bg-slate-50 text-slate-500" : ""
                    }`}
                  />
                </div>

                {isLoggedIn && customer && customer.addresses.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-slate-800">Deliver to</span>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {customer.addresses.map((saved) => (
                        <button
                          key={saved.id}
                          type="button"
                          onClick={() =>
                            handleSelectSavedAddress(saved.id, saved.sector, saved.addressLine)
                          }
                          className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                            selectedAddressId === saved.id
                              ? "border-brand bg-brand-50 text-brand-dark"
                              : "border-slate-200 text-slate-600 hover:border-brand"
                          }`}
                        >
                          <span className="block font-semibold">{saved.label}</span>
                          <span className="block text-slate-500">{saved.sector}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleUseNewAddress}
                        className={`rounded-xl border border-dashed px-3 py-2 text-left text-xs transition ${
                          selectedAddressId === null
                            ? "border-brand bg-brand-50 text-brand-dark"
                            : "border-slate-300 text-slate-600 hover:border-brand"
                        }`}
                      >
                        <span className="block font-semibold">+ New address</span>
                      </button>
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
                    disabled={isLoggedIn && selectedAddressId !== null}
                    value={sector}
                    onChange={(event) => setSector(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:bg-slate-50 disabled:text-slate-500"
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
                    readOnly={isLoggedIn && selectedAddressId !== null}
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="House #, street, landmark"
                    className={`mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 ${
                      isLoggedIn && selectedAddressId !== null ? "bg-slate-50 text-slate-500" : ""
                    }`}
                  />
                </div>

                {isLoggedIn && selectedAddressId === null && (
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={saveNewAddress}
                      onChange={(event) => setSaveNewAddress(event.target.checked)}
                      className="h-4 w-4 rounded accent-brand"
                    />
                    Save this address to my account
                  </label>
                )}

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
            )}
          </div>

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

function AuthChoiceCard({
  onChoose,
}: {
  onChoose: (step: AuthStep) => void;
  onSignedIn: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6">
      <h2 className="text-base font-semibold text-slate-900">How would you like to check out?</h2>
      <p className="mt-1 text-sm text-slate-600">
        Sign in for one-tap checkout with your saved addresses, or continue as a guest.
      </p>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onChoose("signin")}
          className="rounded-xl border border-brand bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-100"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => onChoose("signup")}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={() => onChoose("guest")}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}

function SignInCard({
  onBack,
  onSubmit,
  onSuccess,
}: {
  onBack: () => void;
  onSubmit: (phone: string, password: string) => Promise<{ error?: string }>;
  onSuccess: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await onSubmit(phone, password);
    setIsSubmitting(false);
    if (result.error) setError(result.error);
    else onSuccess();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-brand-dark hover:underline"
      >
        &larr; Back
      </button>
      <h2 className="text-base font-semibold text-slate-900">Sign in</h2>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div>
        <label htmlFor="signin-phone" className="text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input
          id="signin-phone"
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="03xx xxxxxxx"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="signin-password" className="text-sm font-semibold text-slate-800">
          Password
        </label>
        <input
          id="signin-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <p className="text-xs text-slate-500">
        Forgot your password? Reset it from the{" "}
        <Link href="/account" className="font-semibold text-brand-dark hover:underline">
          My Account
        </Link>{" "}
        page.
      </p>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

function SignUpCard({
  onBack,
  onSubmit,
  onSuccess,
}: {
  onBack: () => void;
  onSubmit: (input: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    address?: { label: string; sector: string; addressLine: string };
  }) => Promise<{ error?: string }>;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sector, setSector] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await onSubmit({
      name,
      phone,
      email: email || undefined,
      password,
      address: sector && address ? { label: "Home", sector, addressLine: address } : undefined,
    });
    setIsSubmitting(false);
    if (result.error) setError(result.error);
    else onSuccess();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="text-xs font-semibold text-brand-dark hover:underline"
      >
        &larr; Back
      </button>
      <h2 className="text-base font-semibold text-slate-900">Create an account</h2>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="signup-name" className="text-sm font-semibold text-slate-800">
            Full name
          </label>
          <input
            id="signup-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label htmlFor="signup-phone" className="text-sm font-semibold text-slate-800">
            Phone number
          </label>
          <input
            id="signup-phone"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="03xx xxxxxxx"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="text-sm font-semibold text-slate-800">
          Email <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="text-sm font-semibold text-slate-800">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 6 characters"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <label htmlFor="signup-sector" className="text-sm font-semibold text-slate-800">
          Delivery sector <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <select
          id="signup-sector"
          value={sector}
          onChange={(event) => setSector(event.target.value)}
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
        <label htmlFor="signup-address" className="text-sm font-semibold text-slate-800">
          House / street address <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="signup-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="House #, street, landmark"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create Account & Continue"}
      </button>
    </form>
  );
}

function SaveGuestInfoPrompt({
  name,
  phone,
  sector,
  address,
  onSaved,
}: {
  name: string;
  phone: string;
  sector: string;
  address: string;
  onSaved: () => void;
}) {
  const { signup } = useAccount();
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await signup({
      name,
      phone,
      password,
      address: sector && address ? { label: "Home", sector, addressLine: address } : undefined,
    });
    setIsSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      onSaved();
    }
  }

  if (saved) {
    return (
      <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-50 p-4 text-sm font-medium text-brand-dark">
        Account created! Sign in next time to check out even faster.
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <p className="text-sm text-slate-700">Want faster checkout next time?</p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save my info for next time
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-card"
    >
      <p className="text-sm text-slate-700">
        Set a password to save your details — we&apos;ll use the name, phone, and address from
        this order.
      </p>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div>
        <label htmlFor="guest-save-password" className="text-sm font-semibold text-slate-800">
          Choose a password
        </label>
        <input
          id="guest-save-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 6 characters"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save My Info"}
      </button>
    </form>
  );
}
