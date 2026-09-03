"use client";

import AdminGuard from "@/components/AdminGuard";
import { reports, type Report } from "@/lib/admin-data";

const STATUS_STYLE: Record<Report["status"], string> = {
  Ready: "bg-[#0ca30c]/10 text-[#006300] dark:text-[#0ca30c]",
  Scheduled: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function ReportsPage() {
  const readyCount = reports.filter((r) => r.status === "Ready").length;
  const scheduledCount = reports.length - readyCount;

  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Generated reports for finance, inventory, and customers. Data shown is illustrative.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total reports</p>
            <p className="mt-2 text-2xl font-semibold">{reports.length}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Ready</p>
            <p className="mt-2 text-2xl font-semibold">{readyCount}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Scheduled</p>
            <p className="mt-2 text-2xl font-semibold">{scheduledCount}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3 font-medium">Report</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Format</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.description}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{r.period}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{r.format}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                    {r.date}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={r.status !== "Ready"}
                      title={r.status === "Ready" ? "Preview only — static data" : "Not yet generated"}
                      className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminGuard>
  );
}
