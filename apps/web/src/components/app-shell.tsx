import Link from "next/link";
import type { ReactNode } from "react";
import { Boxes, ChartNoAxesCombined, CircleDollarSign, Code2, Home, KeyRound, PackageCheck, Shield, Truck, UserRound, Wallet } from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/app", icon: Home },
  { label: "Batches", href: "/batches", icon: Boxes },
  { label: "My Slots", href: "/app/slots", icon: ChartNoAxesCombined },
  { label: "Slot Orders", href: "/app/slot-orders", icon: CircleDollarSign },
  { label: "My Commitments", href: "/app/my-batches", icon: PackageCheck },
  { label: "Wallet", href: "/app/wallet", icon: Wallet },
  { label: "Deliveries", href: "/app/deliveries", icon: Truck },
  { label: "Profile", href: "/app/profile", icon: UserRound },
  { label: "Developers", href: "/developers", icon: Code2 },
  { label: "API Keys", href: "/developers/api-keys", icon: KeyRound },
  { label: "Supplier", href: "/supplier", icon: PackageCheck },
  { label: "Admin", href: "/admin", icon: Shield },
];

export function AppShell({ children, title, eyebrow }: { children: ReactNode; title: string; eyebrow?: string }) {
  return (
    <main className="min-h-screen bg-canvas text-ink-primary">
      <aside className="fixed left-0 top-0 hidden h-screen w-[240px] border-r border-line bg-surface lg:flex lg:flex-col">
        <div className="flex h-[88px] items-center border-b border-line px-6">
          <Link href="/" className="font-display text-xl font-bold tracking-tight text-ink-primary">Batch</Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex min-h-[44px] items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium text-ink-secondary transition-colors hover:bg-surface-raised hover:text-ink-primary">
                <Icon className="h-5 w-5" strokeWidth={1.7} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="lg:pl-[240px]">
        <header className="sticky top-0 z-10 border-b border-line bg-surface/90 px-5 backdrop-blur md:px-8">
          <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4">
            <div>
              {eyebrow ? <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-secondary">{eyebrow}</p> : null}
              <h1 className="font-display text-[22px] font-bold tracking-[-0.02em] text-ink-primary">{title}</h1>
            </div>
            <Link href="/batches" className="inline-flex h-[44px] items-center rounded-[6px] bg-brand-action px-4 text-[14px] font-medium text-white transition-all hover:-translate-y-[1px] hover:bg-brand-hover">Commit</Link>
          </div>
        </header>
        <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">{children}</div>
      </section>
    </main>
  );
}
