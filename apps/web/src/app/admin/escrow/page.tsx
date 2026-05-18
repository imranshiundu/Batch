import { AppShell } from "@/components/app-shell";

const entries = [
  ["BUYER_COMMITMENT_HOLD", "Shenzhen charger restock", "$42.00", "Recorded"],
  ["SUPPLIER_MILESTONE_RELEASE", "Salon beauty stock", "$1,220.00", "Awaiting proof"],
  ["REFUND", "Failed sample batch", "$24.00", "Queued"],
  ["PLATFORM_FEE", "School uniform batch", "$18.00", "Pending settlement"],
];

export default function EscrowConsolePage() {
  return (
    <AppShell title="Escrow ledger" eyebrow="Operator console">
      <div className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Ledger events</h2>
        <p className="mt-2 text-sm text-muted">This screen previews the auditable money movement model before live Circle or Arc events are connected.</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          {entries.map(([type, batch, amount, status]) => (
            <div key={`${type}-${batch}`} className="grid gap-3 border-b border-line p-4 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_120px_160px]">
              <span className="font-medium text-ink">{type}</span>
              <span className="text-muted">{batch}</span>
              <span className="font-medium text-ink">{amount}</span>
              <span className="text-muted">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
