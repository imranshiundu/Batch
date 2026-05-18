import * as React from "react";
import Link from "next/link";
import { Shield, BarChart2, FileSpreadsheet, History, Settings } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: Shield },
  { href: "/admin/escrow", label: "Escrow Ledger", icon: BarChart2 },
  { href: "/admin/disputes", label: "Disputes", icon: FileSpreadsheet },
  { href: "/admin/audit", label: "Audit Logs", icon: History },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-canvas font-sans text-ink-primary">
      
      {/* Admin Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-border bg-surface shrink-0 h-screen sticky top-0">
        <div className="p-6 h-[88px] flex items-center border-b border-border">
          <Link href="/" className="font-display font-bold text-xl tracking-tight text-ink-primary">
            Batch <span className="text-semantic-warning">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[14px] font-medium text-ink-secondary hover:text-ink-primary hover:bg-surface-raised transition-colors"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border bg-canvas">
          <span className="text-[11px] font-mono text-ink-secondary uppercase tracking-wide">System Control</span>
        </div>
      </aside>

      {/* Topbar (Mobile) */}
      <header className="md:hidden flex items-center justify-between px-6 h-[64px] border-b border-border bg-surface shrink-0 sticky top-0 z-20">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-ink-primary">Batch Admin</Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="hidden md:flex items-center px-8 h-[88px] shrink-0 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-[18px] font-medium text-ink-primary">Internal Control Room</h1>
        </header>

        <div className="flex-1 overflow-x-hidden p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}
