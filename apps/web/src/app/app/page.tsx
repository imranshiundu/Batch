import { AppShell } from "@/components/app-shell";
import { BatchCard } from "@/components/batch-card";
import { batches, dashboardStats } from "@/lib/data";

export default function BuyerDashboardPage() {
  return (
    <AppShell title="Buyer dashboard" eyebrow="Good morning">
      <div className="grid gap-4 md:grid-cols-4">
        {dashboardStats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-ink">Batches closing soon</h2>
            <span className="text-sm text-muted">Seeded demo data</span>
          </div>
          <div className="grid gap-4">
            {batches.map((batch) => <BatchCard key={batch.slug} batch={batch} />)}
          </div>
        </div>
        <aside className="rounded-3xl border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">Your active deal path</h2>
          <div className="mt-5 space-y-4">
            {["Commitment received", "Batch waiting to clear", "Funds protected", "Delivery allocation pending"].map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-surface p-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-semibold">{index + 1}</span>
                <span className="text-sm text-muted">{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
