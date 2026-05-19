"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { batchApi } from "@/lib/api/client";
import { CanonicalStatus, EmptyState, ErrorState, formatMoney, LoadingState, PageHeading, ProgressBar, readArray, readNumber, readText, Surface, type JsonRecord } from "@/components/ui/data-state";

export default function BuyerDashboardPage() {
  const [data, setData] = React.useState<JsonRecord | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    batchApi.getBuyerDashboard()
      .then((result) => {
        if (!mounted) return;
        if (!result.ok) {
          setError(result.error?.message ?? "Buyer dashboard endpoint returned an error.");
          return;
        }
        setData((result.data ?? {}) as JsonRecord);
      })
      .catch((err: Error) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingState rows={4} />;
  if (error) return <ErrorState message={error} />;

  const currency = readText(data, ["currency", "defaultCurrency"], "USD");
  const active = readArray<JsonRecord>(data, ["activeCommitments", "commitments", "active"]);
  const clearing = readArray<JsonRecord>(data, ["clearingSoon", "nearClearing", "batchesClearingSoon"]);
  const kpis = [
    ["Protected in Escrow", formatMoney(readNumber(data, ["protectedInEscrow", "escrowTotal", "heldAmount", "totals.protectedInEscrow"]), currency)],
    ["Active Commitments", readNumber(data, ["activeCommitmentCount", "commitmentCount", "commitmentsCount"], active.length)],
    ["Clearing Soon", readNumber(data, ["clearingSoonCount", "nearClearingCount"], clearing.length)],
    ["Pending Deliveries", readNumber(data, ["pendingDeliveries", "pendingDeliveriesCount"])],
  ];

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Buyer command center"
        title="Portfolio view"
        copy="Your dashboard is a financial position view: protected funds, active commitments, clearing movement, and delivery obligations."
        action={<Link href="/batches"><Button size="sm">Join a Batch</Button></Link>}
      />

      <section className="flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
        {kpis.map(([label, value]) => (
          <Surface key={String(label)} className="min-w-[230px] snap-start px-6 py-5 md:min-w-0">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-ink-secondary">{label}</p>
            <p className="font-mono text-[32px] font-medium tracking-tight text-ink-primary">{value}</p>
          </Surface>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%]">
        <div>
          <h2 className="mb-4 text-[18px] font-medium text-ink-primary">My Active Commitments</h2>
          <Surface className="p-5">
            {active.length ? active.map((item) => <CommitmentRow key={readText(item, ["id", "batchId", "batchTitle"])} item={item} currency={currency} />) : <EmptyState title="No active slots. Browse open batches." copy="Commitment rows appear here after /api/buyer/dashboard returns active records." />}
          </Surface>
        </div>
        <div>
          <h2 className="mb-4 text-[18px] font-medium text-ink-primary">Batches Clearing Soon</h2>
          <Surface className="divide-y divide-line p-3">
            {clearing.length ? clearing.map((item) => <CompactBatch key={readText(item, ["id", "slug", "title"])} item={item} currency={currency} />) : <EmptyState title="No batches clearing soon." copy="The backend returned no near-clearing records." />}
          </Surface>
        </div>
      </section>
    </div>
  );
}

function CommitmentRow({ item, currency }: { item: JsonRecord; currency: string }) {
  const progress = readNumber(item, ["progress", "deliveryProgress", "batchProgress"], 0);
  const status = readText(item, ["status", "batchStatus"], "ACTIVE");
  return (
    <div className="border-b border-surface-raised py-4 last:border-0">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[14px] font-medium text-ink-primary">{readText(item, ["batchTitle", "title", "batch.name"], "Batch commitment")}</h3>
            <CanonicalStatus status={status} />
          </div>
          <div className="mt-3 max-w-md"><ProgressBar value={progress} /></div>
        </div>
        <div className="text-left md:text-right">
          <p className="font-mono text-[14px] font-medium text-ink-primary">{formatMoney(readNumber(item, ["escrowAmount", "heldAmount", "totalHeld"]), readText(item, ["currency"], currency))}</p>
          <p className="mt-1 text-[12px] text-ink-secondary">Protected funds</p>
        </div>
      </div>
    </div>
  );
}

function CompactBatch({ item, currency }: { item: JsonRecord; currency: string }) {
  return (
    <Link href={`/batches/${readText(item, ["slug", "id"], "batch")}`} className="flex min-h-[56px] items-center justify-between gap-3 rounded-[8px] px-3 text-[13px] transition hover:bg-surface-raised">
      <span className="font-medium text-ink-primary">{readText(item, ["title", "batchTitle"], "Batch")}</span>
      <span className="font-mono text-ink-secondary">{formatMoney(readNumber(item, ["unitPrice", "batchPrice", "lastUnitPrice"]), readText(item, ["currency"], currency))}</span>
      <span className="text-ink-secondary">{readText(item, ["timeLeft", "deadlineLabel"], "Live")}</span>
    </Link>
  );
}
