import Link from "next/link";

const steps = [
  ["A supplier proposes a batch", "500 fast chargers at wholesale price if buyers commit before the deadline."],
  ["Buyers commit funds", "Each buyer chooses quantity and delivery method. Every commitment maps to a separate allocation."],
  ["The batch clears", "When the minimum threshold is reached, the supplier confirmation window starts."],
  ["Milestones protect the deal", "Supplier proof unlocks staged payouts. No full blind upfront release."],
  ["Goods are allocated", "The bulk order is split into individual buyer records, deliveries, and pickup codes."],
  ["The deal settles", "Final payout happens after delivery confirmation or dispute window closure."],
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <Link href="/" className="text-sm font-medium text-muted">← Back home</Link>
        <section className="mt-10 rounded-[2rem] border border-line bg-surface p-6 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted">Demo flow</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">One bulk deal. Many individual orders. One protected clearing path.</h1>
          <p className="mt-5 max-w-2xl text-muted leading-7">This demo shows the Batch mechanic without live payments. The purpose is to prove the product shape before integrating real escrow, Circle, Arc, logistics, and local payment rails.</p>
        </section>

        <section className="mt-8 grid gap-4">
          {steps.map(([title, body], index) => (
            <div key={title} className="grid gap-4 rounded-3xl border border-line bg-white p-5 md:grid-cols-[80px_1fr]">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-ink text-sm font-semibold text-white">{index + 1}</div>
              <div>
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="mt-2 text-muted leading-7">{body}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
