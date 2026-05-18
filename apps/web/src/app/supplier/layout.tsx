import * as React from "react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Target, Wallet } from "lucide-react";

const SUPPLIER_NAV = [
  { href: "/supplier", label: "Dashboard", icon: LayoutDashboard },
  { href: "/supplier/batches/new", label: "Create Batch", icon: PlusCircle },
  { href: "/supplier/milestones", label: "Milestones", icon: Target },
  { href: "/supplier/wallet", label: "Wallet & Payouts", icon: Wallet },
];

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-canvas font-sans text-ink-primary">
      
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-border bg-surface shrink-0 h-screen sticky top-0">
        <div className="p-6 h-[88px] flex items-center border-b border-border">
          <Link href="/" className="font-display font-bold text-xl tracking-tight text-ink-primary">Batch <span className="text-brand-action">Supplier</span></Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {SUPPLIER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-colors">
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Topbar (Mobile) */}
      <header className="md:hidden flex items-center justify-between px-6 h-[64px] border-b border-border bg-surface shrink-0 sticky top-0 z-20">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-ink-primary">Batch</Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar for desktop padding consistency */}
        <header className="hidden md:flex items-center px-8 h-[88px] shrink-0 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-[18px] font-medium text-ink-primary">Supplier Portal</h1>
        </header>

        <div className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden flex items-center justify-around h-[64px] border-t border-border bg-surface sticky bottom-0 z-20 shrink-0 px-2 pb-safe">
        {SUPPLIER_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full text-ink-secondary hover:text-ink-primary">
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
