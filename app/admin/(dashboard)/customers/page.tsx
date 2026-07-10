"use client";

import { useEffect, useState } from "react";
import { formatPKR } from "@/lib/data";
import type { CustomerSummary } from "@/lib/customers";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setIsLoading(true);
    const response = await fetch("/api/customers");
    setCustomers(await response.json());
    setIsLoading(false);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Customers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every customer is built from their order history — name, phone, addresses used, and
            total spend.
          </p>
        </div>
        <a
          href="/api/customers/export"
          className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand hover:text-brand"
        >
          Export to Excel
        </a>
      </div>

      {isLoading ? (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading customers…
        </p>
      ) : customers.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          No customers yet. Customers will show up here once orders start coming in.
        </p>
      ) : (
        <>
          {/* Mobile: stacked cards (below md) */}
          <div className="mt-6 space-y-3 md:hidden">
            {customers.map((customer) => (
              <div
                key={customer.phone}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{customer.name || "—"}</p>
                    <p className="text-xs text-slate-500">{customer.phone}</p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {formatPKR(customer.totalSpent)}
                  </p>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  {customer.totalOrders} order{customer.totalOrders === 1 ? "" : "s"} · Last
                  order {formatDate(customer.lastOrderAt)}
                </div>

                <div className="mt-2 space-y-0.5">
                  {customer.addresses.map((address) => (
                    <p key={address} className="text-xs text-slate-500">
                      {address}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: data table (md and up) */}
          <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3">Last Order</th>
                  <th className="px-4 py-3">Addresses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((customer) => (
                  <tr key={customer.phone}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{customer.name || "—"}</p>
                      <p className="text-xs text-slate-500">{customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{customer.totalOrders}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {formatPKR(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(customer.lastOrderAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {customer.addresses.map((address) => (
                        <p key={address}>{address}</p>
                      ))}
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
