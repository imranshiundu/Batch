"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Pause, Check, X, ShieldAlert, Clock, CreditCard, AlertTriangle, AlertOctagon } from "lucide-react";

export default function AdminConsolePage() {
  return (
    <div className="flex flex-col gap-8 h-full pb-12">
      
      {/* Overview Tiles (Row of 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 shrink-0">
        {[
          { label: "Stuck Batches", value: "2", icon: ShieldAlert, color: "text-[#EF4444]" },
          { label: "Overdue Milestones", value: "4", icon: Clock, color: "text-[#F59E0B]" },
          { label: "Pending Payouts", value: "3", icon: CreditCard, color: "text-[#10B981]" },
          { label: "Open Disputes", value: "1", icon: AlertTriangle, color: "text-[#3B82F6]" },
          { label: "Failed Payments", value: "0", icon: AlertOctagon, color: "text-[#6B7280]" },
        ].map((tile, i) => {
          const Icon = tile.icon;
          return (
            <div key={i} className="px-5 py-4 border border-border bg-surface rounded-[12px] flex items-center justify-between shadow-sm">
              <div className="flex flex-col">
                <span className="text-[12px] font-medium uppercase tracking-wide text-ink-secondary">{tile.label}</span>
                <span className="text-[28px] font-mono font-semibold text-ink-primary mt-1">{tile.value}</span>
              </div>
              <Icon className={`w-6 h-6 ${tile.color}`} strokeWidth={1.5} />
            </div>
          );
        })}
      </div>

      {/* Batch Interventions Table */}
      <div className="bg-surface border border-border rounded-[12px] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-canvas">
          <h2 className="text-[16px] font-medium text-ink-primary">Batch Interventions Required</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-canvas/30">
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Batch Name</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">State</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Days Open</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Committed Units</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Risk Level</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Shenzhen Charger Restock", state: "OPEN", days: "14", units: "382 / 500", risk: "Medium" },
                { name: "Artisan Coffee Batch Q3", state: "PRODUCTION", days: "28", units: "600 / 600", risk: "High" },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-surface-raised last:border-0 hover:bg-surface-raised/40 transition-colors">
                  <td className="p-4 text-[14px] font-medium text-ink-primary">{row.name}</td>
                  <td className="p-4"><Badge variant={row.state === "OPEN" ? "default" : "success"}>{row.state}</Badge></td>
                  <td className="p-4 font-mono text-[14px] text-ink-primary">{row.days}</td>
                  <td className="p-4 font-mono text-[14px] text-ink-primary">{row.units}</td>
                  <td className="p-4">
                    <Badge variant={row.risk === "High" ? "warning" : "neutral"}>{row.risk}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-ink-secondary hover:bg-surface-raised hover:text-ink-primary transition-all">
                        <Pause className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-[#D1FAE5] bg-[#ECFDF5] flex items-center justify-center text-[#10B981] hover:bg-[#D1FAE5] transition-all">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full border border-[#FEE2E2] bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] hover:bg-[#FEE2E2] transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Ledger Table */}
      <div className="bg-surface border border-border rounded-[12px] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-canvas">
          <h2 className="text-[16px] font-medium text-ink-primary">Escrow Ledger</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-canvas/30">
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Event ID</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Type</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Amount</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Batch</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Supplier</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium">Timestamp</th>
                <th className="p-4 text-[12px] uppercase tracking-wide text-ink-secondary font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "TX-9011-88", type: "ESCROW_LOCK", amount: "$1,604.40", batch: "Shenzhen Charger", supplier: "Shenzhen Electronics", time: "2026-05-18 14:22:01", status: "LOCKED" },
                { id: "TX-8921-12", type: "MILESTONE_RELEASE", amount: "$4,200.00", batch: "Coffee Q3", supplier: "Artisan Coffee", time: "2026-05-17 09:15:30", status: "CLEARED" },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-surface-raised last:border-0 hover:bg-surface-raised/40 transition-colors">
                  <td className="p-4 font-mono text-[13px] text-ink-primary">{row.id}</td>
                  <td className="p-4 text-[13px] font-medium text-ink-primary">{row.type}</td>
                  <td className="p-4 font-mono text-[13px] text-ink-primary">{row.amount}</td>
                  <td className="p-4 text-[13px] text-ink-secondary">{row.batch}</td>
                  <td className="p-4 text-[13px] text-ink-secondary">{row.supplier}</td>
                  <td className="p-4 font-mono text-[12px] text-ink-secondary">{row.time}</td>
                  <td className="p-4 text-right">
                    <Badge variant={row.status === "LOCKED" ? "default" : "success"}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table (Monotone, Every operator action, infinite-scroll placeholder) */}
      <div className="bg-surface border border-border rounded-[12px] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-border bg-canvas flex justify-between items-center">
          <h2 className="text-[16px] font-medium text-ink-primary">System Audit Log</h2>
          <span className="text-[11px] font-mono text-ink-secondary uppercase">Immutable Record</span>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <tbody>
              {[
                { time: "2026-05-18 21:44:02", action: "OPERATOR_APPROVE", desc: "Approved milestone 1 proof for Shenzhen Charger Restock", operator: "OP-44" },
                { time: "2026-05-18 19:12:55", action: "SYSTEM_PAUSE", desc: "Flagged high-risk pricing delta on Artisan Coffee Q3", operator: "SYSTEM" },
                { time: "2026-05-17 11:04:18", action: "OPERATOR_RESOLVE_DISPUTE", desc: "Resolved dispute CMT-8120 in favor of Buyer", operator: "OP-09" },
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-surface-raised last:border-0 hover:bg-surface-raised/40 transition-colors">
                  <td className="p-4 font-mono text-[12px] text-ink-secondary w-[180px]">{row.time}</td>
                  <td className="p-4 font-mono text-[12px] font-medium text-ink-primary w-[220px]">{row.action}</td>
                  <td className="p-4 text-[13px] text-ink-primary">{row.desc}</td>
                  <td className="p-4 font-mono text-[12px] text-ink-secondary text-right w-[100px]">{row.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
