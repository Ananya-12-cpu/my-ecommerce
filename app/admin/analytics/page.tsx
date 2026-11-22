"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { Card, PageContainer, StatCard } from "@/components/ui";
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

const STATUS_BG: Record<OrderStatusBreakdown["status"], string> = {
  good: "bg-[#0ca30c]",
  warning: "bg-[#fab219]",
  critical: "bg-[#d03b3b]",
};

const KPI_ICONS: Record<string, string> = {
  "Total revenue": "$",
  Orders: "#",
  "Avg. order value": "Ø",
  "Conversion rate": "%",
};

function StatTile({ label, value, delta, deltaLabel, trend }: Kpi) {
  const up = delta >= 0;
  const chip =
    trend === "good"
      ? "bg-[#0ca30c]/10 text-[#006300] dark:text-[#0ca30c]"
      : "bg-[#d03b3b]/10 text-[#d03b3b] dark:text-[#e66767]";

  return (
    <StatCard
      label={label}
      value={value}
      icon={<span className="text-sm font-semibold">{KPI_ICONS[label] ?? "•"}</span>}
      footer={
        <p className="mt-3 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className={`rounded-full px-2 py-0.5 font-medium tabular-nums ${chip}`}>
            <span aria-hidden>{up ? "▲" : "▼"}</span> {Math.abs(delta)}%
          </span>
          {deltaLabel}
        </p>
      }
    />
  );
}

function RevenueChart() {
  const [active, setActive] = useState<number | null>(null);
  const max = 24000;
  const ticks = [0, 8000, 16000, 24000];
  const width = 640;
  const height = 240;
  const baseline = 200;
  const top = 20;
  const barWidth = 32;
  const gap = (width - 40 - barWidth * monthlyRevenue.length) / monthlyRevenue.length;
  const left = 40;
  const focus = active ?? monthlyRevenue.length - 1;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Monthly revenue">
      {ticks.map((tick) => {
        const y = baseline - (tick / max) * (baseline - top);
        return (
          <g key={tick}>
            <line
              x1={left}
              x2={width}
              y1={y}
              y2={y}
              strokeDasharray={tick === 0 ? undefined : "3 4"}
              className="stroke-zinc-200 dark:stroke-zinc-800"
            />
            <text x={0} y={y + 3} className="fill-zinc-400 text-[10px] dark:fill-zinc-500">
              ${tick / 1000}k
            </text>
          </g>
        );
      })}

      {monthlyRevenue.map((m, i) => {
        const x = left + gap / 2 + i * (barWidth + gap);
        const barHeight = (m.value / max) * (baseline - top);
        const y = baseline - barHeight;
        const isFocus = i === focus;

        return (
          <g
            key={m.month}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="cursor-pointer"
          >
            <rect x={x - gap / 2} y={top} width={barWidth + gap} height={baseline - top + 30} fill="transparent" />
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={5}
              className={`transition-opacity ${isFocus ? "fill-[#2a78d6] dark:fill-[#3987e5]" : "fill-[#2a78d6]/35 dark:fill-[#3987e5]/35"}`}
            />
            <rect
              x={x}
              y={baseline - 5}
              width={barWidth}
              height={5}
              className={isFocus ? "fill-[#2a78d6] dark:fill-[#3987e5]" : "fill-[#2a78d6]/35 dark:fill-[#3987e5]/35"}
            />
            {isFocus && (
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                className="fill-zinc-900 text-[11px] font-semibold dark:fill-zinc-100"
              >
                ${m.value.toLocaleString()}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={baseline + 18}
              textAnchor="middle"
              className={`text-[10px] ${isFocus ? "fill-zinc-900 font-medium dark:fill-zinc-100" : "fill-zinc-500 dark:fill-zinc-400"}`}
            >
              {m.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function CategoryDonut() {
  const size = 140;
  const r = 52;
  const c = 2 * Math.PI * r;
  const total = categorySales.reduce((s, x) => s + x.percent, 0);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
      <svg viewBox={`0 0 ${size} ${size}`} className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label="Sales by category">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={16} className="stroke-zinc-100 dark:stroke-zinc-900" />
        {categorySales.map((cat, i) => {
          const len = (cat.percent / total) * c;
          const offset = (categorySales.slice(0, i).reduce((s, x) => s + x.percent, 0) / total) * c;
          return (
            <circle
              key={cat.category}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={cat.color}
              strokeWidth={16}
              strokeDasharray={`${Math.max(len - 2, 0)} ${c - len + 2}`}
              strokeDashoffset={-offset}
            />
          );
        })}
      </svg>
      <ul className="w-full flex-1 space-y-2.5">
        {categorySales.map((cat) => (
          <li key={cat.category} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
              <span aria-hidden className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
              {cat.category}
            </span>
            <span className="font-medium tabular-nums">{cat.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function parseMoney(v: string) {
  return Number(v.replace(/[$,]/g, ""));
}

export default function AnalyticsPage() {
  const maxProductRevenue = Math.max(...topProducts.map((p) => parseMoney(p.revenue)));
  const totalOrders = orderStatusBreakdown.reduce((s, x) => s + x.count, 0);

  return (
    <AdminGuard>
      <PageContainer
        width="lg"
        title="Analytics"
        description="Store performance for the last 30 days. Data shown is illustrative."
      >
        <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <StatTile key={kpi.label} {...kpi} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Revenue" subtitle="Monthly revenue, last 8 months" className="lg:col-span-2">
            <RevenueChart />
          </Card>

          <Card title="Sales by category" subtitle="Share of total revenue">
            <CategoryDonut />
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card title="Top products" subtitle="Ranked by revenue" className="lg:col-span-2">
            <ol className="flex flex-col gap-4">
              {topProducts.map((p, i) => (
                <li key={p.title} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold tabular-nums text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="shrink-0 text-sm font-medium tabular-nums">{p.revenue}</p>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
                          style={{ width: `${(parseMoney(p.revenue) / maxProductRevenue) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 shrink-0 text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                        {p.unitsSold} units
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card title="Orders by status" subtitle={`${totalOrders.toLocaleString()} orders`}>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
              {orderStatusBreakdown.map((s) => (
                <div
                  key={s.label}
                  className={STATUS_BG[s.status]}
                  style={{ width: `${(s.count / totalOrders) * 100}%` }}
                  title={`${s.label}: ${s.count}`}
                />
              ))}
            </div>
            <ul className="mt-5 flex flex-col gap-3">
              {orderStatusBreakdown.map((s) => (
                <li key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-sm ${STATUS_BG[s.status]}`} />
                    {s.label}
                  </span>
                  <span className="flex items-baseline gap-2 tabular-nums">
                    <span className={`font-semibold ${STATUS_COLOR[s.status]}`}>{s.count}</span>
                    <span className="w-10 text-right text-xs text-zinc-500 dark:text-zinc-400">
                      {((s.count / totalOrders) * 100).toFixed(1)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </PageContainer>
    </AdminGuard>
  );
}
