"use client";

import * as React from "react";
import { Lock, ArrowUpRight, ArrowDownLeft, RotateCcw } from "lucide-react";
import { cn } from "@/components/ui/button";

export default function WalletPage() {
  return (
    <div className="max-w-[680px] mx-auto w-full flex flex-col">
      
      {/* Balance Block */}
      <div className="flex flex-col items-center gap-2 mb-12">
        <h2 className="text-[14px] font-medium uppercase tracking-wide text-ink-secondary">Total in Escrow</h2>
        <span className="text-[40px] font-mono font-semibold text-ink-primary tracking-tight">$4,250.00</span>
        <span className="text-[20px] font-mono text-ink-secondary mt-1">Available: $0.00</span>
      </div>

      {/* Ledger Events List */}
      <div className="flex flex-col border border-border bg-surface rounded-[12px] overflow-hidden">
        
        {/* Row 1: Escrow Lock */}
        <div className="flex items-center justify-between p-4 border-b border-surface-raised last:border-0">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-semantic-escrowLight flex items-center justify-center shrink-0">
              <Lock className="w-[20px] h-[20px] text-semantic-escrow" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-medium text-ink-primary">Escrow Lock: Shenzhen Charger Restock</span>
              <span className="text-[13px] text-ink-secondary">Oct 14, 2026 · CMT-8A2F-9B11</span>
            </div>
          </div>
          <span className="font-mono text-[16px] font-medium text-ink-primary">-$420.00</span>
        </div>

        {/* Row 2: Refund */}
        <div className="flex items-center justify-between p-4 border-b border-surface-raised last:border-0">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-semantic-warningLight flex items-center justify-center shrink-0">
              <RotateCcw className="w-[20px] h-[20px] text-semantic-warning" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-medium text-ink-primary">Refund: Failed to Clear</span>
              <span className="text-[13px] text-ink-secondary">Oct 12, 2026 · REF-2291-XX</span>
            </div>
          </div>
          <span className="font-mono text-[16px] font-medium text-ink-primary">+$150.00</span>
        </div>

        {/* Row 3: Release */}
        <div className="flex items-center justify-between p-4 border-b border-surface-raised last:border-0">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-semantic-clearedLight flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-[20px] h-[20px] text-semantic-cleared" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-medium text-ink-primary">Escrow Release: Mechanical Keyboards</span>
              <span className="text-[13px] text-ink-secondary">Sep 12, 2026 · Delivery Confirmed</span>
            </div>
          </div>
          <span className="font-mono text-[16px] font-medium text-ink-primary">-$320.00</span>
        </div>

        {/* Row 4: Outflow / Deposit */}
        <div className="flex items-center justify-between p-4 border-b border-surface-raised last:border-0 opacity-70">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] rounded-full bg-surface-raised flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-[20px] h-[20px] text-ink-secondary" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-medium text-ink-primary">Bank Deposit (Visa •••• 4242)</span>
              <span className="text-[13px] text-ink-secondary">Sep 10, 2026</span>
            </div>
          </div>
          <span className="font-mono text-[16px] font-medium text-ink-primary">+$500.00</span>
        </div>

      </div>

    </div>
  );
}
