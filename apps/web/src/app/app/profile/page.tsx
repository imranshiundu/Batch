"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Copy, RefreshCw, Trash2, Edit2, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [showKey, setShowKey] = React.useState(false);

  return (
    <div className="w-full flex flex-col h-full max-w-[1200px] mx-auto gap-8 pb-12">
      
      {/* Header Zone */}
      <div className="w-full border-b border-border pb-8 flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="w-[80px] h-[80px] rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center text-[28px] font-display font-bold shrink-0">
            IE
          </div>
          <div className="flex flex-col gap-2 items-start">
            <h2 className="text-[28px] font-medium text-ink-primary tracking-tight leading-none">Imran Escrow</h2>
            <div className="flex items-center gap-2">
              <Badge variant="default">BUYER</Badge>
              <Badge variant="success">VERIFIED</Badge>
            </div>
          </div>
        </div>
        <Button variant="ghost" className="h-[36px]">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-surface border border-border rounded-[12px] p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="text-[16px] font-medium text-ink-primary">Personal Information</h3>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Email</span>
              <span className="text-[14px] text-ink-primary flex items-center gap-2">imran@example.com <LockIcon /></span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-ink-secondary uppercase tracking-wide">Display Name</span>
              <span className="text-[14px] text-ink-primary cursor-pointer hover:underline underline-offset-2">Imran Escrow</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[12px] p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="text-[16px] font-medium text-ink-primary">Delivery Profiles</h3>
            
            <div className="flex items-start justify-between border-b border-surface-raised pb-4">
              <div className="flex items-start gap-3">
                <input type="radio" checked readOnly className="mt-1 text-semantic-escrow" />
                <div className="flex flex-col">
                  <span className="text-[14px] text-ink-primary font-medium">Home Office</span>
                  <span className="text-[13px] text-ink-secondary">123 Tech Lane, Nairobi</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-ink-secondary">
                <button className="hover:text-ink-primary"><Edit2 className="w-4 h-4" /></button>
                <button className="hover:text-semantic-warning"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <Button variant="ghost" className="w-full h-[36px]">Add Address</Button>
          </div>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-surface border border-border rounded-[12px] p-6 flex flex-col shadow-sm">
            <h3 className="text-[16px] font-medium text-ink-primary mb-4">Notifications</h3>
            
            <div className="flex items-center justify-between py-4 border-b border-surface-raised">
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-ink-primary">Milestone Updates</span>
                <span className="text-[13px] text-ink-secondary">Receive alerts when batches progress.</span>
              </div>
              <Toggle checked={true} />
            </div>

            <div className="flex items-center justify-between py-4 border-b border-surface-raised">
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-ink-primary">Escrow Alerts</span>
                <span className="text-[13px] text-ink-secondary">Critical locks and releases.</span>
              </div>
              <Toggle checked={true} />
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-ink-primary">Refund Notifications</span>
                <span className="text-[13px] text-ink-secondary">Alerts for failed batches.</span>
              </div>
              <Toggle checked={true} />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[12px] p-6 flex flex-col shadow-sm">
            <h3 className="text-[16px] font-medium text-ink-primary mb-1">Developer API Keys</h3>
            <p className="text-[13px] text-ink-secondary mb-4">Use these keys to access your escrow operations programmatically.</p>
            
            <div className="flex items-center justify-between p-4 bg-canvas border border-border rounded-[8px]">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[14px] text-ink-primary">
                  {showKey ? "sk_live_8f92a1b3c4d5e6f7" : "sk_live_••••••••••••••••"}
                </span>
                <div className="flex items-center gap-3 text-ink-secondary">
                  <button className="hover:text-ink-primary" onClick={() => setShowKey(!showKey)}><Eye className="w-[16px] h-[16px]" /></button>
                  <button className="hover:text-ink-primary"><Copy className="w-[16px] h-[16px]" /></button>
                  <button className="hover:text-ink-primary"><RefreshCw className="w-[16px] h-[16px]" /></button>
                </div>
              </div>
              <button className="text-[13px] font-medium text-semantic-warning hover:underline">Revoke</button>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full h-[44px] flex items-center justify-center gap-2 border border-[#FECACA] text-[#DC2626] font-medium rounded-full hover:bg-[#FEF2F2] transition-colors text-[14px]">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-secondary">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <div className={`w-[36px] h-[20px] rounded-full p-[2px] cursor-pointer transition-colors ${checked ? 'bg-brand-action' : 'bg-surface-raised border border-border'}`}>
      <div className={`w-[16px] h-[16px] rounded-full bg-white transition-transform ${checked ? 'translate-x-[16px]' : 'translate-x-0'}`} />
    </div>
  );
}
