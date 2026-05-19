import Link from "next/link";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { batchApi } from "@/lib/api/client";
import { CanonicalStatus, EmptyState, ErrorState, formatMoney, normalizedProgress, ProgressBar, readArray, readNumber, readText } from "@/components/ui/data-state";

export const dynamic = "force-dynamic";

type BatchRow = Record<string, unknown>;

export default async function BatchesMarketPage() {
  const response = await batchApi.listBatches().catch((error: Error) => ({ ok: false, data: null, error: { message: error.message }, meta: {} }));
  const batches = readArray<BatchRow>(response.data, ["batches", "items", "data"]).filter((batch) => readText(batch, ["status"], "OPEN") !== "CANCELLED");

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-6 md:flex-row md:items-start md:px-6 md:py-8">
      <aside className="w-full shrink-0 rounded-[12px] border border-line bg-surface p-5 shadow-ui md:sticky md:top-[88px] md:w-[240px]">
        <div className="flex items-center justify-between md:block">
          <h2 className="text-[14px] font-medium uppercase tracking-wide text-ink-primary">Filters</h2>
          <Filter className="h-4 w-4 text-ink-secondary md:hidden" />
        </div>
        <FilterGroup title="Category" items={["IMPORT", "LOCAL", "COMMUNITY", "MERCHANT"]} />
        <FilterGroup title="Risk Level" items={["Low", "Medium", "High"]} chips />
        <FilterGroup title="Deadline" items={["Closing Today", "This Week"]} radio />
        <FilterGroup title="Delivery Mode" items={["Hub Pickup", "Direct Delivery"]} />
      </aside>

      <main className="flex-1 space-y-3">
        <div className="mb-2 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-secondary">Live Batches</p>
            <h1 className="font-display text-[32px] font-bold tracking-[-0.03em] text-ink-primary">Market feed</h1>
            <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-secondary">Browse open group deals by commitment progress, delivery mode, risk, and price. This is a batch feed, not a product grid.</p>
          </div>
          <Badge variant="default">{batches.length} visible</Badge>
        </div>

        {!response.ok ? <ErrorState message={response.error?.message ?? "Batches temporarily unavailable. Try refreshing."} /> : null}
        {response.ok && batches.length === 0 ? <EmptyState title="No open batches." copy="No backend batches are available for the current market feed." /> : null}
        {response.ok ? batches.map((batch) => <DealCard key={readText(batch, ["id", "slug", "title"])} batch={batch} />) : null}
      </main>
    </div>
  );
}

function FilterGroup({ title, items, chips = false, radio = false }: { title: string; items: string[]; chips?: boolean; radio?: boolean }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-secondary">{title}</h3>
      <div className={chips ? "flex flex-wrap gap-2" : "flex flex-col gap-2"}>
        {items.map((item) => chips ? (
          <span key={item} className="inline-flex h-[28px] items-center rounded-full bg-surface-raised px-3 text-[12px] font-medium text-ink-secondary">{item}</span>
        ) : (
          <label key={item} className="flex min-h-[32px] cursor-pointer items-center gap-2 text-[14px] text-ink-primary">
            <input type={radio ? "radio" : "checkbox"} name={title} className="border-line text-semantic-escrow focus:ring-line-focus" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DealCard({ batch }: { batch: BatchRow }) {
  const title = readText(batch, ["title", "name"]);
  const slug = readText(batch, ["slug", "id"], "batch");
  const status = readText(batch, ["status"], "OPEN");
  const supplier = readText(batch, ["supplierName", "supplier.businessName", "supplier", "merchantName"], "Supplier pending");
  const location = readText(batch, ["route", "location", "supplier.country"], "Route pending");
  const minimum = readNumber(batch, ["minimumUnits", "minimum", "minUnits"], 0);
  const committed = readNumber(batch, ["committedUnits", "unitsCommitted", "soldUnits"], 0);
  const progress = readNumber(batch, ["progress", "clearingProgress"], minimum > 0 ? (committed / minimum) * 100 : 0);
  const currency = readText(batch, ["currency"], "USD");
  const batchPrice = readNumber(batch, ["batchPrice", "unitPrice", "lastUnitPrice", "price"], 0);
  const normalPrice = readNumber(batch, ["normalPrice", "marketPrice", "retailPrice"], 0);
  const risk = readText(batch, ["riskLevel", "risk"], "Medium");
  const deliveryMode = readText(batch, ["deliveryMode"], "Hub Pickup");
  const deadline = readText(batch, ["deadlineLabel", "closingLabel", "deadline"], "Closing window live");
  const savings = normalPrice > 0 && batchPrice > 0 ? Math.round(((normalPrice - batchPrice) / normalPrice) * 100) : null;

  return (
    <article className="w-full rounded-[12px] border border-line bg-surface px-5 py-5 shadow-ui transition hover:border-semantic-escrow/20 hover:shadow-[0_2px_8px_rgba(28,100,242,0.08)] md:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{readText(batch, ["type", "category"], "Batch")}</Badge>
          <h2 className="text-[16px] font-medium text-ink-primary">{title}</h2>
        </div>
        <CanonicalStatus status={status} />
      </div>
      <p className="mt-2 text-[14px] text-ink-secondary">{supplier} · {location}</p>
      <div className="mt-5">
        <ProgressBar value={normalizedProgress(progress)} className="h-[8px]" />
        <p className="mt-2 text-[12px] text-ink-secondary">{committed || "—"} of {minimum || "—"} minimum committed</p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className="font-mono text-[18px] font-medium text-ink-primary">Batch Price: {formatMoney(batchPrice, currency)}</span>
        {normalPrice ? <span className="text-[14px] text-ink-secondary line-through">Normal: {formatMoney(normalPrice, currency)}</span> : null}
        {savings ? <Badge variant="success">Save {savings}%</Badge> : null}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {[deadline, deliveryMode.replaceAll("_", " "), `${risk} risk`].map((chip) => (
          <span key={chip} className="inline-flex h-[28px] items-center rounded-full bg-surface-raised px-3 text-[12px] font-medium text-ink-secondary">{chip}</span>
        ))}
      </div>
      <div className="mt-5 flex justify-end border-t border-line pt-4">
        <Link href={`/batches/${slug}`}>
          <Button variant="ghost" size="sm" className="h-[36px]">View Batch →</Button>
        </Link>
      </div>
    </article>
  );
}
