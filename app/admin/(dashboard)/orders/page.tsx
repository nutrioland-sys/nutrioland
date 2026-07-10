"use client";

import { useEffect, useState } from "react";
import OrderForm, { type OrderFormValues } from "@/components/admin/OrderForm";
import { formatPKR } from "@/lib/data";
import type { OrderRecord, OrderStatus, Product } from "@/lib/types";

const STATUSES: OrderStatus[] = ["Confirmed", "On Road", "Delivered", "Cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    const [ordersRes, productsRes] = await Promise.all([
      fetch("/api/orders"),
      fetch("/api/products"),
    ]);
    setOrders(await ordersRes.json());
    setProducts(await productsRes.json());
    setIsLoading(false);
  }

  async function handleSave(values: OrderFormValues) {
    if (editingId && editingId !== "new") {
      await fetch(`/api/orders/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
    setEditingId(null);
    await loadData();
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadData();
  }

  const editingOrder =
    editingId && editingId !== "new" ? orders.find((o) => o.id === editingId) : undefined;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            View, create, and modify orders — quantities, discounts, and status.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/orders/export"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            Export to Excel
          </a>
          {editingId === null && (
            <button
              type="button"
              onClick={() => setEditingId("new")}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brand-dark"
            >
              + New Order
            </button>
          )}
        </div>
      </div>

      {editingId !== null && (
        <div className="mt-6">
          <OrderForm
            products={products}
            initialValue={editingOrder}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {isLoading ? (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading orders…
        </p>
      ) : orders.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No orders yet.
        </p>
      ) : (
        <>
          {/* Mobile: stacked cards (below md) */}
          <div className="mt-6 space-y-3 md:hidden">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{order.id}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">{formatPKR(order.total)}</p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-slate-800">{order.customerName || "—"}</p>
                  <p className="text-xs text-slate-500">{order.sector}</p>
                  <p className="text-xs text-slate-500">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleStatusChange(order.id, event.target.value as OrderStatus)
                    }
                    className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:border-brand focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setEditingId(order.id)}
                    className="text-sm font-semibold text-brand-dark hover:underline"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: data table (md and up) */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{order.id}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-800">{order.customerName || "—"}</p>
                      <p className="text-xs text-slate-500">{order.sector}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {formatPKR(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          handleStatusChange(order.id, event.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:border-brand focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setEditingId(order.id)}
                        className="text-sm font-semibold text-brand-dark hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
