"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Bell, Layers, Briefcase, Wallet, Truck, User, ArrowLeftRight } from "lucide-react";
import { cn } from "@/components/ui/button";

const sidebarLinks = [
  { href: "/batches", label: "Batches", icon: Layers },
  { href: "/app/my-batches", label: "My Commitments", icon: Briefcase },
  { href: "/app/slots", label: "Slot Market", icon: ArrowLeftRight },
  { href: "/app/wallet", label: "Wallet", icon: Wallet },
  { href: "/app/deliveries", label: "Deliveries", icon: Truck },
  { href: "/app/profile", label: "Profile", icon: User },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-canvas flex font-sans text-ink-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r border-line bg-surface h-screen sticky top-0">
        <div className="h-[64px] flex items-center px-6 border-b border-line">
          <Link href="/app" className="font-display font-bold text-xl tracking-tight">Batch</Link>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-[6px] text-[14px] transition-colors",
                  isActive 
                    ? "bg-surface-raised font-medium text-ink-primary" 
                    : "text-ink-secondary hover:bg-surface-raised hover:text-ink-primary"
                )}
              >
                <Icon className="w-[20px] h-[20px]" strokeWidth={isActive ? 2 : 1.5} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-[64px] border-b border-line bg-surface flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="md:hidden font-display font-bold text-lg">Batch</div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-ink-secondary hover:text-ink-primary relative">
              <Bell className="w-5 h-5" strokeWidth={1.5} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-semantic-escrow rounded-full"></span>
            </button>
            <Avatar name="Jane Doe" userId="user_jd123" size="default" />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Bar (Approximation of collapse) */}
      <div className="md:hidden fixed bottom-0 w-full h-[64px] bg-surface border-t border-line flex items-center justify-around px-2 z-20">
        {sidebarLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1">
              <Icon className={cn("w-6 h-6", isActive ? "text-ink-primary" : "text-ink-secondary")} strokeWidth={isActive ? 2 : 1.5} />
              <span className={cn("text-[10px]", isActive ? "font-medium text-ink-primary" : "text-ink-secondary")}>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
