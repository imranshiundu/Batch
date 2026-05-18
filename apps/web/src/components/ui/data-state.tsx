import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/components/ui/button";

export type JsonRecord = Record<string, unknown>;

export function readText(source: unknown, keys: string[], empty = "—") {
  const record = source as JsonRecord | null | undefined;
  if (!record) return empty;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return empty;
}

export function readNumber(source: unknown, keys: string[], empty = 0) {
  const record = source as JsonRecord | null | undefined;
  if (!record) return empty;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }
  return empty;
}

export function readArray<T = JsonRecord>(source: unknown, keys: string[] = []) {
  if (Array.isArray(source)) return source as T[];
  const record = source as JsonRecord | null | undefined;
  if (!record) return [];
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export function formatMoney(value: unknown, currency = "USD") {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

export function formatPercent(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return "—";
  return `${Math.max(0, Math.min(100, number)).toFixed(0)}%`;
}

export function statusVariant(status: string): BadgeProps["variant"] {
  const normalized = status.toUpperCase();
  if (["SETTLED", "DELIVERED", "REFUNDED", "COMPLETED", "CLEARED", "POSTED", "ACTIVE", "PRODUCTION", "RECEIVED_AT_HUB"].includes(normalized)) return "success";
  if (["FAILED", "REFUNDING", "DISPUTED", "BLOCKED", "OVERDUE", "REVOKED"].includes(normalized)) return "warning";
  if (["OPEN", "FUNDED", "SUPPLIER_CONFIRMING", "SHIPPED", "ALLOCATING", "DELIVERING", "LISTED", "RESERVED", "TRANSFERRING"].includes(normalized)) return "default";
  return "neutral";
}

export function CanonicalStatus({ status }: { status: string }) {
  return <Badge variant={statusVariant(status)}>{status.replaceAll("_", " ")}</Badge>;
}

export function PageHeading({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-secondary">{eyebrow}</p> : null}
        <h1 className="mt-1 text-[24px] font-medium tracking-tight text-ink-primary md:text-[28px]">{title}</h1>
        {copy ? <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-secondary">{copy}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Surface({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-[12px] border border-line bg-surface shadow-ui", className)}>{children}</section>;
}

export function EmptyState({ title = "No records returned", copy = "The backend returned an empty list for this view." }: { title?: string; copy?: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[12px] border border-dashed border-line bg-canvas px-6 py-10 text-center">
      <p className="text-[15px] font-medium text-ink-primary">{title}</p>
      <p className="mt-2 max-w-md text-[13px] leading-5 text-ink-secondary">{copy}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading live backend data" }: { label?: string }) {
  return (
    <div className="flex min-h-[180px] items-center justify-center gap-3 rounded-[12px] border border-line bg-surface text-[14px] text-ink-secondary">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[12px] border border-semantic-warning/30 bg-semantic-warningLight/50 px-6 py-10 text-center">
      <AlertCircle className="h-5 w-5 text-semantic-warning" />
      <p className="mt-3 text-[15px] font-medium text-ink-primary">Unable to load this view</p>
      <p className="mt-2 max-w-md text-[13px] leading-5 text-ink-secondary">{message}</p>
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="h-[6px] w-full overflow-hidden rounded-full bg-surface-raised">
      <div className="h-full rounded-full bg-semantic-escrow transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}

export function RoutePill({ method, path, purpose }: { method: string; path: string; purpose?: string }) {
  return (
    <div className="grid gap-2 rounded-[10px] border border-line bg-canvas p-3 md:grid-cols-[80px_1fr_1.2fr]">
      <span className="font-mono text-[12px] font-semibold text-ink-primary">{method}</span>
      <span className="break-all font-mono text-[12px] text-ink-secondary">{path}</span>
      {purpose ? <span className="text-[13px] text-ink-secondary">{purpose}</span> : null}
    </div>
  );
}
