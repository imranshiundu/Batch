import { AppShell } from "@/components/app-shell";

const ledger = [
  ["BUYER_COMMITMENT_HOLD", "Shenzhen charger restock", "$42.00", "Protected"],
  ["BUYER_COMMITMENT_HOLD", "School uniform batch", "$160.00", "Cleared"],
  ["REFUND_PENDING", "Failed demo batch", "$24.00", "Pending"],
];

export default function WalletPage() {
  return (
    <AppShell title="Wallet and escrow" eyebrow="Demo ledger">
      <div className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Escrow activity</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          {ledger.map(([type, batch, amount, status]) => (
            <div key={`${type}-${batch}`} className="grid gap-3 border-b border-line p-4 text-sm last:border-b-0 md:grid-cols-[1fr_1fr_120px_120px]">
              <span className="font-medium text-ink">{type}</span>
              <span className="text-muted">{batch}</span>
              <span className="font-medium text-ink">{amount}</span>
              <span className="text-muted">{status}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">This is a mock ledger screen. Real Circle/Arc payment events will be added after the domain state machine is wired.</p>
      </div>
    </AppShell>
  );
}
