"use client";

import AdminGuard from "@/components/AdminGuard";
import {
  kpis,
  monthlyRevenue,
  categorySales,
  topProducts,
  orderStatusBreakdown,
  type Kpi,
  type OrderStatusBreakdown,
} from "@/lib/admin-data";

const STATUS_COLOR: Record<OrderStatusBreakdown["status"], string> = {
  good: "text-[#006300] dark:text-[#0ca30c]",
  warning: "text-[#a06400] dark:text-[#fab219]",
  critical: "text-[#d03b3b] dark:text-[#e66767]",
};

const STATUS_DOT: Record<OrderStatusBreakdown["status"], string> = {
  good: "bg-[#0ca30c]",
  warning: "bg-[#fab219]",
  critical: "bg-[#d03b3b]",
};

function StatTile({ label, value, delta, deltaLabel, trend }: Kpi) {
  const up = delta >= 0;
  const deltaColor =
    trend === "good"
      ? "text-[#006300] dark:text-[#0ca30c]"
      : "text-[#d03b3b] dark:text-[#e66767]";

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
        <span aria-hidden>{up ? "▲" : "▼"}</span>
        {Math.abs(delta)}% {deltaLabel}
      </p>
    </div>
  );
}

function RevenueChart() {
  const max = 24000;
  const ticks = [0, 8000, 16000, 24000];
  const width = 640;
  const height = 220;
  const baseline = 180;
  const top = 20;
  const barWidth = 28;
  const gap = (width - barWidth * monthlyRevenue.length) / (monthlyRevenue.length + 1);
  const peakIndex = monthlyRevenue.length - 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Monthly revenue">
      {ticks.map((tick) => {
        const y = baseline - (tick / max) * (baseline - top);
        return (
          <g key={tick}>
            <line
              x1={0}
              x2={width}
              y1={y}
              y2={y}
              className="stroke-zinc-200 dark:stroke-zinc-800"
              strokeWidth={1}
            />
            <text x={0} y={y - 4} className="fill-zinc-400 text-[10px] dark:fill-zinc-500">
              ${tick / 1000}k
            </text>
          </g>
        );
      })}

      {monthlyRevenue.map((m, i) => {
        const x = gap + i * (barWidth + gap);
        const barHeight = (m.value / max) * (baseline - top);
        const y = baseline - barHeight;

        return (
          <g key={m.month}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              className="fill-[#2a78d6] dark:fill-[#3987e5]"
            />
            <rect
              x={x}
              y={baseline - 4}
              width={barWidth}
              height={4}
              className="fill-[#2a78d6] dark:fill-[#3987e5]"
            />
            {i === peakIndex && (
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className="fill-zinc-900 text-[11px] font-medium dark:fill-zinc-100"
              >
                ${m.value.toLocaleString()}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={baseline + 16}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
            >
              {m.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CategoryBars() {
  return (
    <div className="flex flex-col gap-3">
      {categorySales.map((c) => (
        <div key={c.category} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-sm text-zinc-600 dark:text-zinc-300">
            {c.category}
          </span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full"
              style={{ width: `${c.percent}%`, backgroundColor: c.color }}
            />
          </div>
          <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums">
            {c.percent}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Store performance for the last 30 days. Data shown is illustrative.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpis.map((kpi) => (
            <StatTile key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-4 lg:col-span-2 dark:border-zinc-800">
            <h2 className="text-sm font-medium">Revenue by month</h2>
            <div className="mt-4">
              <RevenueChart />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="text-sm font-medium">Sales by category</h2>
            <div className="mt-4">
              <CategoryBars />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 p-4 lg:col-span-2 dark:border-zinc-800">
            <h2 className="text-sm font-medium">Top products</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium tabular-nums">Units sold</th>
                  <th className="pb-2 text-right font-medium tabular-nums">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.title} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                    <td className="py-2">{p.title}</td>
                    <td className="py-2 tabular-nums">{p.unitsSold}</td>
                    <td className="py-2 text-right tabular-nums">{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="text-sm font-medium">Orders by status</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {orderStatusBreakdown.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span aria-hidden className={`h-2 w-2 rounded-full ${STATUS_DOT[s.status]}`} />
                    {s.label}
                  </span>
                  <span className={`font-medium tabular-nums ${STATUS_COLOR[s.status]}`}>
                    {s.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
