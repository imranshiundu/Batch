"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { batchApi } from "@/lib/api/client";
import { EmptyState, ErrorState, formatMoney, LoadingState, PageHeading, readArray, readNumber, readText, Surface, type JsonRecord } from "@/components/ui/data-state";

export default function SlotPnlPage() {
  const [data, setData] = React.useState<JsonRecord | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    batchApi.getSlotPnl()
      .then((result) => {
        if (!mounted) return;
        if (!result.ok) return setError(result.error?.message ?? "Slot P/L endpoint returned an error.");
        setData((result.data ?? {}) as JsonRecord);
      })
      .catch((err: Error) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const currency = readText(data, ["currency"], "USD");
  const transfers = readArray<JsonRecord>(data, ["transfers", "closedTransfers", "items"]);
  const metrics = [
    ["Realized P/L", readNumber(data, ["realizedPnl", "realized", "totals.realizedPnl"])],
    ["Unrealized P/L", readNumber(data, ["unrealizedPnl", "unrealized", "totals.unrealizedPnl"])],
    ["Transfer fees paid", -Math.abs(readNumber(data, ["transferFeesPaid", "fees", "totals.transferFeesPaid"]))],
    ["Net result", readNumber(data, ["netResult", "net", "totals.netResult"])],
  ];

  return (
    <AppShell title="Slot P/L" eyebrow="Position result">
      <div className="space-y-6">
        <PageHeading eyebrow="Buyer market" title="P&L Dashboard" copy="Realized, unrealized, fees, and net results are shown from GET /api/slots/pnl with monospace financial values." />
        {loading ? <LoadingState rows={4} /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error ? <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{metrics.map(([label, value]) => <Surface key={String(label)} className="p-5"><p className="text-[12px] font-medium uppercase tracking-wide text-ink-secondary">{label}</p><p className={`mt-2 font-mono text-[24px] font-medium ${Number(value) >= 0 ? "text-semantic-cleared" : "text-rose-700"}`}>{Number(value) >= 0 ? "+" : ""}{formatMoney(value, currency)}</p></Surface>)}</section> : null}
        {!loading && !error ? <Surface className="p-5"><h2 className="text-[18px] font-medium text-ink-primary">Closed slot transfers</h2>{transfers.length ? <div className="mt-4 divide-y divide-line">{transfers.map((transfer) => <div key={readText(transfer, ["id", "transferId"])} className="grid gap-3 py-4 text-[13px] md:grid-cols-5"><span className="font-medium text-ink-primary">{readText(transfer, ["batchTitle", "batch.title"], "Transfer")}</span><span>Entry {formatMoney(readNumber(transfer, ["entryUnitPrice", "entryPrice"]), currency)}</span><span>Exit {formatMoney(readNumber(transfer, ["exitUnitPrice", "exitPrice"]), currency)}</span><span>{readNumber(transfer, ["quantity"], 0)} units</span><span className="font-mono font-medium text-ink-primary">{formatMoney(readNumber(transfer, ["netPnl", "net"]), currency)}</span></div>)}</div> : <EmptyState title="No closed transfers yet." copy="Closed transfer rows appear when the P/L endpoint returns transfer records." />}</Surface> : null}
      </div>
    </AppShell>
  );
}
