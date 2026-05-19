"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  ArrowLeftRight,
  Bell,
  Boxes,
  BriefcaseBusiness,
  Code2,
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  Search,
  Truck,
  UserRound,
  Wallet,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/components/ui/button";

const NAV_GROUPS = [
  {
    label: "Market",
    items: [
      { href: "/app", label: "Command Center", icon: LayoutDashboard, exact: true },
      { href: "/batches", label: "Discover Batches", icon: Search },
      { href: "/app/create-batch", label: "Create Batch", icon: PlusCircle },
      { href: "/app/batches", label: "Created Batches", icon: Archive },
    ],
  },
  {
    label: "Positions",
    items: [
      { href: "/app/my-batches", label: "My Commitments", icon: BriefcaseBusiness },
      { href: "/app/slots", label: "Slot Market", icon: ArrowLeftRight },
      { href: "/app/slot-orders", label: "Slot Orders", icon: ReceiptText },
      { href: "/app/wallet", label: "Wallet", icon: Wallet },
      { href: "/app/deliveries", label: "Deliveries", icon: Truck },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/app/profile", label: "Profile", icon: UserRound },
      { href: "/developers", label: "Developer Portal", icon: Code2 },
    ],
  },
];

const MOBILE_NAV = [
  { href: "/app", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/batches", label: "Batches", icon: Boxes },
  { href: "/app/create-batch", label: "Create", icon: PlusCircle },
  { href: "/app/wallet", label: "Wallet", icon: Wallet },
  { href: "/app/profile", label: "Profile", icon: UserRound },
];

export function UnifiedAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-ink-primary">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[268px] border-r border-black/10 bg-white/92 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-[84px] items-center justify-between border-b border-black/10 px-5">
          <Link href="/app" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black text-[13px] font-semibold text-white shadow-sm transition-transform group-hover:-translate-y-0.5">B</span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[20px] font-bold tracking-[-0.04em]">Batch</span>
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-secondary">Unified app</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-6 last:mb-0">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-secondary">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => <SidebarItem key={item.href} item={item} pathname={pathname} />)}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-black/10 p-4">
          <div className="rounded-2xl bg-black p-4 text-white shadow-lg shadow-black/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">Operator wall</p>
            <p className="mt-2 text-[13px] leading-5 text-white/78">Operator controls are separate from normal accounts and remain isolated from the main user app.</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[268px]">
        <header className="sticky top-0 z-20 border-b border-black/10 bg-white/80 px-4 backdrop-blur-xl md:px-6 lg:px-8">
          <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-4">
            <Link href="/app" className="flex items-center gap-2 lg:hidden">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-[12px] font-semibold text-white">B</span>
              <span className="font-display text-[18px] font-bold tracking-[-0.04em]">Batch</span>
            </Link>
            <div className="hidden min-w-0 flex-col lg:flex">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-secondary">Market clearing workspace</p>
              <p className="mt-1 text-[13px] text-ink-secondary">One account can discover, commit, create batches, track escrow, and use developer tools.</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <Link href="/app/create-batch" className="hidden h-9 items-center rounded-full bg-black px-4 text-[13px] font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:inline-flex">Create Batch</Link>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-ink-secondary transition hover:text-ink-primary">
                <Bell className="h-4 w-4" strokeWidth={1.7} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-action ring-2 ring-white" />
              </button>
              <Avatar name="Batch Account" userId="batch_account" size="default" />
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 md:px-6 md:py-8 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[68px] grid-cols-5 border-t border-black/10 bg-white/95 px-1 backdrop-blur-xl lg:hidden">
        {MOBILE_NAV.map((item) => <MobileItem key={item.href} item={item} pathname={pathname} />)}
      </nav>
    </div>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  exact?: boolean;
};

function isActive(item: NavItem, pathname: string) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/batches") return pathname === "/batches" || pathname.startsWith("/batches/");
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(item, pathname);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex min-h-[42px] items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-all",
        active ? "bg-black text-white shadow-sm" : "text-ink-secondary hover:bg-black/[0.04] hover:text-ink-primary",
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2 : 1.7} />
      <span>{item.label}</span>
    </Link>
  );
}

function MobileItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(item, pathname);
  const Icon = item.icon;
  return (
    <Link href={item.href} className={cn("flex flex-col items-center justify-center gap-1 text-[10px] font-semibold", active ? "text-ink-primary" : "text-ink-secondary")}>
      <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.7} />
      <span>{item.label}</span>
    </Link>
  );
}
