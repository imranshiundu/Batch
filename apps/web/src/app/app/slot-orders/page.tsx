import { AppShell } from "@/components/app-shell";
import { apiRoutes } from "@/lib/api/client";

const lifecycle = [
  ["1", "Create order", "Buyer submits quantity and optional limit price for a batch slot."],
  ["2", "Match listing", "Backend looks for a compatible open listing in the same batch."],
  ["3", "Reserve", "Matched listing becomes reserved and a held transfer record is created."],
  ["4", "Complete later", "Payment confirmation and transfer completion are separate next-step controls."],
];

const routes = [
  ["GET", apiRoutes.slotOrders, "List buyer slot orders"],
  ["POST", apiRoutes.slotOrders, "Create slot buy order"],
  ["POST", "/api/slots/orders/:orderId/reserve", "Reserve matched slot order"],
  ["POST", "/api/slots/orders/:orderId/cancel", "Cancel open slot order"],
];

export default function SlotOrdersPage() {
  return (
    <AppShell title="Slot orders" eyebrow="Market lifecycle">
      <section className="rounded-3xl border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">Order flow, not fake trading</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Slot orders let buyers express demand for real batch allocation rights. Matching reserves a real listing. It does not create detached price exposure.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {lifecycle.map(([step, title, text]) => (
          <div key={step} className="rounded-3xl border border-line bg-white p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">{step}</span>
            <h3 className="mt-4 font-semibold text-ink">{title}</h3>
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
