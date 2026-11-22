import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  footer,
  icon,
}: {
  label: string;
  value: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
        {icon && (
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {footer}
    </div>
  );
}

export function StatGrid({
  stats,
  columns = 3,
}: {
  stats: { label: string; value: ReactNode; footer?: ReactNode; icon?: ReactNode }[];
  columns?: 3 | 4;
}) {
  return (
    <div
      className={`stagger mt-8 grid gap-4 ${columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}
    >
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
