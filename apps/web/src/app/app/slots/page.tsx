import { AppShell } from "@/components/app-shell";
import { apiRoutes } from "@/lib/api/client";

const slotRoutes = [
  ["GET", apiRoutes.slots, "Read owned batch slots"],
  ["POST", apiRoutes.slotListings, "List an owned slot for transfer"],
  ["GET", apiRoutes.slotPnl, "Read realized and listed-slot P/L"],
  ["POST", "/api/slots/listings/:listingId/purchase", "Purchase a listed slot"],
];

export default function SlotsPage() {
  return (
    <AppShell title="My slots" eyebrow="Transferable batch positions">
      <section className="rounded-3xl border border-line bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Slots are real batch rights</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              A slot is the user&apos;s allocation inside a live batch. It carries quantity, entry price, delivery rights, refund path, and transfer lock rules. This page is the basic frontend anchor for slot ownership and resale.
            </p>
          </div>
          <span className="rounded-full bg-surface px-4 py-2 text-xs font-medium text-muted">API connected</span>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Own", "Slots are created after a buyer commitment."],
          ["List", "A user can list transferable quantity before delivery lock."],
          ["Lock", "Transfers stop when delivery allocation begins."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-3xl border border-line bg-white p-5">
            <h3 className="font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-white p-5">
        <h3 className="font-semibold text-ink">API connection points</h3>
        <div className="mt-4 grid gap-3">
          {slotRoutes.map(([method, path, purpose]) => (
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
