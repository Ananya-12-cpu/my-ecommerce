"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          This page is only available to admin accounts.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
