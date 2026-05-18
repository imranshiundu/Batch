"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BatchDealRoomPage() {
  return (
    <div className="max-w-[1200px] mx-auto w-full px-6 py-8">
      
      <div className="flex flex-col lg:flex-row items-start gap-[32px]">
        
        {/* Left Column (58%) */}
        <div className="w-full lg:w-[58%] flex flex-col gap-8">
          
          <div className="flex flex-col gap-3">
            <div className="text-[12px] text-ink-secondary mb-2">
              <Link href="/" className="hover:text-ink-primary">Home</Link> &gt; <Link href="/batches" className="hover:text-ink-primary">Batches</Link> &gt; <span className="text-ink-primary">Shenzhen Charger Restock</span>
            </div>
            
            <h1 className="text-[36px] font-display font-bold text-ink-primary leading-tight">
              Shenzhen Charger Restock
            </h1>
            
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[14px] text-ink-secondary">Shenzhen Electronics Co.</span>
              <Badge variant="default">IMPORT</Badge>
              <Badge variant="success">LOW RISK</Badge>
            </div>
          </div>

          {/* Escrow Timeline */}
          <div className="mt-4">
            <h3 className="text-[18px] font-medium text-ink-primary mb-6">Escrow Timeline</h3>
            <div className="flex flex-col gap-0">
              {[
                { status: "done", label: "Deal forming" },
                { status: "active", label: "Escrow locked & Funded" },
                { status: "pending", label: "Production finished" },
                { status: "pending", label: "Shipped & cleared" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 h-16 relative">
                  <div className="flex flex-col items-center h-full">
                    <div className={`w-[16px] h-[16px] rounded-full border-2 bg-surface z-10 flex-shrink-0 ${
                      step.status === "done" ? "border-semantic-cleared bg-semantic-cleared" :
                      step.status === "active" ? "border-semantic-escrow animate-pulse bg-semantic-escrowLight" :
                      "border-border"
                    }`} />
                    {i !== 3 && (
                      <div className={`w-[2px] h-full absolute top-[16px] bottom-[-16px] ${
                        step.status === "done" ? "bg-semantic-cleared" : "bg-border"
                      }`} />
                    )}
                  </div>
                  <span className={`text-[14px] font-medium -mt-[2px] ${
                    step.status === "pending" ? "text-ink-secondary" : "text-ink-primary"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Plan */}
          <div className="mt-4 border-t border-border pt-8">
            <h3 className="text-[18px] font-medium text-ink-primary mb-2">Delivery Plan</h3>
            <p className="text-[14px] text-ink-secondary leading-relaxed">
              Hub Pickup available at Central Station Hub. Direct Delivery available for $5.00 extra.
            </p>
          </div>

          {/* Refund Rules */}
          <div className="mt-4 border-t border-border pt-8">
            <h3 className="text-[18px] font-medium text-ink-primary mb-2">Refund Rules</h3>
            <p className="text-[14px] text-ink-secondary leading-relaxed">
              If batch fails to clear, 100% refunded within 3 business days.
            </p>
          </div>

          {/* Buyer Activity */}
          <div className="mt-4 border-t border-border pt-8">
            <h3 className="text-[18px] font-medium text-ink-primary mb-2">Buyer Activity</h3>
            <p className="text-[14px] text-ink-secondary leading-relaxed">
              382 buyers committed.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[13px] text-ink-secondary">Committed 2 mins ago</span>
              <span className="text-[13px] text-ink-secondary">Committed 15 mins ago</span>
              <span className="text-[13px] text-ink-secondary">Committed 1 hour ago</span>
            </div>
          </div>

        </div>

        {/* Right Column (42%) - The Market Box */}
        <div className="w-full lg:w-[42%] sticky top-[88px]">
          <div className="p-6 border border-border bg-surface rounded-[12px] shadow-ui flex flex-col gap-6">
            
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[36px] font-semibold text-ink-primary tracking-tight">$4.20</span>
                <span className="text-[14px] text-ink-secondary">Normal market: $8.00 — You save 47%</span>
              </div>
              <span className="font-mono text-[20px] text-ink-primary">14:23:09</span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="w-full bg-surface-raised rounded-full h-[8px] overflow-hidden">
                <div className="bg-semantic-escrow h-full rounded-full" style={{ width: "76%" }} />
              </div>
              <span className="text-[13px] text-ink-secondary text-right">382 committed / 500 minimum</span>
            </div>

            <div className="px-4 py-3 bg-semantic-escrowLight border border-border-focus/20 rounded-[8px]">
              <span className="text-[13px] font-medium text-brand-action">Price drops to $3.80 at 750 units.</span>
            </div>

            <div className="flex items-center gap-3 border border-border rounded-[6px] h-[44px] w-[140px] overflow-hidden">
              <button className="w-[44px] h-full flex items-center justify-center text-ink-primary hover:bg-surface-raised border-r border-border transition-colors">-</button>
              <input type="text" value="10" readOnly className="flex-1 w-full text-center font-mono text-[14px] font-medium text-ink-primary bg-transparent focus:outline-none" />
              <button className="w-[44px] h-full flex items-center justify-center text-ink-primary hover:bg-surface-raised border-l border-border transition-colors">+</button>
            </div>

            <p className="text-[14px] text-ink-primary font-medium">
              Your total: $42.00. <span className="text-ink-secondary font-normal">Held in escrow until clearing.</span>
            </p>

            <Link href="/commit/shenzhen-charger-restock" className="w-full block">
              <Button variant="primary" size="large" className="w-full">
                Commit Funds
              </Button>
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
