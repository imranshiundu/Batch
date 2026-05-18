import { AppShell } from "@/components/app-shell";
import { apiRoutes } from "@/lib/api/client";

const accounts = [
  ["BATCH_ESCROW", "Buyer money held for the batch before release or refund."],
  ["SUPPLIER_PAYABLE", "Money owed to the supplier after approved milestones."],
  ["LOGISTICS_PAYABLE", "Money owed to shipping, hub, customs, or last-mile operators."],
  ["PLATFORM_FEE", "Batch fees earned by the platform."],
  ["REFUND_RESERVE", "Money reserved for buyer refunds and failed deals."],
  ["SPV_CONTROL", "Operational control account that can later map to a legal SPV or external wallet."],
];

const routes = [
  ["GET", "/api/operator/batches/:slug/ledger-accounts", "Read segregated accounts for a batch"],
  ["POST", "/api/operator/batches/:slug/ledger-accounts", "Provision default accounts for a batch"],
  ["POST", "/api/slots/transfers/:transferId/hold", "Mark a slot transfer hold posted"],
  ["POST", "/api/slots/transfers/:transferId/complete", "Complete a held slot transfer"],
  ["GET", apiRoutes.developerApiMap, "Read current API surface"],
];

export default function FinanceOpsPage() {
  return (
    <AppShell title="Finance operations" eyebrow="Segregated accounts">
      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">SPV-ready, not SPV theatre</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Batch now separates money logic by account type. This gives operators an accounting layer that can later map to Circle wallets, bank accounts, Arc settlement, or formal SPV entities when a deal needs that structure.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map(([name, text]) => (
          <div key={name} className="rounded-3xl border border-line bg-white p-5">
            <h3 className="font-mono text-sm font-semibold text-ink">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-white p-5">
        <h3 className="font-semibold text-ink">API connection points</h3>
        <div className="mt-4 grid gap-3">
          {routes.map(([method, path, purpose]) => (
            <div key={`${method}-${path}`} className="grid gap-2 rounded-2xl bg-surface p-4 md:grid-cols-[90px_1fr_1.2fr]">
              <span className="font-mono text-xs font-semibold text-ink">{method}</span>
              <span className="font-mono text-xs text-muted">{path}</span>
              <span className="text-sm text-muted">{purpose}</span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
