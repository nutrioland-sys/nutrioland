"use client";

import { useState, type FormEvent } from "react";
import {
  calculateDeliveryFee,
  DELIVERY_TIME_SLOTS,
  formatPKR,
  getEffectivePrice,
} from "@/lib/data";
import type { OrderItem, OrderRecord, OrderStatus, Product } from "@/lib/types";

export interface OrderFormValues {
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent: number;
  deliveryFee: number;
  total: number;
  sector: string;
  addressLine: string;
  deliverySlot: string;
  status: OrderStatus;
}

const STATUSES: OrderStatus[] = ["Confirmed", "On Road", "Delivered", "Cancelled"];

export default function OrderForm({
  products,
  initialValue,
  onSave,
  onCancel,
}: {
  products: Product[];
  initialValue?: OrderRecord;
  onSave: (values: OrderFormValues) => void;
  onCancel: () => void;
}) {
  const [customerName, setCustomerName] = useState(initialValue?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(initialValue?.customerPhone ?? "");
  const [sector, setSector] = useState(initialValue?.sector ?? "");
  const [addressLine, setAddressLine] = useState(initialValue?.addressLine ?? "");
  const [deliverySlot, setDeliverySlot] = useState(initialValue?.deliverySlot ?? "");
  const [status, setStatus] = useState<OrderStatus>(initialValue?.status ?? "Confirmed");
  const [discountPercent, setDiscountPercent] = useState(
    String(initialValue?.discountPercent ?? 0)
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    initialValue?.items.forEach((item) => {
      initial[item.productId] = item.quantity;
    });
    return initial;
  });

  function setQuantity(productId: string, qty: number) {
    setQuantities((current) => {
      const next = { ...current };
      if (qty <= 0) {
        delete next[productId];
      } else {
        next[productId] = qty;
      }
      return next;
    });
  }

  const items: OrderItem[] = Object.entries(quantities)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return null;
      return {
        productId,
        name: product.name,
        unit: product.unit,
        price: getEffectivePrice(product),
        quantity,
      };
    })
    .filter((item): item is OrderItem => item !== null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const discount = Math.min(Math.max(Number(discountPercent) || 0, 0), 100);
  const total = Math.round(subtotal * (1 - discount / 100)) + deliveryFee;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) {
      window.alert("Add at least one product to the order.");
      return;
    }
    onSave({
      customerName,
      customerPhone,
      items,
      subtotal,
      discountPercent: discount,
      deliveryFee,
      total,
      sector,
      addressLine,
      deliverySlot,
      status,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800">Customer name</label>
          <input
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800">Phone</label>
          <input
            required
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800">Area</label>
          <input
            required
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            placeholder="e.g. F-10, Islamabad"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800">Delivery slot</label>
          <select
            required
            value={deliverySlot}
            onChange={(event) => setDeliverySlot(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">Select…</option>
            {DELIVERY_TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-800">Address</label>
        <input
          required
          value={addressLine}
          onChange={(event) => setAddressLine(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div>
        <span className="text-sm font-semibold text-slate-800">Items</span>
        <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{product.name}</p>
                <p className="text-xs text-slate-500">
                  {formatPKR(getEffectivePrice(product))} / {product.unit}
                </p>
              </div>
              <input
                type="number"
                min="0"
                value={quantities[product.id] ?? 0}
                onChange={(event) => setQuantity(product.id, Number(event.target.value) || 0)}
                className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-right text-sm focus:border-brand focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800">Order discount %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(event) => setDiscountPercent(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as OrderStatus)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span>{formatPKR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Discount ({discount}%)</span>
            <span>-{formatPKR(Math.round((subtotal * discount) / 100))}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? "Free" : formatPKR(deliveryFee)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-900">
          <span>Total</span>
          <span>{formatPKR(total)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
        >
          Save Order
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
