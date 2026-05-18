import { AppShell } from "@/components/app-shell";
import { listBatchInstruments } from "@/lib/market/market-service";

export default function MarketPage() {
  const instruments = listBatchInstruments();

  return (
    <AppShell title="Batch market" eyebrow="Commitment access">
      <section className="rounded-3xl border border-line bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Tradable batch instruments</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              This is not a stock exchange. A market instrument is a live batch that bots or users can read, commit into, and later manage as allocated slots where allowed.
            </p>
          </div>
          <span className="rounded-full bg-surface px-4 py-2 text-xs font-medium text-muted">API ready</span>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-muted">
              <tr className="border-b border-line">
                <th className="py-3">Symbol</th>
                <th className="py-3">Batch</th>
                <th className="py-3">Price</th>
                <th className="py-3">Progress</th>
                <th className="py-3">Status</th>
                <th className="py-3">Access</th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((item) => (
                <tr key={item.symbol} className="border-b border-line last:border-0">
                  <td className="py-4 font-mono text-xs text-ink">{item.symbol}</td>
                  <td className="py-4 text-ink">{item.title}</td>
                  <td className="py-4 text-muted">{item.currency} {item.lastUnitPrice}</td>
                  <td className="py-4 text-muted">{item.clearingProgress}%</td>
                  <td className="py-4 text-muted">{item.status}</td>
                  <td className="py-4 text-muted">{item.tradable ? "Commitments open" : "Read only"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ["Read", "Bots fetch instruments and batch depth."],
          ["Route", "Orders become commitment instructions, not fake stock trades."],
          ["Settle", "Batch rules still control clearing, delivery, refunds, and payouts."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-3xl border border-line bg-white p-5">
            <h3 className="font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
