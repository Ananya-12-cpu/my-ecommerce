import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right";
  /** Muted text color for secondary cells. */
  muted?: boolean;
  /** tabular-nums for numbers/dates. */
  numeric?: boolean;
};

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            {columns.map((c) => (
              <th
                key={c.header}
                className={`px-4 py-3 font-medium ${c.align === "right" ? "text-right" : ""} ${c.numeric ? "tabular-nums" : ""}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
            >
              {columns.map((c) => (
                <td
                  key={c.header}
                  className={`px-4 py-3 ${c.align === "right" ? "text-right" : ""} ${c.numeric ? "tabular-nums" : ""} ${c.muted ? "text-zinc-600 dark:text-zinc-300" : ""}`}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
