"use client";

import AdminGuard from "@/components/AdminGuard";
import { Badge, Button, DataTable, PageContainer, StatGrid } from "@/components/ui";
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
      <PageContainer
        width="lg"
        title="Reports"
        description="Generated reports for finance, inventory, and customers. Data shown is illustrative."
      >
        <StatGrid
          stats={[
            { label: "Total reports", value: reports.length },
            { label: "Ready", value: readyCount },
            { label: "Scheduled", value: scheduledCount },
          ]}
        />

        <DataTable
          rows={reports}
          rowKey={(r) => r.id}
          columns={[
            {
              header: "Report",
              render: (r) => (
                <>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.description}</p>
                </>
              ),
            },
            { header: "Period", render: (r) => r.period, muted: true },
            { header: "Format", render: (r) => r.format, muted: true },
            {
              header: "Status",
              render: (r) => <Badge className={STATUS_STYLE[r.status]}>{r.status}</Badge>,
            },
            { header: "Date", render: (r) => r.date, muted: true, numeric: true },
            {
              header: "Action",
              align: "right",
              render: (r) => (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={r.status !== "Ready"}
                  title={r.status === "Ready" ? "Preview only — static data" : "Not yet generated"}
                >
                  Download
                </Button>
              ),
            },
          ]}
        />
      </PageContainer>
    </AdminGuard>
  );
}
