import { AppShell } from "@/components/app-shell";

const queues = [
  ["Funded batches waiting supplier confirmation", "2", "Review terms before active state"],
  ["Pending proof reviews", "4", "Production, shipping, and hub receipts"],
  ["Refund queue", "1", "Failed demo batch refund path"],
  ["Payment event failures", "0", "Mock ledger only in this shell"],
];

const riskRows = [
  ["Shenzhen 20W Charger Restock", "Medium", "Import timeline and supplier proof required"],
  ["School Uniform Batch", "Low", "Local workshop, funded, confirmation due"],
  ["Salon Beauty Stock Restock", "Low", "Milestone release active"],
];

export default function AdminConsolePage() {
  return (
    <AppShell title="Operator console" eyebrow="Internal control room">
      <div className="grid gap-4 md:grid-cols-4">
        {queues.map(([label, value, note]) => (
          <div key={label} className="rounded-3xl border border-line bg-white p-5">
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
            <p className="mt-2 text-xs text-muted">{note}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-3xl border border-line bg-white p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Batch risk monitor</h2>
            <p className="mt-1 text-sm text-muted">Operators approve batches, review proofs, pause risky deals, and control milestone releases.</p>
          </div>
          <button className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink">Export audit</button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          {riskRows.map(([batch, risk, note]) => (
            <div key={batch} className="grid gap-3 border-b border-line p-4 text-sm last:border-b-0 md:grid-cols-[1fr_120px_1.2fr_120px]">
              <span className="font-medium text-ink">{batch}</span>
              <span className="text-muted">{risk}</span>
              <span className="text-muted">{note}</span>
              <button className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink">Review</button>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
