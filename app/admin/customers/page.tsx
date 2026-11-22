"use client";

import { useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { Badge, DataTable, PageContainer, StatGrid, inputClass } from "@/components/ui";
import { customers, type Customer } from "@/lib/admin-data";

const STATUS_STYLE: Record<Customer["status"], string> = {
  VIP: "bg-black text-white dark:bg-white dark:text-black",
  Active: "bg-[#0ca30c]/10 text-[#006300] dark:text-[#0ca30c]",
  Inactive: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

const FILTERS = ["All", "VIP", "Active", "Inactive"] as const;
type Filter = (typeof FILTERS)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function money(v: string) {
  return Number(v.replace(/[$,]/g, ""));
}

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CustomersPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const totalRevenue = customers.reduce((s, c) => s + money(c.totalSpent), 0);
  const totalOrders = customers.reduce((s, c) => s + c.orders, 0);
  const vipCount = customers.filter((c) => c.status === "VIP").length;
  const activeCount = customers.filter((c) => c.status === "Active").length;

  const counts: Record<Filter, number> = {
    All: customers.length,
    VIP: vipCount,
    Active: activeCount,
    Inactive: customers.length - vipCount - activeCount,
  };

  const q = query.trim().toLowerCase();
  const rows = customers.filter(
      (c) =>
        (filter === "All" || c.status === filter) &&
        (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)),
  );

  return (
    <AdminGuard>
      <PageContainer
        width="lg"
        title="Customers"
        description="Customer accounts and lifetime value. Data shown is illustrative."
      >
        <StatGrid
          columns={4}
          stats={[
            { label: "Total customers", value: customers.length, icon: "👥" },
            { label: "VIP customers", value: vipCount, icon: "★" },
            { label: "Lifetime revenue", value: usd(totalRevenue), icon: "$" },
            {
              label: "Avg. orders / customer",
              value: (totalOrders / customers.length).toFixed(1),
              icon: "#",
            },
          ]}
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-2">
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
          <div className="sm:w-64">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search customers"
            className={inputClass}
          />
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
            <p className="font-medium">No customers found</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Try a different search or filter.</p>
          </div>
        ) : (
          <DataTable
            rows={rows}
            rowKey={(c) => c.id}
            columns={[
              {
                header: "Customer",
                render: (c) => (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold dark:bg-zinc-800">
                      {initials(c.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{c.name}</p>
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{c.email}</p>
                    </div>
                  </div>
                ),
              },
              { header: "Joined", render: (c) => c.joined, muted: true, numeric: true },
              { header: "Orders", render: (c) => c.orders, muted: true, numeric: true },
              {
                header: "Total spent",
                align: "right",
                numeric: true,
                render: (c) => (
                  <div className="ml-auto flex w-28 flex-col items-end gap-1">
                    <span className="font-medium">{c.totalSpent}</span>
                    <span className="h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <span
                        className="block h-full rounded-full bg-[#2a78d6] dark:bg-[#3987e5]"
                        style={{ width: `${(money(c.totalSpent) / Math.max(...customers.map((x) => money(x.totalSpent)))) * 100}%` }}
                      />
                    </span>
                  </div>
                ),
              },
              {
                header: "Status",
                render: (c) => <Badge className={STATUS_STYLE[c.status]}>{c.status}</Badge>,
              },
            ]}
          />
        )}
      </PageContainer>
    </AdminGuard>
  );
}
