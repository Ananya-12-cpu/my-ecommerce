"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";

const linkClass = "nav-link hover:text-zinc-600 dark:hover:text-zinc-300";

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      key={count}
      className="animate-badge-pop absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white dark:bg-white dark:text-black"
    >
      {count}
    </span>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export default function Header() {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user } = useAuth();
  const pathname = usePathname();

  // The menu is "open" only for the page it was opened on, so navigating
  // anywhere closes it without needing an effect to reset state.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;
  const closeMenu = () => setOpenPath(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    // Prevent the page behind the open menu from scrolling.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const links: { href: string; label: string; count?: number }[] = [
    { href: "/shop", label: "Shop" },
    { href: "/wishlist", label: "Wishlist", count: wishlistItems.length },
    { href: "/cart", label: "Cart", count: totalItems },
    ...(user?.role === "user" ? [{ href: "/orders", label: "Orders" }] : []),
    ...(user ? [{ href: "/offers", label: "Offer Zone" }] : []),
    ...(user?.role === "admin"
      ? [
          { href: "/admin/analytics", label: "Analytics" },
          { href: "/admin/reports", label: "Reports" },
          { href: "/admin/customers", label: "Customers" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-transform hover:scale-105"
        >
          Cartify
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`${linkClass} ${l.count !== undefined ? "relative" : ""}`}>
              {l.label}
              {l.count !== undefined && <Badge count={l.count} />}
            </Link>
          ))}
          <Link
            href="/profile"
            aria-label="Profile"
            className="text-zinc-700 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-white"
          >
            <ProfileIcon />
          </Link>
        </nav>

        {/* Mobile / tablet actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <Link
            href="/cart"
            aria-label={`Cart${totalItems ? `, ${totalItems} items` : ""}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span
                key={totalItems}
                className="animate-badge-pop absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white dark:bg-white dark:text-black"
              >
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ProfileIcon />
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setOpenPath(menuOpen ? null : pathname)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <>
          <div
            className="animate-overlay absolute inset-x-0 top-full z-40 h-screen bg-black/40 lg:hidden"
            onClick={closeMenu}
            aria-hidden
          />
          <nav
            id="mobile-menu"
            className="animate-fade-in absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-zinc-200 bg-white px-4 py-2 shadow-lg dark:border-zinc-800 dark:bg-black lg:hidden"
          >
            <ul className="flex flex-col text-base font-medium">
              {links.map((l) => {
                const active =
                  pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <li
                    key={l.href}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                  >
                    <Link
                      href={l.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-3.5 ${
                        active ? "text-sky-700 dark:text-sky-400" : ""
                      }`}
                    >
                      {l.label}
                      {!!l.count && (
                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-1.5 text-xs text-white dark:bg-white dark:text-black">
                          {l.count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-zinc-100 dark:border-zinc-900">
                <Link
                  href={user ? "/profile" : "/login"}
                  onClick={closeMenu}
                  className="flex items-center gap-2 py-3.5"
                >
                  <ProfileIcon />
                  {user ? "Profile" : "Log in"}
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
