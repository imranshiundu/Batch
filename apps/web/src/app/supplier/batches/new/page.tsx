import { AppShell } from "@/components/app-shell";

const fields = [
  ["Batch title", "Example: Shenzhen 20W Charger Restock"],
  ["Minimum units", "The threshold required before the deal clears"],
  ["Price tiers", "Better prices as more buyers commit"],
  ["Commit deadline", "No endless waiting"],
  ["Delivery plan", "Direct, hub pickup, or merchant allocation"],
  ["Milestone plan", "Proof required before payout release"],
];

export default function NewSupplierBatchPage() {
  return (
    <AppShell title="Create batch" eyebrow="Supplier draft">
      <section className="rounded-[2rem] border border-line bg-white p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Propose a conditional deal</h2>
        <p className="mt-3 max-w-2xl text-muted">This shell defines the supplier creation flow. Suppliers do not list products. They create threshold-based deals with proof, deadlines, and milestone payout rules.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {fields.map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-line p-5">
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </div>
          ))}
        </div>
        <button className="mt-8 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Save demo draft</button>
      </section>
    </AppShell>
  );
}
