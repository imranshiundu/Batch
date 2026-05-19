import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { batchApi } from "@/lib/api/client";
import { CanonicalStatus, EmptyState, ErrorState, formatMoney, normalizedProgress, ProgressBar, readArray, readNumber, readText } from "@/components/ui/data-state";

export const dynamic = "force-dynamic";

type PageProps = { params: { slug: string } };
type BatchDetail = Record<string, unknown>;

const timeline = [
  ["OPEN", "Deal forming"],
  ["FUNDED", "Protected funds locked"],
  ["SUPPLIER_CONFIRMING", "Supplier confirming"],
  ["PRODUCTION", "Production finished"],
  ["SHIPPED", "Shipped and cleared"],
  ["RECEIVED_AT_HUB", "At hub"],
  ["DELIVERED", "Delivered"],
  ["SETTLED", "Settled"],
];

const stateCopy: Record<string, string> = {
  OPEN: "Commitments are open. Funds remain protected until this batch clears.",
  FUNDED: "This batch has cleared. New commitments lock immediately and cannot be cancelled.",
  SUPPLIER_CONFIRMING: "The supplier is confirming the order before production starts.",
  ACTIVE: "The batch is active and awaiting production proof.",
  PRODUCTION: "The supplier is producing the batch and uploading milestone proof.",
  SHIPPED: "Goods are shipped. Delivery tracking will update from the allocation record.",
  RECEIVED_AT_HUB: "Goods reached the hub. Operator allocation is next.",
  ALLOCATING: "Delivery allocation is in progress.",
  DELIVERING: "Allocated goods are moving to buyers.",
  DELIVERED: "Delivery is complete. Confirmation remains a Phase 2 route.",
  FAILED: "This batch failed. Refund processing is required.",
  REFUNDING: "Refunds are in progress.",
  REFUNDED: "Refunds have completed.",
  DISPUTED: "A dispute is open. Operator resolution is required.",
};

