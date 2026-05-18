"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { batchApi } from "@/lib/api/client";
import { EmptyState, ErrorState, formatMoney, LoadingState, PageHeading, readNumber, Surface, type JsonRecord } from "@/components/ui/data-state";

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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const kpis = [
    ["Protected in Escrow", formatMoney(readNumber(data, ["protectedInEscrow", "escrowTotal", "heldAmount"]))],
    ["Active Commitments", readNumber(data, ["activeCommitments", "commitmentCount", "commitmentsCount"])],
    ["Clearing Soon", readNumber(data, ["clearingSoonCount", "nearClearingCount"])],
    ["Pending Deliveries", readNumber(data, ["pendingDeliveries", "pendingDeliveriesCount"])],
  ];

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Buyer command center"
        title="Home"
        copy="Commitments, escrow exposure, clearing movement, and delivery status render from the buyer dashboard endpoint."
        action={<Link href="/batches"><Button size="sm">Join a batch</Button></Link>}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([label, value]) => (
          <Surface key={String(label)} className="px-6 py-5">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-ink-secondary">{label}</p>
            <p className="font-mono text-[32px] font-medium tracking-tight text-ink-primary">{value}</p>
          </Surface>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%]">
        <div>
          <h2 className="mb-4 text-[18px] font-medium text-ink-primary">My Active Commitments</h2>
          <EmptyState title="Commitment rail connected" copy="Rows stay empty until /api/buyer/dashboard returns active commitment records." />
        </div>
        <div>
          <h2 className="mb-4 text-[18px] font-medium text-ink-primary">Batches Clearing Soon</h2>
          <EmptyState title="Clearing rail connected" copy="This rail stays empty unless the backend returns near-clearing batches." />
        </div>
      </section>
    </div>
  );
}
