import { AppShell } from "@/components/app-shell";
import { batches } from "@/lib/data";
import { money } from "@/lib/utils";

export default function MyBatchesPage() {
  return (
    <AppShell title="My deals" eyebrow="Buyer commitments">
      <div className="space-y-4">
        {batches.slice(0, 2).map((batch, index) => (
          <div key={batch.slug} className="rounded-3xl border border-line bg-white p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Commitment #{index + 1}</p>
                <h2 className="mt-2 text-xl font-semibold text-ink">{batch.title}</h2>
                <p className="mt-1 text-sm text-muted">Status: {batch.status} · Delivery: {batch.deliveryWindow}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4 text-sm md:min-w-56">
                <div className="flex justify-between"><span className="text-muted">Units</span><span className="font-medium">10</span></div>
                <div className="mt-2 flex justify-between"><span className="text-muted">Protected</span><span className="font-medium">{money(batch.batchPrice * 10, batch.currency)}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
