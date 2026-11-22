import type { ReactNode } from "react";
import { LinkButton } from "./Button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  action,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  /** Custom action; overrides actionLabel/actionHref. */
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && (
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      {action ??
        (actionLabel && actionHref && (
          <LinkButton href={actionHref} className="mt-6">
            {actionLabel}
          </LinkButton>
        ))}
    </div>
  );
}
