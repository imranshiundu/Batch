import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatusTimeline } from "@/components/status-timeline";
import { batches, progress, savings } from "@/lib/data";
import { money } from "@/lib/utils";

export function generateStaticParams() {
  return batches.map((batch) => ({ slug: batch.slug }));
}

export default function BatchDealRoomPage({ params }: { params: { slug: string } }) {
  const batch = batches.find((item) => item.slug === params.slug);

  if (!batch) notFound();

  const pct = progress(batch);

  return (
    <AppShell title="Batch deal room" eyebrow={batch.status}>
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{batch.type.replaceAll("_", " ")}</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink">{batch.title}</h2>
            <p className="mt-3 max-w-2xl text-muted">{batch.summary}</p>

            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-muted">Batch price</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{money(batch.batchPrice, batch.currency)}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-muted">Market price</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{money(batch.normalPrice, batch.currency)}</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-muted">Savings</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{savings(batch)}%</p>
              </div>
              <div className="rounded-2xl bg-surface p-4">
                <p className="text-sm text-muted">Risk</p>
                <p className="mt-2 text-2xl font-semibold text-ink">{batch.riskLevel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-ink">Progress to clearing</h3>
                <p className="mt-1 text-sm text-muted">{batch.committedUnits} of {batch.minimumUnits} minimum units committed</p>
              </div>
              <span className="text-2xl font-semibold text-ink">{pct}%</span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-line p-4 text-sm"><span className="text-muted">Deadline</span><p className="mt-1 font-medium text-ink">{batch.deadline}</p></div>
              <div className="rounded-2xl border border-line p-4 text-sm"><span className="text-muted">Delivery</span><p className="mt-1 font-medium text-ink">{batch.deliveryWindow}</p></div>
              <div className="rounded-2xl border border-line p-4 text-sm"><span className="text-muted">Mode</span><p className="mt-1 font-medium text-ink">{batch.deliveryMode}</p></div>
            </div>
          </div>

          <StatusTimeline steps={batch.milestones} />
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-line bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-ink">Commit to this batch</h3>
            <p className="mt-2 text-sm leading-6 text-muted">Your funds are recorded against your own allocation. If the deal does not clear, the refund path starts automatically.</p>
            <div className="mt-5 rounded-2xl bg-surface p-4 text-sm">
              <p className="text-muted">Escrow status</p>
              <p className="mt-1 font-medium text-ink">{batch.escrowStatus}</p>
            </div>
            <Link href={`/commit/${batch.slug}`} className="mt-5 block rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-white">Commit units</Link>
          </div>

          <div className="rounded-3xl border border-line bg-white p-5">
            <h3 className="font-semibold text-ink">Supplier</h3>
            <p className="mt-2 text-sm text-muted">{batch.supplier}</p>
            <p className="mt-3 text-sm text-muted">Supplier payouts are milestone-based. No full blind upfront release.</p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
