import Link from "next/link";
import type { Batch } from "@/lib/data";
import { progress, savings } from "@/lib/data";
import { money } from "@/lib/utils";

export function BatchCard({ batch }: { batch: Batch }) {
  const pct = progress(batch);

  return (
    <Link
      href={`/batches/${batch.slug}`}
      className="group block rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{batch.type.replaceAll("_", " ")}</p>
          <h3 className="mt-2 text-lg font-semibold text-ink">{batch.title}</h3>
          <p className="mt-1 text-sm text-muted">{batch.location}</p>
        </div>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink">{batch.status}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 rounded-2xl bg-surface p-3 text-sm">
        <div>
          <p className="text-muted">Batch price</p>
          <p className="font-semibold text-ink">{money(batch.batchPrice, batch.currency)}</p>
        </div>
        <div>
          <p className="text-muted">Savings</p>
          <p className="font-semibold text-ink">{savings(batch)}%</p>
        </div>
        <div>
          <p className="text-muted">Risk</p>
          <p className="font-semibold text-ink">{batch.riskLevel}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted">{batch.committedUnits} / {batch.minimumUnits} units committed</span>
          <span className="font-medium text-ink">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted">{batch.deadline}</span>
        <span className="font-medium text-accent group-hover:underline">View deal room</span>
      </div>
    </Link>
  );
}
