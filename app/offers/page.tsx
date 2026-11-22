"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Badge, DataTable, PageContainer, StatGrid } from "@/components/ui";
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

      <div className="stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <PageContainer
      width="lg"
      title="Offer zone"
      description="Manage promotional codes across the storefront. Data shown is illustrative."
    >
      <StatGrid
        stats={[
          { label: "Active offers", value: activeCount },
          { label: "Total redemptions", value: totalRedemptions.toLocaleString() },
          { label: "Scheduled", value: scheduledCount },
        ]}
      />

      <DataTable
        rows={adminOffers}
        rowKey={(o) => o.code}
        columns={[
          {
            header: "Code",
            render: (o) => <span className="font-mono text-xs font-medium">{o.code}</span>,
          },
          { header: "Description", render: (o) => o.description, muted: true },
          { header: "Discount", render: (o) => o.discount, muted: true },
          {
            header: "Status",
            render: (o) => <Badge className={ADMIN_STATUS_STYLE[o.status]}>{o.status}</Badge>,
          },
          { header: "Redemptions", render: (o) => o.redemptions.toLocaleString(), numeric: true },
          { header: "Expires", render: (o) => o.expires, muted: true, numeric: true },
        ]}
      />
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
