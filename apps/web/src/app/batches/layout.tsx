import * as React from "react";
import Link from "next/link";

export default function BatchesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas font-sans text-ink-primary flex flex-col">
      {/* Top Navbar */}
      <header className="w-full h-[64px] flex items-center justify-between px-6 border-b border-border bg-surface sticky top-0 z-20">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">Batch</Link>
        <div className="flex items-center gap-6">
          <Link href="/batches" className="text-[14px] font-medium text-ink-primary">Live Batches</Link>
          <Link href="/login" className="text-[14px] font-medium text-ink-secondary hover:text-ink-primary">Log in</Link>
        </div>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
