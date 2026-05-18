"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BatchesMarketPage() {
  return (
    <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-start gap-8 px-6 py-8">
      
      {/* Filter Sidebar */}
      <aside className="w-full md:w-[240px] flex-shrink-0 flex flex-col gap-8 sticky top-[88px]">
        <div>
          <h3 className="text-[14px] font-medium text-ink-primary mb-3 uppercase tracking-wide">Category</h3>
          <div className="flex flex-col gap-2">
            {["IMPORT", "LOCAL", "COMMUNITY", "MERCHANT"].map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border focus:ring-border-focus text-semantic-escrow" defaultChecked={cat === "IMPORT"} />
                <span className="text-[14px] text-ink-primary">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-medium text-ink-primary mb-3 uppercase tracking-wide">Risk Level</h3>
          <div className="flex gap-2 flex-wrap">
            {["Low", "Medium", "High"].map(risk => (
              <span key={risk} className="px-3 py-1 border border-border rounded-full text-[13px] text-ink-secondary cursor-pointer hover:bg-surface-raised transition-colors">
                {risk}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-medium text-ink-primary mb-3 uppercase tracking-wide">Deadline</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="deadline" className="border-border text-semantic-escrow focus:ring-border-focus" />
              <span className="text-[14px] text-ink-primary">Closing Today</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="deadline" className="border-border text-semantic-escrow focus:ring-border-focus" />
              <span className="text-[14px] text-ink-primary">This Week</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-medium text-ink-primary mb-3 uppercase tracking-wide">Delivery Mode</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border focus:ring-border-focus text-semantic-escrow" />
              <span className="text-[14px] text-ink-primary">Hub Pickup</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border focus:ring-border-focus text-semantic-escrow" />
              <span className="text-[14px] text-ink-primary">Direct Delivery</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Feed Area */}
      <main className="flex-1 w-full flex flex-col gap-3">
        {[1, 2, 3].map((batch) => (
          <div key={batch} className="w-full bg-surface border border-border p-5 rounded-[12px]">
            {/* Row 1 */}
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-[16px] font-medium text-ink-primary">Shenzhen Charger Restock {batch}</h2>
              <Badge variant="success">OPEN</Badge>
            </div>
            
            {/* Row 2 */}
            <p className="text-[14px] text-ink-secondary mb-4">Shenzhen Electronics Co. · Guangdong, China</p>
            
            {/* Row 3 */}
            <div className="w-full bg-surface-raised rounded-full h-[6px] overflow-hidden mb-2">
              <div className="bg-semantic-escrow h-full rounded-full" style={{ width: "76%" }} />
            </div>
            <p className="text-[12px] text-ink-secondary mb-4">382 of 500 minimum committed</p>
            
            {/* Row 4 */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[18px] font-medium text-ink-primary">Batch Price: $4.20</span>
              <span className="text-[14px] text-ink-secondary line-through">Normal: $8.00</span>
              <Badge variant="success">SAVE 47%</Badge>
            </div>
            
            {/* Row 5 */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-2 py-1 bg-surface-raised rounded-[4px] text-[12px] text-ink-secondary uppercase font-medium">Closes Today</span>
              <span className="px-2 py-1 bg-surface-raised rounded-[4px] text-[12px] text-ink-secondary uppercase font-medium">Hub Pickup</span>
              <span className="px-2 py-1 bg-surface-raised rounded-[4px] text-[12px] text-ink-secondary uppercase font-medium">Low Risk</span>
            </div>
            
            {/* Row 6 */}
            <div className="flex justify-end mt-4 pt-4 border-t border-border">
              <Link href="/batches/shenzhen-charger-restock">
                <Button variant="ghost" className="h-[36px]">View Batch</Button>
              </Link>
            </div>
          </div>
        ))}
      </main>

    </div>
  );
}
