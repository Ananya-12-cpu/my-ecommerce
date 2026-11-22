import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  footer,
}: {
  label: string;
  value: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {footer}
    </div>
  );
}

export function StatGrid({
  stats,
}: {
  stats: { label: string; value: ReactNode }[];
}) {
  return (
    <div className="stagger mt-8 grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
