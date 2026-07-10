import Link from "next/link";
import SalesTrendChart from "@/components/admin/SalesTrendChart";
import { buildDailyStats, getTodayStats } from "@/lib/admin-stats";
import { formatPKR } from "@/lib/data";
import { getOrders } from "@/lib/server/orders-store";

// Reads data/orders.json fresh on every request — this dashboard must never
// be served from Next's static cache or new orders wouldn't show up.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const orders = await getOrders();
  const dailyStats = buildDailyStats(orders, 14);
  const today = getTodayStats(orders);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Today&apos;s activity and the last 14 days.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Today's Revenue" value={formatPKR(today.revenue)} />
        <StatCard label="Today's Orders" value={String(today.orders)} />
        <StatCard label="Today's Items Sold" value={String(today.items)} />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">Daily Sales Trend (14 days)</h2>
        <div className="mt-4">
          <SalesTrendChart data={dailyStats} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-brand-dark hover:underline"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No orders yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{order.id}</p>
                  <p className="text-slate-500">
                    {order.customerName || "—"} · {order.sector}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatPKR(order.total)}</p>
                  <p className="text-xs text-slate-500">{order.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
