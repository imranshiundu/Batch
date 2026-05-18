import { AppShell } from "@/components/app-shell";
import { batches } from "@/lib/data";

export default function SupplierDashboardPage() {
  return (
    <AppShell title="Supplier dashboard" eyebrow="Fulfillment control">
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-3xl border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Create a batch</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Suppliers do not list products. They propose conditional deals with thresholds, deadlines, delivery plans, proof requirements, and milestone payout rules.</p>
          <button className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Start batch draft</button>
        </section>

        <section className="rounded-3xl border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Active supplier view</h2>
          <div className="mt-5 space-y-3">
            {batches.map((batch) => (
              <div key={batch.slug} className="rounded-2xl bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-ink">{batch.title}</h3>
                    <p className="mt-1 text-sm text-muted">{batch.committedUnits} committed · {batch.status}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-muted">Proofs</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
