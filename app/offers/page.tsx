"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { PageContainer, StatCard } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import { activeOffers, adminOffers, type AdminOffer } from "@/lib/offers-data";

function OfferCard({ offer }: { offer: (typeof activeOffers)[number] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(offer.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <span
        className="w-fit rounded-full px-2 py-0.5 text-xs font-semibold text-white"
        style={{ backgroundColor: offer.color }}
      >
        {offer.discount}
      </span>
      <h3 className="mt-3 font-semibold">{offer.title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{offer.description}</p>

      <div className="mt-4 flex items-center justify-between rounded-md border border-dashed border-zinc-300 px-3 py-2 dark:border-zinc-700">
        <span className="font-mono text-sm font-medium tracking-wide">{offer.code}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-medium text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        {offer.category} · Expires {offer.expires}
      </p>
    </div>
  );
}

function CustomerOfferZone() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <div className="rounded-lg bg-black px-6 py-8 text-white dark:bg-white dark:text-black">
        <p className="text-xs font-medium uppercase tracking-wide opacity-70">Offer zone</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Deals picked for you
        </h1>
        <p className="mt-1 text-sm opacity-80">
          Apply a code at checkout. New offers drop regularly.
        </p>
      </div>

      <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeOffers.map((offer) => (
          <OfferCard key={offer.code} offer={offer} />
        ))}
      </div>
    </div>
  );
}

type StatusFilter = "All" | AdminOffer["status"];
const STATUS_FILTERS: StatusFilter[] = ["All", "Active", "Scheduled", "Expired"];

const STATUS_DOT: Record<AdminOffer["status"], string> = {
  Active: "bg-[#0ca30c]",
  Scheduled: "bg-amber-500",
  Expired: "bg-zinc-400",
};

function AdminOfferZone() {
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");

  const countOf = (s: StatusFilter) =>
    s === "All" ? adminOffers.length : adminOffers.filter((o) => o.status === s).length;
  const totalRedemptions = adminOffers.reduce((sum, o) => sum + o.redemptions, 0);
  const maxRedemptions = Math.max(...adminOffers.map((o) => o.redemptions), 1);
  const topOffer = adminOffers.reduce((a, b) => (b.redemptions > a.redemptions ? b : a));

  const q = query.trim().toLowerCase();
  const rows = adminOffers.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (!q || o.code.toLowerCase().includes(q) || o.description.toLowerCase().includes(q)),
  );

  return (
    <PageContainer
      width="lg"
      title="Offer zone"
      description="Manage promotional codes across the storefront. Data shown is illustrative."
    >
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active offers" value={countOf("Active")} />
        <StatCard label="Scheduled" value={countOf("Scheduled")} />
        <StatCard label="Total redemptions" value={totalRedemptions.toLocaleString()} />
        <StatCard
          label="Top performer"
          value={<span className="font-mono text-lg">{topOffer.code}</span>}
          footer={
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {topOffer.redemptions.toLocaleString()} redemptions
            </p>
          }
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by status">
          {STATUS_FILTERS.map((s) => {
            const selected = filter === s;
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300"
                }`}
              >
                {s} <span className="opacity-60">{countOf(s)}</span>
              </button>
            );
          })}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search code or description"
          aria-label="Search offers"
          className="w-full rounded-full border border-zinc-200 bg-transparent px-4 py-1.5 text-sm outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-800 sm:w-64"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <th className="px-4 py-3 font-medium">Offer</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Redemptions</th>
              <th className="px-4 py-3 text-right font-medium">Expires</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.code}
                className="border-b border-zinc-100 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-900 dark:hover:bg-zinc-900/50"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-semibold tracking-wide">{o.code}</span>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{o.description}</p>
                </td>
                <td className="px-4 py-3 font-medium">{o.discount}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[o.status]}`} />
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 tabular-nums">{o.redemptions.toLocaleString()}</span>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-zinc-800 dark:bg-zinc-200"
                        style={{ width: `${(o.redemptions / maxRedemptions) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-600 dark:text-zinc-300">
                  {o.expires}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                  No offers match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        Showing {rows.length} of {adminOffers.length} offers
      </p>
    </PageContainer>
  );
}

export default function OffersPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user?.role === "admin" ? <AdminOfferZone /> : <CustomerOfferZone />}
    </AuthGuard>
  );
}
