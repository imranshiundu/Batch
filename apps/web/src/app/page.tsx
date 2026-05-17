import Link from "next/link";
import { batches } from "@/lib/data";
import { BatchCard } from "@/components/batch-card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
          <Link href="/" className="text-xl font-semibold">Batch</Link>
          <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
            <Link href="/batches">Live batches</Link>
            <Link href="/supplier">For suppliers</Link>
            <Link href="/admin">Operator</Link>
          </nav>
          <Link href="/app" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">Open app</Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Conditional commerce</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">Buy together. Pay only when the deal clears.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Batch lets buyers commit funds into live group deals. If enough demand forms before the deadline, the batch clears, suppliers fulfill the order, and each buyer receives their own allocation. If the deal fails, funds return automatically.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/batches" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white">View live batches</Link>
            <Link href="/demo" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink">View demo flow</Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-surface p-4 shadow-soft">
          <BatchCard batch={batches[0]} />
          <div className="mt-4 rounded-3xl bg-white p-5 text-sm text-muted">
            <p className="font-medium text-ink">How this deal clears</p>
            <p className="mt-2">Funds stay protected until the minimum units are committed. Supplier payouts happen by milestone, not blind upfront payment.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-4 md:px-8">
          {["Commit", "Clear", "Fulfill", "Deliver"].map((item, index) => (
            <div key={item} className="rounded-3xl bg-white p-5">
              <p className="text-sm text-muted">0{index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold">{item}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{["Buyers lock real demand into a batch.", "The deal only starts when the threshold is reached.", "Suppliers submit proof before milestone releases.", "Every buyer receives an individual allocation."][index]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Not a store</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Batch is a deal-clearing app.</h2>
          <p className="mt-4 text-muted leading-7">A marketplace lists products. Batch clears conditions. The product is not a cart. The product is the commitment, threshold, escrow, milestone, allocation, delivery, and refund path.</p>
        </div>
      </section>
    </main>
  );
}
