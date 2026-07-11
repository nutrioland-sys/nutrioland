"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import Container from "@/components/Container";
import {
  CheckIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from "@/components/icons";
import { useAccount } from "@/lib/account-context";
import { formatPKR } from "@/lib/data";
import type { SavedAddress } from "@/lib/types";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "addresses", label: "Addresses" },
  { id: "orders", label: "Order History" },
  { id: "offers", label: "Offers" },
  { id: "security", label: "Security" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const { isLoaded, isLoggedIn } = useAccount();

  if (!isLoaded) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <section className="py-10 sm:py-14">
        <Container>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">My Account</h1>
          <SignedOutPanel />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">My Account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Save your details once and check out faster next time.
        </p>

        <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "addresses" && <AddressesTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "offers" && <OffersTab />}
          {activeTab === "security" && <SecurityTab />}
        </div>
      </Container>
    </section>
  );
}

function SignedOutPanel() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");

  return (
    <div className="mt-8 max-w-lg">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            mode === "signin"
              ? "border-brand bg-brand text-white"
              : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            mode === "signup"
              ? "border-brand bg-brand text-white"
              : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="mt-4">
        {mode === "signin" && <SignInForm onForgotPassword={() => setMode("forgot")} />}
        {mode === "signup" && <SignUpForm />}
        {mode === "forgot" && <ForgotPasswordForm onBack={() => setMode("signin")} />}
      </div>
    </div>
  );
}

function SignInForm({ onForgotPassword }: { onForgotPassword: () => void }) {
  const { login } = useAccount();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await login(phone, password);
    setIsSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
    >
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div>
        <label htmlFor="account-signin-phone" className="text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input
          id="account-signin-phone"
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="03xx xxxxxxx"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="account-signin-password" className="text-sm font-semibold text-slate-800">
          Password
        </label>
        <input
          id="account-signin-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <button
        type="button"
        onClick={onForgotPassword}
        className="text-xs font-semibold text-brand-dark hover:underline"
      >
        Forgot your password?
      </button>
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

function SignUpForm() {
  const { signup } = useAccount();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await signup({ name, phone, email: email || undefined, password });
    setIsSubmitting(false);
    if (result.error) setError(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
    >
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div>
        <label htmlFor="account-signup-name" className="text-sm font-semibold text-slate-800">
          Full name
        </label>
        <input
          id="account-signup-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="account-signup-phone" className="text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input
          id="account-signup-phone"
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="03xx xxxxxxx"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="account-signup-email" className="text-sm font-semibold text-slate-800">
          Email <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="account-signup-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="account-signup-password" className="text-sm font-semibold text-slate-800">
          Password
        </label>
        <input
          id="account-signup-password"
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
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, newPassword }),
    });
    setIsSubmitting(false);
    if (response.ok) {
      setSuccess(true);
    } else {
      const body = await response.json();
      setError(body.error ?? "Something went wrong.");
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-brand-50 p-5 text-sm font-medium text-brand-dark">
        Password updated. You can now sign in with your new password.
        <button
          type="button"
          onClick={onBack}
          className="mt-3 block text-sm font-semibold text-brand-dark hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
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
        &larr; Back to sign in
      </button>
      <p className="text-sm text-slate-600">
        Enter the phone number and exact name on your account to set a new password.
      </p>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div>
        <label htmlFor="reset-phone" className="text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input
          id="reset-phone"
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="reset-name" className="text-sm font-semibold text-slate-800">
          Full name on account
        </label>
        <input
          id="reset-name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div>
        <label htmlFor="reset-new-password" className="text-sm font-semibold text-slate-800">
          New password
        </label>
        <input
          id="reset-new-password"
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          placeholder="At least 6 characters"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
      >
        {isSubmitting ? "Updating…" : "Set New Password"}
      </button>
    </form>
  );
}

