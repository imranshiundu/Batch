"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2, FileText } from "lucide-react";

export default function SupplierBatchMilestonePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [showUploadDrawer, setShowUploadDrawer] = React.useState(false);

  return (
    <div className="flex flex-col h-full gap-8 relative">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/supplier" className="text-[12px] text-ink-secondary hover:text-ink-primary">← Back to Dashboard</Link>
          <h1 className="text-[28px] font-display font-bold text-ink-primary tracking-tight">Shenzhen Charger Restock</h1>
          <div className="flex items-center gap-2">
            <Badge variant="success">PRODUCTION</Badge>
            <span className="text-[13px] text-ink-secondary">Batch ID: {unwrappedParams.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        
        {/* Left Column: Milestones */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-[12px] p-6">
            <h2 className="text-[18px] font-medium text-ink-primary mb-6">Milestone Tracker</h2>
            
            <div className="flex flex-col gap-0">
              
              {/* Milestone 1 (Done) */}
              <div className="flex items-start gap-4 pb-6 border-b border-surface-raised mb-6">
                <CheckCircle2 className="w-[20px] h-[20px] text-semantic-cleared shrink-0 mt-0.5" />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[14px] font-medium text-ink-primary">Deal Cleared (Funds in Escrow)</span>
                    <Badge variant="success">COMPLETED</Badge>
                  </div>
                  <span className="text-[12px] text-ink-secondary mb-3">System verified target reached on Oct 14.</span>
                </div>
              </div>

              {/* Milestone 2 (Active) */}
              <div className="flex items-start gap-4 pb-6 border-b border-surface-raised mb-6">
                <div className="w-[20px] h-[20px] rounded-[4px] border-2 border-semantic-escrow flex shrink-0 mt-0.5" />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[14px] font-medium text-ink-primary">Manufacturing Started</span>
                    <span className="text-[12px] text-ink-secondary">Due: Oct 20</span>
                  </div>
                  <span className="text-[12px] text-ink-secondary mb-3">Upload factory confirmation or invoice to unlock next phase.</span>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => setShowUploadDrawer(true)}>Upload Proof</Button>
                  </div>
                </div>
              </div>

              {/* Milestone 3 (Pending) */}
              <div className="flex items-start gap-4 opacity-50">
                <div className="w-[20px] h-[20px] rounded-[4px] border-2 border-border flex shrink-0 mt-0.5" />
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[14px] font-medium text-ink-primary">Shipped to Hub</span>
                    <span className="text-[12px] text-ink-secondary">Due: Nov 5</span>
                  </div>
                  <span className="text-[12px] text-ink-secondary mb-3">Upload Bill of Lading (BoL).</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Allocation Summary */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-[12px] p-6 shadow-sm">
            <h2 className="text-[16px] font-medium text-ink-primary mb-4">Allocation Summary</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-surface-raised">
                <span className="text-[13px] text-ink-secondary">Total Committed</span>
                <span className="text-[14px] font-mono font-medium text-ink-primary">382 Units</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-raised">
                <span className="text-[13px] text-ink-secondary">Target Met</span>
                <span className="text-[14px] font-mono font-medium text-ink-primary">76%</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-raised">
                <span className="text-[13px] text-ink-secondary">Total Value</span>
                <span className="text-[14px] font-mono font-medium text-ink-primary">$1,604.40</span>
              </div>
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-[13px] text-ink-secondary">Next Scheduled Payout</span>
                <span className="text-[18px] font-mono font-medium text-ink-primary text-brand-action">$401.10 (25%)</span>
                <span className="text-[11px] text-ink-secondary mt-1">Releases upon verification of "Manufacturing Started" proof.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Upload Proof Drawer (Simulated via overlay for frontend UI) */}
      {showUploadDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink-primary/20 backdrop-blur-sm p-4 sm:p-0">
          <div className="w-full sm:w-[480px] h-full bg-surface shadow-modal flex flex-col sm:rounded-l-[16px] animate-in slide-in-from-right duration-300">
            
            <header className="flex items-center justify-between px-6 h-[64px] border-b border-border shrink-0">
              <h2 className="text-[18px] font-medium text-ink-primary">Upload Proof</h2>
              <button onClick={() => setShowUploadDrawer(false)} className="text-ink-secondary hover:text-ink-primary text-[24px]">&times;</button>
            </header>

            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
              
              <div>
                <h3 className="text-[16px] font-medium text-ink-primary mb-1">Manufacturing Started</h3>
                <p className="text-[13px] text-ink-secondary">Upload a factory invoice or confirmation document to trigger operator review.</p>
              </div>

              {/* Drag and Drop Zone */}
              <div className="w-full h-[200px] border-2 border-dashed border-border rounded-[12px] flex flex-col items-center justify-center gap-3 bg-surface-raised hover:bg-surface transition-colors cursor-pointer group">
                <div className="w-[48px] h-[48px] rounded-full bg-surface border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-6 h-6 text-ink-secondary" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium text-ink-primary">Click or drag file to this area to upload</p>
                  <p className="text-[12px] text-ink-secondary mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              {/* File List */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[13px] font-medium text-ink-primary uppercase tracking-wide">Attached Files</h4>
                <div className="flex items-center justify-between p-3 border border-border rounded-[8px] bg-canvas">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-ink-secondary" />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-ink-primary">factory_invoice_signed.pdf</span>
                      <span className="text-[11px] text-ink-secondary">2.4 MB</span>
                    </div>
                  </div>
                  <button className="text-semantic-warning hover:underline text-[12px]">Remove</button>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-border shrink-0">
              <Button variant="primary" size="large" className="w-full" onClick={() => setShowUploadDrawer(false)}>
                Submit Proof for Review
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
