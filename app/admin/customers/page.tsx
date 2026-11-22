"use client";

import AdminGuard from "@/components/AdminGuard";
import { Badge, DataTable, PageContainer, StatGrid } from "@/components/ui";
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
      <PageContainer
        width="lg"
        title="Customers"
        description="Customer accounts and lifetime value. Data shown is illustrative."
      >
        <StatGrid
          stats={[
            { label: "Total customers", value: customers.length },
            { label: "VIP", value: vipCount },
            { label: "Active", value: activeCount },
          ]}
        />

        <DataTable
          rows={customers}
          rowKey={(c) => c.id}
          columns={[
            {
              header: "Customer",
              render: (c) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium dark:bg-zinc-800">
                    {initials(c.name)}
                  </span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{c.email}</p>
                  </div>
                </div>
              ),
            },
            { header: "Joined", render: (c) => c.joined, muted: true, numeric: true },
            { header: "Orders", render: (c) => c.orders, muted: true, numeric: true },
            { header: "Total spent", render: (c) => c.totalSpent, align: "right", numeric: true },
            {
              header: "Status",
              render: (c) => <Badge className={STATUS_STYLE[c.status]}>{c.status}</Badge>,
            },
          ]}
        />
      </PageContainer>
    </AdminGuard>
  );
}
