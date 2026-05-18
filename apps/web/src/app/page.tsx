import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Layers, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-canvas text-ink-primary font-sans flex flex-col items-center">
      <header className="w-full max-w-[680px] h-[64px] flex items-center justify-between px-4">
        <div className="font-display font-bold text-xl tracking-tight">Batch</div>
        <Link href="/login" className="text-[14px] font-medium text-ink-secondary hover:text-ink-primary transition-colors">
          Log in
        </Link>
      </header>

      <div className="w-full max-w-[680px] px-4 flex-1 flex flex-col justify-center py-20">
        <section className="text-center flex flex-col items-center">
          <h1 className="font-display text-[32px] md:text-[36px] font-bold leading-tight tracking-[-0.03em] text-ink-primary">
            Conditional Group Commerce
          </h1>
          <p className="mt-4 text-[16px] text-ink-secondary leading-relaxed max-w-md">
            Buy together. Pay only when the deal clears.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link href="/batches">
              <Button variant="primary" size="large">Join a Batch</Button>
            </Link>
            <Link href="/demo">
              <Button variant="ghost" size="large">Learn how it works</Button>
            </Link>
          </div>
        </section>

        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-16">
          <div className="flex flex-col items-center">
            <Lock className="w-6 h-6 text-ink-primary mb-4" strokeWidth={1.5} />
            <h3 className="text-[16px] font-medium text-ink-primary">Escrow</h3>
            <p className="mt-2 text-[14px] text-ink-secondary leading-relaxed">
              Funds are locked securely until the batch target is reached.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Layers className="w-6 h-6 text-ink-primary mb-4" strokeWidth={1.5} />
            <h3 className="text-[16px] font-medium text-ink-primary">Commitment</h3>
            <p className="mt-2 text-[14px] text-ink-secondary leading-relaxed">
              Real demand triggers the deal, not blind upfront purchasing.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Truck className="w-6 h-6 text-ink-primary mb-4" strokeWidth={1.5} />
            <h3 className="text-[16px] font-medium text-ink-primary">Delivery</h3>
            <p className="mt-2 text-[14px] text-ink-secondary leading-relaxed">
              Suppliers fulfill orders directly to individual buyers.
            </p>
          </div>
        </section>
      </div>

      <footer className="w-full max-w-[680px] px-4 py-8 flex justify-center gap-6 border-t border-border">
        <Link href="/supplier" className="text-[13px] text-ink-secondary hover:text-ink-primary">For Suppliers</Link>
        <Link href="/developers" className="text-[13px] text-ink-secondary hover:text-ink-primary">Developers</Link>
        <Link href="/admin" className="text-[13px] text-ink-secondary hover:text-ink-primary">Operator</Link>
      </footer>
    </main>
  );
}
