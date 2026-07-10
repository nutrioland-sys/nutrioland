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
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const { isLoaded } = useAccount();

  if (!isLoaded) {
    return null;
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
        </div>
      </Container>
    </section>
  );
}

function ProfileTab() {
  const { profile, updateProfile } = useAccount();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [savedMessage, setSavedMessage] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile({ name, phone, email });
    setSavedMessage(true);
    window.setTimeout(() => setSavedMessage(false), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card sm:p-6"
    >
      <p className="text-sm text-slate-600">
        Saved here on this device so your details are ready next time you order — no account
        or password needed.
      </p>

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
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="03xx xxxxxxx"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
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
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAccount();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  const editingAddress =
    editingId && editingId !== "new" ? addresses.find((a) => a.id === editingId) : undefined;

  function handleSave(address: Omit<SavedAddress, "id">) {
    if (editingId && editingId !== "new") {
      updateAddress(editingId, address);
    } else {
      addAddress(address);
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
        <AddressForm onSave={handleSave} onCancel={() => setEditingId(null)} />
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