export default async function BatchDealRoomPage({ params }: PageProps) {
  const response = await batchApi.getBatch(params.slug).catch((error: Error) => ({ ok: false, data: null, error: { message: error.message }, meta: {} }));
  const batch = (response.data && typeof response.data === "object" && !Array.isArray(response.data) ? response.data : null) as BatchDetail | null;

  if (!response.ok) return <div className="mx-auto max-w-[1200px] px-4 py-8"><ErrorState message={response.error?.message ?? "This batch's live data is temporarily unavailable."} /></div>;
  if (!batch) return <div className="mx-auto max-w-[1200px] px-4 py-8"><EmptyState title="Batch not found." copy="The backend did not return a batch for this slug." /></div>;

  const title = readText(batch, ["title", "name"]);
  const status = readText(batch, ["status"], "OPEN").toUpperCase();
  const supplier = readText(batch, ["supplierName", "supplier.businessName", "supplier"], "Supplier pending");
  const type = readText(batch, ["type", "category"], "Batch");
  const risk = readText(batch, ["riskLevel", "risk"], "Medium");
  const minimum = readNumber(batch, ["minimumUnits", "minimum"], 0);
  const committed = readNumber(batch, ["committedUnits", "unitsCommitted"], 0);
  const progress = normalizedProgress(readNumber(batch, ["progress", "clearingProgress"], minimum > 0 ? (committed / minimum) * 100 : 0));
  const currency = readText(batch, ["currency"], "USD");
  const batchPrice = readNumber(batch, ["batchPrice", "unitPrice", "lastUnitPrice", "price"], 0);
  const normalPrice = readNumber(batch, ["normalPrice", "marketPrice", "retailPrice"], 0);
  const quantity = 10;
  const total = batchPrice * quantity;
  const savings = normalPrice > 0 && batchPrice > 0 ? Math.round(((normalPrice - batchPrice) / normalPrice) * 100) : null;
  const activity = readArray(batch, ["activity", "commitments", "recentCommitments"]);
  const blocked = ["FAILED", "REFUNDING", "REFUNDED", "DISPUTED", "CANCELLED", "SETTLED"].includes(status) || risk.toUpperCase() === "BLOCKED";

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6">
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex w-full flex-col gap-8 lg:w-[58%]">
          <section>
            <div className="mb-3 text-[12px] text-ink-secondary">
              <Link href="/" className="hover:text-ink-primary">Home</Link> &gt; <Link href="/batches" className="hover:text-ink-primary">Batches</Link> &gt; <span className="text-ink-primary">{title}</span>
            </div>
            <h1 className="font-display text-[36px] font-bold leading-[44px] tracking-[-0.03em] text-ink-primary">{title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[14px] text-ink-secondary">{supplier}</span>
              <Badge variant="neutral">{type.replaceAll("_", " ")}</Badge>
              <CanonicalStatus status={status} />
              <Badge variant={risk.toUpperCase() === "HIGH" || risk.toUpperCase() === "BLOCKED" ? "danger" : "success"}>{risk} risk</Badge>
            </div>
          </section>

          <section className="rounded-[12px] border border-line bg-surface p-6 shadow-ui">
            <h2 className="text-[18px] font-medium text-ink-primary">Escrow Timeline</h2>
            <div className="mt-6 flex flex-col">
              {timeline.map(([state, label], index) => {
                const currentIndex = timeline.findIndex(([candidate]) => candidate === status || (status === "ACTIVE" && candidate === "SUPPLIER_CONFIRMING"));
                const done = index < currentIndex;
                const active = index === currentIndex;
                return (
                  <div key={state} className="relative flex min-h-[64px] items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`z-10 h-4 w-4 rounded-full border-2 ${done ? "border-semantic-cleared bg-semantic-cleared" : active ? "border-semantic-escrow bg-semantic-escrow" : "border-line bg-surface"}`} style={active ? { animation: "pulse-blue 1.8s ease-in-out infinite" } : undefined} />
                      {index !== timeline.length - 1 ? <div className={`absolute left-[7px] top-4 h-full w-[2px] ${done ? "bg-semantic-cleared" : "bg-line"}`} /> : null}
                    </div>
                    <div className="-mt-1">
                      <p className={`text-[14px] font-medium ${done || active ? "text-ink-primary" : "text-ink-secondary"}`}>{label}</p>
                      <p className="mt-1 text-[12px] text-ink-secondary">{state.replaceAll("_", " ")}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <InfoSection title="Delivery Plan" text={readText(batch, ["deliveryPlan", "deliveryDescription"], "Hub pickup and direct delivery options are shown from the batch delivery mode and delivery profile snapshot.")} />
          <InfoSection title="Refund Rules" text={status === "FUNDED" ? "This batch has already cleared. New commitments lock immediately and cannot be cancelled." : "If batch fails to clear, 100% refunded within 3 business days."} />
          <InfoSection title="Buyer Activity" text={activity.length ? `${activity.length} recent commitment events returned by the backend.` : `${committed || "—"} buyers or units committed.`} />
        </div>

        <aside className="w-full lg:sticky lg:top-[88px] lg:w-[42%]">
          <div className="flex flex-col gap-6 rounded-[12px] border border-line bg-surface p-6 shadow-ui">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-secondary">Current Batch Price</p>
                <p className="mt-1 font-mono text-[36px] font-semibold tracking-tight text-ink-primary">{formatMoney(batchPrice, currency)}</p>
                <p className="mt-1 text-[14px] text-ink-secondary">{normalPrice ? `Normal market: ${formatMoney(normalPrice, currency)}${savings ? ` — You save ${savings}%` : ""}` : "Market comparison unavailable"}</p>
              </div>
              <span className="font-mono text-[18px] text-ink-primary">{readText(batch, ["countdown", "timeLeft"], "Live")}</span>
            </div>
            <div>
              <ProgressBar value={progress} className="h-[8px]" />
              <p className="mt-2 text-right text-[13px] text-ink-secondary">{committed || "—"} committed / {minimum || "—"} minimum</p>
            </div>
            <div className="rounded-[8px] border border-semantic-escrow/20 bg-semantic-escrowLight px-4 py-3 text-[13px] font-medium text-brand-action">{stateCopy[status] ?? "Batch state is live from the backend."}</div>
            {blocked ? <div className="flex gap-2 rounded-[8px] border border-semantic-warning/30 bg-semantic-warningLight/50 p-3 text-[13px] text-ink-primary"><AlertTriangle className="h-4 w-4 shrink-0 text-semantic-warning" /> Commitment is not available while this batch is blocked, terminal, or under dispute.</div> : null}
            <div className="flex h-[44px] w-[140px] items-center overflow-hidden rounded-[6px] border border-line">
              <button className="flex h-full w-[44px] items-center justify-center border-r border-line text-ink-primary" disabled>-</button>
              <input type="text" value={quantity} readOnly className="w-full flex-1 bg-transparent text-center font-mono text-[14px] font-medium text-ink-primary focus:outline-none" />
              <button className="flex h-full w-[44px] items-center justify-center border-l border-line text-ink-primary" disabled>+</button>
            </div>
            <p className="text-[14px] font-medium text-ink-primary">Your total: {formatMoney(total, currency)}. <span className="font-normal text-ink-secondary">Held as protected funds until clearing.</span></p>
            <Link href={`/commit/${readText(batch, ["id", "slug"], params.slug)}`} className="block w-full" aria-disabled={blocked}>
              <Button variant="primary" size="large" className="w-full" disabled={blocked}>Commit Funds</Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-[18px] font-medium text-ink-primary">{title}</h2>
      <p className="mt-2 text-[14px] leading-6 text-ink-secondary">{text}</p>
    </section>
  );
}
