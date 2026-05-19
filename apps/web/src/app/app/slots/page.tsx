"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { batchApi } from "@/lib/api/client";
import { CanonicalStatus, EmptyState, ErrorState, formatMoney, LoadingState, PageHeading, readArray, readNumber, readText, Surface, type JsonRecord } from "@/components/ui/data-state";

export default function SlotsPage() {
  const [slots, setSlots] = React.useState<JsonRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    batchApi.listSlots()
      .then((result) => {
        if (!mounted) return;
        if (!result.ok) return setError(result.error?.message ?? "Slots endpoint returned an error.");
        setSlots(readArray<JsonRecord>(result.data, ["slots", "items", "data"]));
      })
      .catch((err: Error) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <AppShell title="My Slots" eyebrow="Transferable batch positions">
      <div className="space-y-6">
        <PageHeading eyebrow="Buyer market" title="My Slots" copy="Slots are real batch rights: quantity, entry price, delivery lock, transfer state, and P/L are rendered from GET /api/slots." action={<Link href="/app/slots/pnl"><Button size="sm" variant="secondary">View P/L</Button></Link>} />
        {loading ? <LoadingState rows={4} /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error && !slots.length ? <EmptyState title="No active slots. Browse open batches." copy="Slots are created by the backend after buyer commitments are accepted." /> : null}
        {!loading && !error && slots.length ? <Surface className="divide-y divide-line p-3">{slots.map((slot) => <SlotRow key={readText(slot, ["id", "slotId"])} slot={slot} />)}</Surface> : null}
      </div>
    </AppShell>
  );
}

function SlotRow({ slot }: { slot: JsonRecord }) {
  const currency = readText(slot, ["currency"], "USD");
  const status = readText(slot, ["status"], "ACTIVE");
  const batchStatus = readText(slot, ["batchStatus", "batch.status"], "OPEN");
  const quantity = readNumber(slot, ["quantity", "units"], 0);
  const entry = readNumber(slot, ["entryUnitPrice", "entryPrice", "unitPrice"], 0);
  const ask = readNumber(slot, ["currentAsk", "askUnitPrice", "listing.askUnitPrice"], 0);
  const net = readNumber(slot, ["pnl.net", "netPnl", "net"], ask && entry ? (ask - entry) * quantity : 0);
  const returnPercent = entry > 0 ? (net / (entry * quantity)) * 100 : readNumber(slot, ["pnl.returnPercent", "returnPercent"], 0);
  const locked = Boolean(slot.deliveryLockAt) || ["LOCKED", "DELIVERED", "REFUNDED", "DISPUTED"].includes(status.toUpperCase());

  return (
    <div className="grid gap-4 rounded-[10px] px-3 py-4 md:grid-cols-[1.5fr_1fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-medium text-ink-primary">{readText(slot, ["batchTitle", "batch.title", "title"], "Batch slot")}</h3>
          <CanonicalStatus status={status} />
          <CanonicalStatus status={batchStatus} />
        </div>
        <p className="mt-2 text-[13px] text-ink-secondary">{quantity} units · Entry {formatMoney(entry, currency)} {ask ? `· Ask ${formatMoney(ask, currency)}` : ""}</p>
      </div>
      <div>
        <p className={`font-mono text-[18px] font-medium ${net >= 0 ? "text-semantic-cleared" : "text-rose-700"}`}>{net >= 0 ? "+" : ""}{formatMoney(net, currency)}</p>
        <p className="mt-1 text-[12px] text-ink-secondary">{returnPercent >= 0 ? "+" : ""}{returnPercent.toFixed(1)}% net return</p>
      </div>
      <div className="flex flex-wrap gap-2 md:justify-end">
        {locked ? <span className="inline-flex h-[32px] items-center rounded-[6px] bg-semantic-warningLight px-3 text-[12px] font-medium text-semantic-warning">Delivery locked</span> : <Button size="sm" variant="secondary">List for Transfer</Button>}
        {status.toUpperCase() === "LISTED" ? <Button size="sm" variant="ghost">Cancel Listing</Button> : null}
      </div>
    </div>
  );
}
