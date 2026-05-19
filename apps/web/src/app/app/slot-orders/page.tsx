"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/app-shell";
import { batchApi } from "@/lib/api/client";
import { CanonicalStatus, EmptyState, ErrorState, formatMoney, LoadingState, PageHeading, readArray, readNumber, readText, Surface, type JsonRecord } from "@/components/ui/data-state";

const tabs = ["Open", "Reserved", "Filled", "Cancelled"];

export default function SlotOrdersPage() {
  const [orders, setOrders] = React.useState<JsonRecord[]>([]);
  const [activeTab, setActiveTab] = React.useState("Open");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    batchApi.listSlotOrders()
      .then((result) => {
        if (!mounted) return;
        if (!result.ok) return setError(result.error?.message ?? "Slot orders endpoint returned an error.");
        setOrders(readArray<JsonRecord>(result.data, ["orders", "items", "data"]));
      })
      .catch((err: Error) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  async function reserve(order: JsonRecord) {
    const id = readText(order, ["id", "orderId"]);
    const result = await batchApi.reserveSlotOrder(id, crypto.randomUUID());
    if (!result.ok) setActionError(result.error?.message ?? "Reserve failed.");
  }

  async function cancel(order: JsonRecord) {
    const id = readText(order, ["id", "orderId"]);
    const result = await batchApi.cancelSlotOrder(id, { reason: "Buyer cancelled open order" }, crypto.randomUUID());
    if (!result.ok) setActionError(result.error?.message ?? "Cancel failed.");
  }

  const filtered = orders.filter((order) => statusGroup(readText(order, ["status"], "OPEN")) === activeTab);

  return (
    <AppShell title="Slot Orders" eyebrow="Market lifecycle">
      <div className="space-y-6">
        <PageHeading eyebrow="Buyer market" title="Slot Orders" copy="Slot orders express demand for real batch allocation rights. Reserve and cancel actions call the backend; non-cancellable states are disabled." />
        <div className="flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`h-[36px] rounded-full px-4 text-[13px] font-medium ${activeTab === tab ? "bg-brand-action text-white" : "bg-surface text-ink-secondary"}`}>{tab}</button>)}</div>
        {actionError ? <ErrorState title="Action failed" message={actionError} /> : null}
        {loading ? <LoadingState rows={4} /> : null}
        {error ? <ErrorState message={error} /> : null}
        {!loading && !error && !filtered.length ? <EmptyState title="No orders in this state." copy="Order rows appear when GET /api/slots/orders returns matching records." /> : null}
        {!loading && !error && filtered.length ? <Surface className="overflow-hidden"><div className="hidden grid-cols-[1.5fr_1fr_1fr_auto] gap-4 border-b border-line px-5 py-3 text-[12px] font-medium uppercase tracking-wide text-ink-secondary md:grid"><span>Batch</span><span>Limit</span><span>Status</span><span>Action</span></div>{filtered.map((order) => <OrderRow key={readText(order, ["id", "orderId"])} order={order} reserve={reserve} cancel={cancel} />)}</Surface> : null}
      </div>
    </AppShell>
  );
}

function statusGroup(status: string) {
  const normalized = status.toUpperCase();
  if (["RESERVED", "HELD"].includes(normalized)) return "Reserved";
  if (["FILLED", "COMPLETED", "SETTLED"].includes(normalized)) return "Filled";
  if (["CANCELLED", "CANCELED", "EXPIRED"].includes(normalized)) return "Cancelled";
  return "Open";
}

function OrderRow({ order, reserve, cancel }: { order: JsonRecord; reserve: (order: JsonRecord) => void; cancel: (order: JsonRecord) => void }) {
  const currency = readText(order, ["currency"], "USD");
  const status = readText(order, ["status"], "OPEN");
  const normalized = status.toUpperCase();
  const canCancel = ["OPEN", "PARTIALLY_FILLED"].includes(normalized);
  const matched = Boolean(readText(order, ["matchedListingId", "listing.id"], ""));
  return (
    <div className="grid gap-4 border-b border-line px-5 py-4 last:border-0 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
      <div><p className="text-[14px] font-medium text-ink-primary">{readText(order, ["batchTitle", "batch.title", "title"], "Slot order")}</p><p className="mt-1 text-[12px] text-ink-secondary">{readNumber(order, ["quantity", "units"], 0)} units {matched ? "· matched listing found" : "· waiting for match"}</p></div>
      <div><p className="font-mono text-[14px] text-ink-primary">{formatMoney(readNumber(order, ["limitPrice", "limitUnitPrice", "price"], 0), currency)}</p><p className="mt-1 text-[12px] text-ink-secondary">Ask {formatMoney(readNumber(order, ["matchedAskPrice", "listing.askUnitPrice"], 0), currency)}</p></div>
      <CanonicalStatus status={status} />
      <div className="flex gap-2 md:justify-end"><Button size="sm" variant="secondary" disabled={!matched || normalized !== "OPEN"} onClick={() => reserve(order)}>Reserve</Button><Button size="sm" variant="ghost" disabled={!canCancel} onClick={() => cancel(order)} title={canCancel ? "Cancel order" : "Order cannot be cancelled."}>Cancel</Button></div>
    </div>
  );
}
