import { AppShell } from "@/components/app-shell";

const disputes = [
  ["Wrong quantity claim", "School uniform batch", "Open", "Buyer says allocation count is short"],
  ["Delivery delay", "Shenzhen charger restock", "Watching", "Import batch has not cleared yet"],
];

export default function DisputesConsolePage() {
  return (
    <AppShell title="Dispute center" eyebrow="Operator console">
      <div className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Open disputes</h2>
        <p className="mt-2 text-sm text-muted">Disputes block final settlement until resolved by rule or operator review.</p>
        <div className="mt-5 space-y-3">
          {disputes.map(([title, batch, status, note]) => (
            <div key={title} className="rounded-2xl bg-surface p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{batch} · {note}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-muted">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
