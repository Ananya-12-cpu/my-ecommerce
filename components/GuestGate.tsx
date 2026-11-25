"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { LoginPromptCard } from "@/components/LoginPrompt";
import { useAuth } from "@/lib/auth-context";

// Pages a signed-out visitor may open: home, shop, product pages and login.
function isPublicPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/shop" ||
    pathname === "/login" ||
    pathname.startsWith("/products/")
  );
}

const noopSubscribe = () => () => {};

export default function GuestGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  // The session lives in localStorage, so it is unknown until the browser has
  // hydrated. Waiting avoids flashing the prompt at signed-in users.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  if (isPublicPath(pathname)) return <>{children}</>;
  if (!hydrated) return <div className="flex-1" />;

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <LoginPromptCard />
      </div>
    );
  }

  return <>{children}</>;
}
