"use client";

import { useState, type FormEvent } from "react";
import { DELIVERY_SECTORS } from "@/lib/data";
import { CheckIcon, MapPinIcon } from "./icons";

export default function DeliveryChecker() {
  const [sector, setSector] = useState("");
  const [result, setResult] = useState<"idle" | "available">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Placeholder check only — every sector in the list currently returns
    // "available". Wire this up to real delivery-zone data once available.
    setResult(sector ? "available" : "idle");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl bg-white p-4 shadow-card sm:p-5"
    >
      <label htmlFor="sector" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        <MapPinIcon className="h-4 w-4 text-brand" />
        Do we deliver to you?
      </label>
      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
        <select
          id="sector"
          name="sector"
          value={sector}
          onChange={(event) => {
            setSector(event.target.value);
            setResult("idle");
          }}
          className="w-full flex-1 rounded-full border border-slate-200 bg-cream px-4 py-2.5 text-sm text-slate-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          <option value="">Select your sector…</option>
          <optgroup label="Islamabad">
            {DELIVERY_SECTORS.filter((s) => s.city === "Islamabad").map((s) => (
              <option key={`${s.city}-${s.sector}`} value={s.sector}>
                {s.sector}
              </option>
            ))}
          </optgroup>
          <optgroup label="Rawalpindi">
            {DELIVERY_SECTORS.filter((s) => s.city === "Rawalpindi").map((s) => (
              <option key={`${s.city}-${s.sector}`} value={s.sector}>
                {s.sector}
              </option>
            ))}
          </optgroup>
        </select>
        <button
          type="submit"
          className="whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Check
        </button>
      </div>

      {result === "available" && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-brand-dark">
          <CheckIcon className="h-4 w-4" />
          Yes! We deliver to {sector} — order away.
        </p>
      )}
    </form>
  );
}
