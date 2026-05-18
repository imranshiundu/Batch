import { AppShell } from "@/components/app-shell";
import { apiRoutes } from "@/lib/api/client";

const routes = [
  ["GET", apiRoutes.marketInstruments, "List batch instruments"],
  ["GET", "/api/market/instruments/:symbol/depth", "Read available capacity and slot depth"],
  ["POST", apiRoutes.marketOrders, "Submit a commitment instruction"],
  ["POST", apiRoutes.buyerCommitments, "Create the actual buyer commitment"],
  ["GET", apiRoutes.developerManifest, "Read bot integration rules"],
  ["GET", apiRoutes.developerApiMap, "Read API surface"],
];

export default function DevelopersPage() {
  return (
    <AppShell title="Developer access" eyebrow="Bots and integrations">
      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Connect bots without breaking Batch</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          External bots can read batch data, inspect depth, and submit commitment instructions. They cannot bypass clearing, escrow, supplier proof, payout approval, delivery allocation, or refund rules.
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-white p-5">
        <h3 className="font-semibold text-ink">Core routes</h3>
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

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white p-5">
          <h3 className="font-semibold text-ink">Allowed</h3>
          <p className="mt-2 text-sm leading-6 text-muted">Read batches, read depth, create commitment instructions, and later manage transferable allocation slots.</p>
        </div>
        <div className="rounded-3xl border border-line bg-white p-5">
          <h3 className="font-semibold text-ink">Blocked</h3>
          <p className="mt-2 text-sm leading-6 text-muted">No forced settlement, no payout bypass, no direct fund custody, no synthetic securities, no trades outside batch rules.</p>
        </div>
      </section>
    </AppShell>
  );
}
