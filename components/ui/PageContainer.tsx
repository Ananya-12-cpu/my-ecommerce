import type { ReactNode } from "react";

const widths = { sm: "max-w-sm", md: "max-w-3xl", lg: "max-w-5xl" } as const;

export default function PageContainer({
  width = "md",
  title,
  description,
  children,
}: {
  width?: keyof typeof widths;
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto w-full ${widths[width]} flex-1 px-6 py-10`}>
      {title && (
        <h1
          className={`text-2xl font-semibold tracking-tight ${description ? "" : "mb-8"}`}
        >
          {title}
        </h1>
      )}
      {description && (
        <p className="mb-8 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
