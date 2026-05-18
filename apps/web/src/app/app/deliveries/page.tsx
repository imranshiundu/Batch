import { AppShell } from "@/components/app-shell";

const deliveries = [
  ["Shenzhen charger restock", "Hub pickup", "Allocation pending", "Pickup code after hub receipt"],
  ["School uniform batch", "School pickup hub", "Supplier confirming", "Sizing proof required first"],
  ["Salon beauty stock", "Merchant allocation", "Dispatch pending", "Carton split after warehouse scan"],
];

export default function DeliveriesPage() {
  return (
    <AppShell title="Deliveries" eyebrow="Buyer allocations">
      <div className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Allocation tracking</h2>
        <p className="mt-2 text-sm text-muted">Every buyer gets a separate allocation record after a batch clears. Bulk order, individual delivery trail.</p>
        <div className="mt-5 space-y-3">
          {deliveries.map(([batch, mode, status, note]) => (
            <div key={batch} className="rounded-2xl bg-surface p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{batch}</h3>
                  <p className="mt-1 text-sm text-muted">{mode} · {note}</p>
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
