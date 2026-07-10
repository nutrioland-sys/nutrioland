"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyStat } from "@/lib/admin-stats";

export default function SalesTrendChart({ data }: { data: DailyStat[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94A3B8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" width={48} />
          <Tooltip
            formatter={(value) => [`Rs. ${Number(value ?? 0).toLocaleString("en-PK")}`, "Revenue"]}
          />
          <Line type="monotone" dataKey="revenue" stroke="#1F7A3D" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
