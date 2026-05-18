"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/button";

export default function MyBatchesPage() {
  const [tab, setTab] = React.useState<"active" | "settling" | "past">("active");

  return (
    <div className="max-w-[800px] w-full flex flex-col gap-6">
      <h1 className="text-[24px] font-medium text-ink-primary tracking-tight">My Commitments</h1>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border">
        {(["active", "settling", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "pb-3 text-[14px] font-medium transition-colors capitalize relative",
              tab === t ? "text-ink-primary" : "text-ink-secondary hover:text-ink-primary"
            )}
          >
            {t}
            {tab === t && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-action rounded-t-[2px]" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {tab === "active" && (
          <>
            <div className="flex items-center justify-between p-5 bg-surface border border-border rounded-[12px]">
              <div className="flex items-center gap-4">
                {/* Progress Ring (Approximation with conic-gradient for delivery progress) */}
                <div 
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-surface"
                  style={{ background: `conic-gradient(#1C64F2 60%, #E5E7EB 0)` }}
                >
                  <div className="w-[26px] h-[26px] bg-surface rounded-full"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-ink-primary">Shenzhen Charger Restock</span>
                    <Badge variant="success">PRODUCTION</Badge>
                  </div>
                  <span className="text-[13px] text-ink-secondary">Delivery estimated Oct 24</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono text-[16px] font-medium text-ink-primary">$420.00</span>
                <Button variant="secondary" size="sm">Track Delivery</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-5 bg-surface border border-border rounded-[12px]">
              <div className="flex items-center gap-4">
                <div 
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center bg-surface"
                  style={{ background: `conic-gradient(#1C64F2 90%, #E5E7EB 0)` }}
                >
                  <div className="w-[26px] h-[26px] bg-surface rounded-full"></div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-medium text-ink-primary">Logitech MX Master Bulk</span>
                    <Badge variant="success">AT HUB</Badge>
                  </div>
                  <span className="text-[13px] text-ink-secondary">Ready for pickup at Central Station</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono text-[16px] font-medium text-ink-primary">$85.00</span>
                <Button variant="primary" size="sm">Confirm Receipt</Button>
              </div>
            </div>
          </>
        )}

        {tab === "settling" && (
          <div className="flex items-center justify-between p-5 bg-surface border border-border rounded-[12px]">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-medium text-ink-primary">Artisan Coffee Batch Q3</span>
                  <Badge variant="warning">FAILED TO CLEAR</Badge>
                </div>
                <span className="text-[13px] text-ink-secondary">Refund processing to original payment method. Expected in 2 days.</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-mono text-[16px] font-medium text-ink-primary">$150.00</span>
            </div>
          </div>
        )}

        {tab === "past" && (
          <div className="flex items-center justify-between p-5 bg-surface border border-border rounded-[12px] opacity-70">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-medium text-ink-primary">Mechanical Keyboards V2</span>
                  <Badge variant="neutral">SETTLED</Badge>
                </div>
                <span className="text-[13px] text-ink-secondary">Delivered on Sep 12, 2026</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-mono text-[16px] font-medium text-ink-secondary">$320.00</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
