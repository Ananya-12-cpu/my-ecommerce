"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { Badge, Button, PageContainer, StatGrid } from "@/components/ui";
import { reports, type Report } from "@/lib/admin-data";

const STATUS_STYLE: Record<Report["status"], string> = {
  Ready: "bg-[#0ca30c]/10 text-[#006300] dark:text-[#0ca30c]",
  Scheduled: "bg-[#fab219]/15 text-[#a06400] dark:text-[#fab219]",
};

const FORMAT_STYLE: Record<Report["format"], string> = {
  PDF: "bg-[#d03b3b]/10 text-[#d03b3b] dark:text-[#e66767]",
  CSV: "bg-[#2a78d6]/10 text-[#2a78d6] dark:text-[#3987e5]",
};

const FILTERS = ["All", "Ready", "Scheduled"] as const;
type Filter = (typeof FILTERS)[number];

function ReportCard({ report: r }: { report: Report }) {
  const ready = r.status === "Ready";
  return (
    <article className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-bold tracking-wide ${FORMAT_STYLE[r.format]}`}
        >
          {r.format}
        </span>
        <Badge className={STATUS_STYLE[r.status]}>{r.status}</Badge>
      </div>

      <h2 className="mt-4 text-sm font-semibold">{r.name}</h2>
      <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {r.description}
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4 text-xs dark:border-zinc-900">
        <div>
          <dt className="text-zinc-400 dark:text-zinc-500">Period</dt>
          <dd className="mt-0.5 font-medium">{r.period}</dd>
        </div>
        <div>
          <dt className="text-zinc-400 dark:text-zinc-500">{ready ? "Generated" : "Scheduled for"}</dt>
          <dd className="mt-0.5 font-medium tabular-nums">{r.date}</dd>
        </div>
      </dl>

      <Button
        variant={ready ? "primary" : "outline"}
        size="md"
        fullWidth
        className="mt-4 !py-2"
        disabled={!ready}
        title={ready ? "Preview only — static data" : "Not yet generated"}
      >
        {ready ? `Download ${r.format}` : "Not yet available"}
      </Button>
    </article>
  );
}

export default function ReportsPage() {
  const [filter, setFilter] = useState<Filter>("All");

  const readyCount = reports.filter((r) => r.status === "Ready").length;
  const scheduledCount = reports.length - readyCount;
  const counts: Record<Filter, number> = {
    All: reports.length,
    Ready: readyCount,
    Scheduled: scheduledCount,
  };
  const visible = reports.filter((r) => filter === "All" || r.status === filter);
  const nextScheduled = reports
    .filter((r) => r.status === "Scheduled")
    .map((r) => r.date)
    .sort()[0];

  return (
    <AdminGuard>
      <PageContainer
        width="lg"
        title="Reports"
        description="Generated reports for finance, inventory, and customers. Data shown is illustrative."
      >
        <StatGrid
          stats={[
            { label: "Total reports", value: reports.length, icon: "▤" },
            { label: "Ready to download", value: readyCount, icon: "✓" },
            {
              label: "Scheduled",
              value: scheduledCount,
              icon: "◷",
              footer: nextScheduled && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Next: <span className="tabular-nums">{nextScheduled}</span>
                </p>
              ),
            },
          ]}
        />

        <div role="tablist" aria-label="Filter by status" className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  on
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {f}
                <span className={`ml-1.5 tabular-nums ${on ? "opacity-70" : "text-zinc-400"}`}>
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="stagger mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </PageContainer>
    </AdminGuard>
  );
}
