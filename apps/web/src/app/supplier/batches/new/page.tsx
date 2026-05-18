"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewSupplierBatchPage() {
  const [step, setStep] = React.useState(1);

  return (
    <div className="flex flex-col h-full bg-surface">
      
      {/* Progress Bar */}
      <div className="w-full bg-surface-raised h-[4px] sticky top-[88px] md:top-[88px] z-10 shrink-0">
        <div 
          className="bg-brand-action h-full transition-all duration-300"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="max-w-[680px] mx-auto w-full py-12 px-6 flex-1 flex flex-col">
        
        {/* Step 1: Details */}
        {step === 1 && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-[28px] font-display font-bold text-ink-primary tracking-tight">Batch Details</h2>
              <p className="text-[14px] text-ink-secondary mt-1">What are you proposing to buyers?</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Title</label>
                <Input placeholder="e.g. Shenzhen Charger Restock" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Type</label>
                <select className="h-[44px] px-3 bg-canvas border border-border rounded-[8px] text-[14px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-all">
                  <option>IMPORT</option>
                  <option>LOCAL</option>
                  <option>COMMUNITY</option>
                  <option>MERCHANT</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Summary</label>
                <textarea 
                  className="min-h-[120px] p-3 bg-canvas border border-border rounded-[8px] text-[14px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-all resize-y"
                  placeholder="Describe the product and the deal terms..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Pricing */}
        {step === 2 && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-[28px] font-display font-bold text-ink-primary tracking-tight">Pricing & Thresholds</h2>
              <p className="text-[14px] text-ink-secondary mt-1">Set your minimum clearing conditions.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Normal Market Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary font-mono">$</span>
                  <Input className="pl-7 font-mono" placeholder="8.00" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Batch Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-secondary font-mono">$</span>
                  <Input className="pl-7 font-mono" placeholder="4.20" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Minimum Units</label>
                <Input type="number" placeholder="500" className="font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Target Units</label>
                <Input type="number" placeholder="1000" className="font-mono" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Price Tiers (Optional)</label>
              <div className="border border-border rounded-[8px] overflow-hidden bg-canvas">
                <div className="grid grid-cols-[1fr_1fr_40px] gap-2 p-3 border-b border-surface-raised bg-surface">
                  <span className="text-[12px] text-ink-secondary">Unit Threshold</span>
                  <span className="text-[12px] text-ink-secondary">New Price</span>
                  <span className="text-[12px] text-ink-secondary text-right"></span>
                </div>
                <div className="grid grid-cols-[1fr_1fr_40px] gap-2 p-3 items-center">
                  <Input type="number" placeholder="750" className="h-[36px] font-mono text-[13px]" />
                  <Input type="text" placeholder="$3.80" className="h-[36px] font-mono text-[13px]" />
                  <button className="text-semantic-warning hover:underline text-[12px] text-right pr-2">Del</button>
                </div>
              </div>
              <button className="text-[13px] font-medium text-brand-action hover:underline text-left">+ Add Row</button>
            </div>
          </div>
        )}

        {/* Step 3: Delivery */}
        {step === 3 && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-[28px] font-display font-bold text-ink-primary tracking-tight">Delivery Plan</h2>
              <p className="text-[14px] text-ink-secondary mt-1">How will buyers receive this batch?</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Delivery Window</label>
                <Input placeholder="e.g. 4 weeks after clearing" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Delivery Mode</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="delivery" className="text-semantic-escrow" defaultChecked />
                    <span className="text-[14px] text-ink-primary">Hub Pickup</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="delivery" className="text-semantic-escrow" />
                    <span className="text-[14px] text-ink-primary">Direct Delivery</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Location / Instructions</label>
                <textarea 
                  className="min-h-[80px] p-3 bg-canvas border border-border rounded-[8px] text-[14px] text-ink-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-border-focus transition-all resize-y"
                  placeholder="Specify hub details or shipping constraints..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-[28px] font-display font-bold text-ink-primary tracking-tight">Review & Submit</h2>
              <p className="text-[14px] text-ink-secondary mt-1">Operators will review this batch before it goes live.</p>
            </div>

            <div className="bg-canvas border border-border rounded-[12px] p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Batch Title</span>
                <span className="text-[15px] font-medium text-ink-primary">Shenzhen Charger Restock</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Batch Price</span>
                  <span className="text-[15px] font-mono text-ink-primary">$4.20</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Min Units</span>
                  <span className="text-[15px] font-mono text-ink-primary">500</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Delivery Mode</span>
                <span className="text-[15px] font-medium text-ink-primary">Hub Pickup (Central Station)</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-auto pt-12 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
          ) : (
            <Link href="/supplier">
              <Button variant="ghost">Cancel</Button>
            </Link>
          )}

          {step < 4 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>Continue</Button>
          ) : (
            <Link href="/supplier">
              <Button variant="primary">Submit for Review</Button>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