function ProfileTab() {
  const { customer, updateProfile } = useAccount();
  const [name, setName] = useState(customer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [savedMessage, setSavedMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const result = await updateProfile({ name, email });
    if (result.error) {
      setError(result.error);
      return;
    }
    setSavedMessage(true);
    window.setTimeout(() => setSavedMessage(false), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
    >
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}

      <div>
        <label htmlFor="profile-name" className="text-sm font-semibold text-slate-800">
          Full name
        </label>
        <input
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <label htmlFor="profile-phone" className="text-sm font-semibold text-slate-800">
          Phone number
        </label>
        <input
          id="profile-phone"
          type="tel"
          value={customer?.phone ?? ""}
          readOnly
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Your phone number is your sign-in ID and can&apos;t be changed here.
        </p>
      </div>

      <div>
        <label htmlFor="profile-email" className="text-sm font-semibold text-slate-800">
          Email <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save Profile
        </button>
        {savedMessage && (
          <span className="flex items-center gap-1 text-sm font-medium text-brand-dark">
            <CheckIcon className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}

function AddressesTab() {
  const { customer, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAccount();
  const addresses = customer?.addresses ?? [];
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  const editingAddress =
    editingId && editingId !== "new" ? addresses.find((a) => a.id === editingId) : undefined;

  async function handleSave(address: Omit<SavedAddress, "id">) {
    if (editingId && editingId !== "new") {
      await updateAddress(editingId, address);
    } else {
      await addAddress(address);
    }
    setEditingId(null);
  }

  return (
    <div className="max-w-lg space-y-4">
      {addresses.length === 0 && editingId === null && (
        <p className="text-sm text-slate-500">
          No saved addresses yet. Add one so checkout can be one tap next time.
        </p>
      )}

      {addresses.map((address) =>
        editingId === address.id ? (
          <AddressForm
            key={address.id}
            initialValue={address}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={address.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {address.label}
                  {address.isDefault && (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-dark">
                      Default
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-slate-600">{address.addressLine}</p>
                <p className="text-sm text-slate-500">{address.sector}</p>
                {address.pin && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-brand-dark">
                    <MapPinIcon className="h-3.5 w-3.5" /> Location pinned
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  type="button"
                  aria-label={`Edit ${address.label} address`}
                  onClick={() => setEditingId(address.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-brand-50 hover:text-brand"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${address.label} address`}
                  onClick={() => removeAddress(address.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-red-50 hover:text-accent-dark"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            {!address.isDefault && (
              <button
                type="button"
                onClick={() => setDefaultAddress(address.id)}
                className="mt-3 text-xs font-semibold text-brand-dark hover:underline"
              >
                Set as default
              </button>
            )}
          </div>
        )
      )}

      {editingId === "new" ? (
        <AddressForm initialValue={editingAddress} onSave={handleSave} onCancel={() => setEditingId(null)} />
      ) : (
        <button
          type="button"
          onClick={() => setEditingId("new")}
          className="flex w-full items-center justify-center gap-1.5 rounded-full border border-dashed border-brand/40 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-50"
        >
          <PlusIcon className="h-4 w-4" />
          Add New Address
        </button>
      )}
    </div>
  );
}

function OrdersTab() {
  const { orders } = useAccount();

  if (orders.length === 0) {
    return (
      <div className="max-w-lg rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card">
        <p className="text-sm text-slate-600">
          No orders yet. Once you check out, your order history will show up here.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{order.id}</p>
              <p className="text-xs text-slate-500">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                · {order.sector}
                {order.deliverySlot ? ` · ${order.deliverySlot}` : ""}
              </p>
            </div>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-dark">
              {order.status}
            </span>
          </div>
          <ul className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm text-slate-600">
            {order.items.map((item) => (
              <li key={item.name} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPKR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm font-bold text-slate-900">
            <span>Total</span>
            <span>{formatPKR(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function OffersTab() {
  const { orders } = useAccount();
  const isReturningCustomer = orders.length > 0;

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-xs text-slate-500">
        Demo offers below — personalized deals would be generated by the backend once
        Nutrioland has one. For now these are illustrative only and aren&apos;t applied
        automatically at checkout.
      </p>

      {!isReturningCustomer && (
        <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand-50 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-brand-dark">20% off your first order</p>
            <p className="mt-1 text-sm text-slate-600">
              Use code <span className="font-semibold">FRESH20</span> at checkout.
            </p>
          </div>
        </div>
      )}

      {isReturningCustomer && (
        <div className="flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent-50 p-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-accent-dark">
              Thanks for being a repeat customer!
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Enjoy Rs. 100 off your next order with code <span className="font-semibold">WELCOME100</span>.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
          <SparklesIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-slate-900">Weekly basket, always fresh</p>
          <p className="mt-1 text-sm text-slate-600">
            Subscribe to the Weekly Mixed Basket and never run out of essentials.
          </p>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  const { logout } = useAccount();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setIsSubmitting(false);
    if (response.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setSavedMessage(true);
      window.setTimeout(() => setSavedMessage(false), 2000);
    } else {
      const body = await response.json();
      setError(body.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
      >
        <h2 className="text-base font-semibold text-slate-900">Change password</h2>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <div>
          <label htmlFor="current-password" className="text-sm font-semibold text-slate-800">
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="text-sm font-semibold text-slate-800">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={6}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="At least 6 characters"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark disabled:opacity-60"
          >
            {isSubmitting ? "Updating…" : "Update Password"}
          </button>
          {savedMessage && (
            <span className="flex items-center gap-1 text-sm font-medium text-brand-dark">
              <CheckIcon className="h-4 w-4" /> Updated
            </span>
          )}
        </div>
      </form>

      <button
        type="button"
        onClick={() => logout()}
        className="rounded-full border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:text-red-600"
      >
        Log Out
      </button>
    </div>
  );
}
