import Link from "next/link";
import { notFound } from "next/navigation";
import { batches } from "@/lib/data";
import { money } from "@/lib/utils";

export function generateStaticParams() {
  return batches.map((batch) => ({ batchId: batch.slug }));
}

export default function CommitFlowPage({ params }: { params: { batchId: string } }) {
  const batch = batches.find((item) => item.slug === params.batchId);

  if (!batch) notFound();

  const sampleUnits = 10;
  const sampleTotal = sampleUnits * batch.batchPrice;

  return (
    <main className="min-h-screen bg-surface px-5 py-8 text-ink md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href={`/batches/${batch.slug}`} className="text-sm font-medium text-muted">← Back to deal room</Link>
        <div className="mt-6 rounded-[2rem] border border-line bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Commit flow</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Reserve your allocation</h1>
          <p className="mt-3 text-muted">This is a frontend shell. No real payment is collected here yet. The flow is designed for the future escrow ledger and Circle/Arc adapters.</p>

          <div className="mt-8 grid gap-4">
            {[
              ["1", "Choose quantity", `${sampleUnits} units selected for the demo.`],
              ["2", "Select delivery", batch.deliveryMode],
              ["3", "Review refund rule", "If the batch fails before clearing, funds return automatically."],
              ["4", "Confirm commitment", "A commitment receipt and allocation record will be created."],
            ].map(([number, title, body]) => (
              <div key={number} className="flex gap-4 rounded-3xl border border-line p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface text-sm font-semibold">{number}</span>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="mt-1 text-sm text-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl bg-surface p-5">
            <div className="flex justify-between text-sm"><span className="text-muted">Batch</span><span className="font-medium">{batch.title}</span></div>
            <div className="mt-3 flex justify-between text-sm"><span className="text-muted">Unit price</span><span className="font-medium">{money(batch.batchPrice, batch.currency)}</span></div>
            <div className="mt-3 flex justify-between text-sm"><span className="text-muted">Demo quantity</span><span className="font-medium">{sampleUnits}</span></div>
            <div className="mt-4 border-t border-line pt-4 flex justify-between"><span className="font-semibold">Demo total</span><span className="font-semibold">{money(sampleTotal, batch.currency)}</span></div>
          </div>

          <button className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">Create demo commitment</button>
        </div>
      </div>
    </main>
  );
}
