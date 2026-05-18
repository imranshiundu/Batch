import { AppShell } from "@/components/app-shell";
import { BatchCard } from "@/components/batch-card";
import { batches } from "@/lib/data";

export default function BatchesPage() {
  return (
    <AppShell title="Live batches" eyebrow="Deals forming now">
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {["Closing soon", "Best savings", "Import batches", "Low risk"].map((filter) => (
          <button key={filter} className="rounded-2xl border border-line bg-white px-4 py-3 text-left text-sm font-medium text-ink">
            {filter}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {batches.map((batch) => <BatchCard key={batch.slug} batch={batch} />)}
      </div>
    </AppShell>
  );
}
