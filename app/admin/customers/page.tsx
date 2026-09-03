"use client";

import AdminGuard from "@/components/AdminGuard";
import { customers, type Customer } from "@/lib/admin-data";

const STATUS_STYLE: Record<Customer["status"], string> = {
  VIP: "bg-black text-white dark:bg-white dark:text-black",
  Active: "bg-[#0ca30c]/10 text-[#006300] dark:text-[#0ca30c]",
  Inactive: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CustomersPage() {
  const vipCount = customers.filter((c) => c.status === "VIP").length;
  const activeCount = customers.filter((c) => c.status === "Active").length;

  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Customer accounts and lifetime value. Data shown is illustrative.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Total customers</p>
            <p className="mt-2 text-2xl font-semibold">{customers.length}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">VIP</p>
            <p className="mt-2 text-2xl font-semibold">{vipCount}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Active</p>
            <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium tabular-nums">Orders</th>
                <th className="px-4 py-3 text-right font-medium tabular-nums">Total spent</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">
                        {initials(c.name)}
                      </span>
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                    {c.joined}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                    {c.orders}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{c.totalSpent}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status]}`}
                    >
                      {c.status}
                    </span>
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
