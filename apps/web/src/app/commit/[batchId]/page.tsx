"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/components/ui/button";

export default function CommitFlowPage({ params }: { params: Promise<{ batchId: string }> }) {
  const unwrappedParams = React.use(params);
  const [step, setStep] = React.useState(1);
  const [deliveryMode, setDeliveryMode] = React.useState<"hub" | "direct" | null>(null);

  // Derived from batchId in real app, hardcoded here
  const batchName = "Shenzhen Charger Restock";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-primary/20 backdrop-blur-sm p-4 sm:p-0">
      
      {/* Drawer Container */}
      <div className="w-full sm:w-[480px] h-full bg-surface shadow-modal flex flex-col sm:rounded-l-[16px] animate-in slide-in-from-right duration-300 overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 h-[64px] border-b border-border flex-shrink-0">
          <h2 className="text-[18px] font-medium text-ink-primary">Commit to {batchName}</h2>
          <Link href={`/batches/${unwrappedParams.batchId}`} className="text-ink-secondary hover:text-ink-primary transition-colors">
            <X className="w-6 h-6" />
          </Link>
        </header>

        {/* Step Indicator (Only show for steps 1-4) */}
        {step <= 4 && (
          <div className="px-6 py-4 flex justify-center gap-3 border-b border-surface-raised flex-shrink-0 bg-canvas">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  step === i ? "bg-brand-action" :
                  step > i ? "bg-semantic-cleared" :
                  "border border-ink-secondary"
                )} 
              />
            ))}
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          
          {/* Step 1: Quantity */}
          {step === 1 && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-200">
              <h3 className="text-[20px] font-medium text-ink-primary tracking-tight">How many units?</h3>
              <div className="flex flex-col gap-3 items-center border border-border rounded-[12px] p-8 bg-surface">
                <div className="flex items-center gap-6">
                  <button className="w-[52px] h-[52px] rounded-full border border-border flex items-center justify-center text-ink-primary hover:bg-surface-raised text-[24px]">-</button>
                  <input type="text" value="10" readOnly className="w-[80px] text-center font-mono text-[32px] font-medium text-ink-primary bg-transparent focus:outline-none" />
                  <button className="w-[52px] h-[52px] rounded-full border border-border flex items-center justify-center text-ink-primary hover:bg-surface-raised text-[24px]">+</button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="font-mono text-[24px] font-medium text-ink-primary">Total: $42.00</p>
                <p className="text-[14px] text-ink-secondary">Held securely in escrow</p>
              </div>
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-[20px] font-medium text-ink-primary tracking-tight">Delivery Method</h3>
              <div className="flex flex-col gap-4">
                <label 
                  className={cn(
                    "flex flex-col p-4 rounded-[12px] border cursor-pointer transition-all",
                    deliveryMode === "hub" ? "border-border-focus bg-semantic-escrowLight" : "border-border hover:bg-surface-raised"
                  )}
                  onClick={() => setDeliveryMode("hub")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <input type="radio" checked={deliveryMode === "hub"} readOnly className="text-semantic-escrow" />
                    <span className="font-medium text-[16px] text-ink-primary">Hub Pickup</span>
                  </div>
                  <div className="pl-7 flex items-start gap-2 text-[14px] text-ink-secondary">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>Central Station Hub<br/>Nairobi, Kenya</span>
                  </div>
                </label>
                
                <label 
                  className={cn(
                    "flex flex-col p-4 rounded-[12px] border cursor-pointer transition-all",
                    deliveryMode === "direct" ? "border-border-focus bg-semantic-escrowLight" : "border-border hover:bg-surface-raised"
                  )}
                  onClick={() => setDeliveryMode("direct")}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <input type="radio" checked={deliveryMode === "direct"} readOnly className="text-semantic-escrow" />
                    <span className="font-medium text-[16px] text-ink-primary">Direct Delivery (+$2.00)</span>
                  </div>
                  <div className="pl-7 text-[14px] text-ink-secondary">
                    Deliver to my saved address.
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Escrow Review */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              <h3 className="text-[20px] font-medium text-ink-primary tracking-tight">Escrow Review</h3>
              
              <div className="flex flex-col bg-canvas border border-border rounded-[12px] overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                  <span className="text-[14px] text-ink-primary">Batch Price (10 units)</span>
                  <span className="text-[14px] font-mono text-ink-primary">$42.00</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                  <span className="text-[14px] text-ink-primary">Platform Fee</span>
                  <span className="text-[14px] font-mono text-ink-primary">$1.26</span>
                </div>
                {deliveryMode === "direct" && (
                  <div className="flex justify-between items-center px-4 py-3 border-b border-border">
                    <span className="text-[14px] text-ink-primary">Delivery Reserve</span>
                    <span className="text-[14px] font-mono text-ink-primary">$2.00</span>
                  </div>
                )}
                <div className="flex justify-between items-center px-4 py-4 bg-surface-raised">
                  <span className="text-[16px] font-medium text-ink-primary">Total Held in Escrow</span>
                  <span className="text-[18px] font-mono font-medium text-ink-primary">
                    ${deliveryMode === "direct" ? "45.26" : "43.26"}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-ink-secondary text-center">Refundable if batch fails to clear.</p>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="flex flex-col gap-6 items-center text-center animate-in fade-in duration-200 py-12">
              <h3 className="text-[24px] font-medium text-ink-primary tracking-tight">Ready to lock funds?</h3>
              <p className="text-[15px] text-ink-secondary max-w-sm leading-relaxed">
                You are committing ${deliveryMode === "direct" ? "45.26" : "43.26"} into the escrow pool for {batchName}. 
                Your funds will not be released to the supplier until the clearing conditions are met.
              </p>
            </div>
          )}

          {/* Step 5: Receipt */}
          {step === 5 && (
            <div className="flex flex-col gap-8 items-center text-center animate-in zoom-in-95 duration-300 py-12">
              <CheckCircle2 className="w-[64px] h-[64px] text-semantic-cleared" />
              <div>
                <h2 className="text-[28px] font-display font-bold text-ink-primary tracking-tight mb-2">Committed.</h2>
                <p className="text-[15px] text-ink-secondary">Your allocation is secured.</p>
              </div>
              
              <div className="px-6 py-4 bg-surface-raised border border-border rounded-[12px] flex flex-col gap-1 items-center">
                <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Commitment ID</span>
                <span className="font-mono text-[16px] text-ink-primary font-medium">CMT-8A2F-9B11</span>
              </div>

              <div className="flex flex-col w-full gap-3 mt-4">
                <Link href="/app/my-batches" className="w-full">
                  <Button variant="primary" size="large" className="w-full">View my commitment</Button>
                </Link>
                <Link href="/batches" className="w-full">
                  <Button variant="ghost" size="large" className="w-full">Back to market</Button>
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions (Steps 1-4) */}
        {step <= 4 && (
          <div className="p-6 border-t border-border bg-surface flex-shrink-0 flex flex-col gap-3">
            {step === 4 && (
              <p className="text-[12px] text-ink-secondary text-center mb-2">
                By clicking confirm, you agree to the Escrow Rules and Terms of Service.
              </p>
            )}
            <Button 
              variant="primary" 
              size="large" 
              className="w-full"
              disabled={step === 2 && !deliveryMode}
              onClick={() => setStep(s => s + 1)}
            >
              {step === 1 ? "Continue to Delivery" : 
               step === 2 ? "Review Escrow" : 
               step === 3 ? "Continue to Confirmation" : 
               `Lock my commitment — $${deliveryMode === "direct" ? "45.26" : "43.26"}`}
            </Button>
            {step > 1 && (
              <Button variant="ghost" className="w-full" onClick={() => setStep(s => s - 1)}>
                Back
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
