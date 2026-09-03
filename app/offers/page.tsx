"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { activeOffers, adminOffers, type AdminOffer } from "@/lib/offers-data";

const ADMIN_STATUS_STYLE: Record<AdminOffer["status"], string> = {
  Active: "bg-[#0ca30c]/10 text-[#006300] dark:text-[#0ca30c]",
  Scheduled: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  Expired: "bg-zinc-100 text-zinc-400 line-through dark:bg-zinc-900 dark:text-zinc-600",
};

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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeOffers.map((offer) => (
          <OfferCard key={offer.code} offer={offer} />
        ))}
      </div>
    </div>
  );
}

function AdminOfferZone() {
  const activeCount = adminOffers.filter((o) => o.status === "Active").length;
  const totalRedemptions = adminOffers.reduce((sum, o) => sum + o.redemptions, 0);
  const scheduledCount = adminOffers.filter((o) => o.status === "Scheduled").length;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Offer zone</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage promotional codes across the storefront. Data shown is illustrative.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Active offers</p>
          <p className="mt-2 text-2xl font-semibold">{activeCount}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Total redemptions</p>
          <p className="mt-2 text-2xl font-semibold">{totalRedemptions.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Scheduled</p>
          <p className="mt-2 text-2xl font-semibold">{scheduledCount}</p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Discount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium tabular-nums">Redemptions</th>
              <th className="px-4 py-3 font-medium">Expires</th>
            </tr>
          </thead>
          <tbody>
            {adminOffers.map((o) => (
              <tr key={o.code} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                <td className="px-4 py-3 font-mono text-xs font-medium">{o.code}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{o.description}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{o.discount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${ADMIN_STATUS_STYLE[o.status]}`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums">{o.redemptions.toLocaleString()}</td>
                <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-300">
                  {o.expires}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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
