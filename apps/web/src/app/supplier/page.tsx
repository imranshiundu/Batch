"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { batchApi } from "@/lib/api/client";
import { EmptyState, ErrorState, formatMoney, LoadingState, PageHeading, ProgressBar, readArray, readNumber, readText, Surface, type JsonRecord } from "@/components/ui/data-state";

const STATES = ["DRAFT", "OPEN", "FUNDED", "PRODUCTION", "SHIPPED", "SETTLED"];

export default function CreatedBatchesPage() {
  const [data, setData] = React.useState<JsonRecord | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    batchApi.listSupplierBatches()
      .then((result) => {
        if (!mounted) return;
        if (!result.ok) return setError(result.error?.message ?? "Created batches endpoint returned an error.");
        setData((result.data ?? {}) as JsonRecord);
      })
      .catch((err: Error) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const batches = readArray<JsonRecord>(data, ["batches", "items", "data"]);
  const currency = readText(data, ["currency", "defaultCurrency"], "USD");
  const activeCount = batches.filter((batch) => !["SETTLED", "CANCELLED", "FAILED"].includes(readText(batch, ["status", "state"], "").toUpperCase())).length;
  const committedUnits = batches.reduce((sum, batch) => sum + readNumber(batch, ["committedUnits", "reservedUnits", "unitsCommitted"], 0), 0);
  const pendingPayouts = batches.reduce((sum, batch) => sum + readNumber(batch, ["pendingPayout", "pendingPayoutAmount", "payoutPending"], 0), 0);

  return (
    <div className="space-y-8">
      <PageHeading eyebrow="Batch creator workspace" title="Created Batches" copy="Anyone with a verified product can submit and manage batches from the same main app account. This is not a separate supplier portal." action={<Link href="/app/create-batch"><Button size="sm">Create Batch</Button></Link>} />

      {loading ? <LoadingState rows={4} /> : null}
      {error ? <ErrorState message={error} /> : null}

      {!loading && !error ? (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Surface className="p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-secondary">Active batches</p><p className="mt-3 font-mono text-[34px] font-semibold tracking-[-0.04em] text-ink-primary">{activeCount}</p></Surface>
            <Surface className="p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-secondary">Committed units</p><p className="mt-3 font-mono text-[34px] font-semibold tracking-[-0.04em] text-ink-primary">{committedUnits.toLocaleString()}</p></Surface>
            <Surface className="p-6"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-secondary">Pending payouts</p><p className="mt-3 font-mono text-[34px] font-semibold tracking-[-0.04em] text-ink-primary">{formatMoney(pendingPayouts, currency)}</p></Surface>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between"><h2 className="text-[18px] font-semibold tracking-[-0.02em] text-ink-primary">Deal pipeline</h2><p className="text-[13px] text-ink-secondary">Live states from the batch backend.</p></div>
            {batches.length ? <Pipeline batches={batches} currency={currency} /> : <EmptyState title="No created batches yet." copy="Create a batch when you have a real product, threshold, delivery plan, and proof requirements ready." />}
          </section>
        </>
      ) : null}
    </div>
  );
}

function Pipeline({ batches, currency }: { batches: JsonRecord[]; currency: string }) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid min-w-[1080px] grid-cols-6 gap-3">
        {STATES.map((state) => {
          const rows = batches.filter((batch) => readText(batch, ["status", "state"], "DRAFT").toUpperCase() === state);
          return <div key={state} className="min-h-[520px] rounded-3xl border border-black/10 bg-black/[0.03]"><div className="flex items-center justify-between border-b border-black/10 p-4"><span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-secondary">{state}</span><Badge variant={rows.length ? "default" : "neutral"}>{rows.length}</Badge></div><div className="space-y-3 p-3">{rows.map((batch) => <BatchCard key={readText(batch, ["id", "slug", "title"])} batch={batch} currency={currency} />)}</div></div>;
        })}
      </div>
    </div>
  );
}

function BatchCard({ batch, currency }: { batch: JsonRecord; currency: string }) {
  const slug = readText(batch, ["slug", "id"], "batch");
  const progress = readNumber(batch, ["progress", "clearingProgress", "committedPercent"], 0);
  return (
    <Link href={`/app/batches/${slug}`} className="block rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-[14px] font-semibold leading-5 text-ink-primary">{readText(batch, ["title", "name"], "Untitled batch")}</h3>
      <div className="mt-3"><ProgressBar value={progress} /></div>
      <div className="mt-3 grid gap-1 text-[12px] text-ink-secondary">
        <span>{readNumber(batch, ["committedUnits", "reservedUnits"], 0)} / {readNumber(batch, ["thresholdUnits", "targetUnits"], 0)} units</span>
        <span className="font-mono text-ink-primary">{formatMoney(readNumber(batch, ["unitPrice", "price"], 0), readText(batch, ["currency"], currency))} unit</span>
        <span>{readText(batch, ["nextAction", "actionRequired"], "No action required")}</span>
      </div>
    </Link>
  );
}
