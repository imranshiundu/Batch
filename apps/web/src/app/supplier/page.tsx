"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SupplierDashboardPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {[
          { label: "Active Batches", value: "3" },
          { label: "Total Committed Units", value: "1,240" },
          { label: "Pending Payouts", value: "$12,450.00" },
          { label: "Reputation Score", value: "98/100" },
        ].map((kpi, i) => (
          <div key={i} className="px-6 py-5 border border-border bg-surface rounded-[12px] shadow-sm">
            <p className="text-[12px] uppercase tracking-wide text-ink-secondary mb-2 font-medium">{kpi.label}</p>
            <p className="text-[32px] font-mono font-medium text-ink-primary tracking-tight">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-[18px] font-medium text-ink-primary">Deal Pipeline</h2>
          <Link href="/supplier/batches/new">
            <Button variant="primary" size="sm">Create New Batch</Button>
          </Link>
        </div>

        {/* Scrollable Kanban Columns */}
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max h-full">
            
            {/* Column: DRAFT */}
            <div className="w-[300px] flex flex-col bg-surface-raised rounded-[12px] border border-border shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-[13px] font-medium text-ink-secondary uppercase tracking-wide">Draft</span>
                <Badge variant="neutral">1</Badge>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                <div className="bg-surface border border-border rounded-[8px] p-4 shadow-sm cursor-pointer hover:border-border-focus transition-colors">
                  <h3 className="text-[14px] font-medium text-ink-primary mb-2">Winter Jackets Bulk</h3>
                  <p className="text-[12px] text-ink-secondary">Missing delivery timeline</p>
                </div>
              </div>
            </div>

            {/* Column: OPEN */}
            <div className="w-[300px] flex flex-col bg-surface-raised rounded-[12px] border border-border shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-[13px] font-medium text-brand-action uppercase tracking-wide">Open</span>
                <Badge variant="default">1</Badge>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                <Link href="/supplier/batches/shenzhen-charger-restock">
                  <div className="bg-surface border border-border rounded-[8px] p-4 shadow-sm cursor-pointer hover:border-border-focus transition-colors">
                    <h3 className="text-[14px] font-medium text-ink-primary mb-2">Shenzhen Charger Restock</h3>
                    <div className="w-full bg-surface-raised rounded-full h-[4px] overflow-hidden mb-2">
                      <div className="bg-semantic-escrow h-full rounded-full" style={{ width: "76%" }} />
                    </div>
                    <p className="text-[12px] text-ink-secondary">382 / 500 units • Closes in 4h</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Column: FUNDED */}
            <div className="w-[300px] flex flex-col bg-surface-raised rounded-[12px] border border-border shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-[13px] font-medium text-semantic-warning uppercase tracking-wide">Funded</span>
                <Badge variant="warning">0</Badge>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                {/* Empty State */}
              </div>
            </div>

            {/* Column: PRODUCTION */}
            <div className="w-[300px] flex flex-col bg-surface-raised rounded-[12px] border border-border shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Production</span>
                <Badge variant="success">1</Badge>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                <div className="bg-surface border border-border rounded-[8px] p-4 shadow-sm cursor-pointer hover:border-border-focus transition-colors">
                  <h3 className="text-[14px] font-medium text-ink-primary mb-2">Artisan Coffee Batch Q3</h3>
                  <div className="px-2 py-1 bg-semantic-warningLight border border-semantic-warning/20 rounded-[4px] inline-block mb-2">
                    <span className="text-[11px] font-medium text-semantic-warning uppercase">Action Required</span>
                  </div>
                  <p className="text-[12px] text-ink-secondary">Upload manufacturing proof</p>
                </div>
              </div>
            </div>

            {/* Column: SHIPPED */}
            <div className="w-[300px] flex flex-col bg-surface-raised rounded-[12px] border border-border shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Shipped</span>
                <Badge variant="neutral">0</Badge>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                {/* Empty State */}
              </div>
            </div>

            {/* Column: SETTLED */}
            <div className="w-[300px] flex flex-col bg-surface-raised rounded-[12px] border border-border shrink-0">
              <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
                <span className="text-[13px] font-medium text-semantic-cleared uppercase tracking-wide">Settled</span>
                <Badge variant="success">1</Badge>
              </div>
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">
                <div className="bg-surface border border-border rounded-[8px] p-4 shadow-sm cursor-pointer hover:border-border-focus transition-colors">
                  <h3 className="text-[14px] font-medium text-ink-primary mb-2">Mechanical Keyboards V2</h3>
                  <p className="text-[12px] text-ink-secondary mb-2">Delivered to Hub</p>
                  <p className="text-[12px] font-mono text-ink-primary">Payout: $8,400.00</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
