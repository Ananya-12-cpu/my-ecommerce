import type { ReactNode } from "react";

export default function Badge({
  className = "",
  children,
}: {
  /** Color classes, e.g. a status → style map entry. */
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
