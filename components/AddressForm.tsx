"use client";

import dynamic from "next/dynamic";
import { useState, type FormEvent } from "react";
import type { GeoPin, SavedAddress } from "@/lib/types";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400">
      Loading map…
    </div>
  ),
});

export default function AddressForm({
  initialValue,
  onSave,
  onCancel,
}: {
  initialValue?: SavedAddress;
  onSave: (address: Omit<SavedAddress, "id">) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initialValue?.label ?? "Home");
  const [sector, setSector] = useState(initialValue?.sector ?? "");
  const [addressLine, setAddressLine] = useState(initialValue?.addressLine ?? "");
  const [pin, setPin] = useState<GeoPin | undefined>(initialValue?.pin);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ label, sector, addressLine, pin, isDefault: initialValue?.isDefault });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="address-label" className="text-sm font-semibold text-slate-800">
            Label
          </label>
          <select
            id="address-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="address-sector" className="text-sm font-semibold text-slate-800">
            Area
          </label>
          <input
            id="address-sector"
            required
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            placeholder="e.g. F-10, Islamabad"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address-line" className="text-sm font-semibold text-slate-800">
          House / street address
        </label>
        <input
          id="address-line"
          required
          value={addressLine}
          onChange={(event) => setAddressLine(event.target.value)}
          placeholder="House #, street, landmark"
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <span className="text-sm font-semibold text-slate-800">Pin your exact location</span>
        <p className="mt-0.5 text-xs text-slate-500">
          Optional — helps our rider find you faster.
        </p>
        <div className="mt-1.5">
          <LocationPicker value={pin} onChange={setPin} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save Address
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
