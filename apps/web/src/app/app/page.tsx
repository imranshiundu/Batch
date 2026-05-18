"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";

export default function BuyerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Protected in Escrow", value: "$4,250.00" },
          { label: "Active Commitments", value: "3" },
          { label: "Clearing Soon", value: "1" },
          { label: "Pending Deliveries", value: "2" },
        ].map((kpi, i) => (
          <div key={i} className="px-6 py-5 border border-border bg-surface rounded-[12px]">
            <p className="text-[12px] uppercase tracking-wide text-ink-secondary mb-2 font-medium">{kpi.label}</p>
            <p className="text-[32px] font-mono font-medium text-ink-primary tracking-tight">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
        
        {/* Left Column: Active Commitments */}
        <div>
          <h2 className="text-[18px] font-medium text-ink-primary mb-4">My Active Commitments</h2>
          <div className="flex flex-col border border-border rounded-[12px] bg-surface">
            {[
              { name: "Shenzhen Charger Restock", status: "FUNDED", progress: 100, amount: "$420.00" },
              { name: "Artisan Coffee Batch Q3", status: "OPEN", progress: 75, amount: "$150.00" },
              { name: "Logitech MX Master Bulk", status: "ALLOCATING", progress: 100, amount: "$85.00" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col py-4 px-6 border-b border-surface-raised last:border-0">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[14px] font-medium text-ink-primary">{item.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[14px] font-medium text-ink-primary">{item.amount}</span>
                    <Badge variant={item.status === "OPEN" ? "neutral" : item.status === "FUNDED" ? "success" : "default"}>{item.status}</Badge>
                  </div>
                </div>
                <div className="w-full bg-surface-raised rounded-full h-[6px] overflow-hidden">
                  <div 
                    className="bg-semantic-escrow h-full rounded-full transition-all" 
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Batches Clearing Soon */}
        <div>
          <h2 className="text-[18px] font-medium text-ink-primary mb-4">Batches Clearing Soon</h2>
          <div className="flex flex-col border border-border rounded-[12px] bg-surface p-6 gap-6">
            <div className="flex flex-col gap-2 border-b border-surface-raised pb-4 last:border-0 last:pb-0">
              <span className="text-[14px] font-medium text-ink-primary">Premium Matcha Direct</span>
              <div className="w-full bg-surface-raised rounded-full h-[6px] overflow-hidden">
                <div className="bg-semantic-escrow h-full rounded-full" style={{ width: "95%" }} />
              </div>
              <span className="text-[12px] text-ink-secondary">95% funded · Closes in 4 hours</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
