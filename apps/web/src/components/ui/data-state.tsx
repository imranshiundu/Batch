import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/components/ui/button";

export type JsonRecord = Record<string, unknown>;

export function readText(source: unknown, keys: string[], empty = "—") {
  const record = source as JsonRecord | null | undefined;
  if (!record) return empty;
  for (const key of keys) {
    const value = key.includes(".") ? readPath(record, key) : record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return empty;
}

export function readNumber(source: unknown, keys: string[], empty = 0) {
  const record = source as JsonRecord | null | undefined;
  if (!record) return empty;
  for (const key of keys) {
    const value = key.includes(".") ? readPath(record, key) : record[key];
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
    const value = key.includes(".") ? readPath(record, key) : record[key];
    if (Array.isArray(value)) return value as T[];
  }
  return [];
}

export function readRecord(source: unknown, keys: string[] = []) {
  const record = source as JsonRecord | null | undefined;
  if (!record) return null;
  if (!keys.length) return record;
  for (const key of keys) {
    const value = key.includes(".") ? readPath(record, key) : record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) return value as JsonRecord;
  }
  return null;
}

function readPath(record: JsonRecord, path: string) {
  return path.split(".").reduce<unknown>((value, segment) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    return (value as JsonRecord)[segment];
  }, record);
}

export function formatMoney(value: unknown, currency = "USD") {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

export function formatDate(value: unknown) {
  if (!value || typeof value !== "string") return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function formatPercent(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return "—";
  return `${Math.max(0, Math.min(100, number)).toFixed(0)}%`;
}

export function normalizedProgress(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number <= 1 ? number * 100 : number));
}

export function statusVariant(status: string): BadgeProps["variant"] {
  const normalized = status.toUpperCase();
  if (["SETTLED", "DELIVERED", "REFUNDED", "COMPLETED", "CLEARED", "POSTED", "RECEIVED_AT_HUB", "FILLED", "BALANCED"].includes(normalized)) return "success";
  if (["FAILED", "DISPUTED", "BLOCKED", "OVERDUE", "REVOKED", "CANCELLED"].includes(normalized)) return "danger";
  if (["REFUNDING", "SUPPLIER_CONFIRMING", "ACTIVE", "PRODUCTION", "PARTIALLY_FILLED", "RESERVED", "UNDER_REVIEW", "DRAFT"].includes(normalized)) return "warning";
  if (["OPEN", "FUNDED", "SHIPPED", "ALLOCATING", "DELIVERING", "LISTED", "TRANSFERRING", "HELD", "LOCKED"].includes(normalized)) return "default";
  return "neutral";
}

export function CanonicalStatus({ status }: { status: string }) {
  const label = status.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
  return <Badge variant={statusVariant(status)}>{label}</Badge>;
}

export function PageHeading({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-ink-secondary">{eyebrow}</p> : null}
        <h1 className="mt-1 font-display text-[28px] font-bold tracking-[-0.03em] text-ink-primary md:text-[32px]">{title}</h1>
        {copy ? <p className="mt-2 max-w-2xl text-[14px] leading-6 text-ink-secondary md:text-[15px]">{copy}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Surface({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-[12px] border border-line bg-surface shadow-ui", className)}>{children}</section>;
}

export function EmptyState({ title = "No records returned", copy = "The backend returned an empty list for this view.", action }: { title?: string; copy?: string; action?: React.ReactNode }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[12px] border border-dashed border-line bg-canvas px-6 py-10 text-center">
      <AlertCircle className="h-5 w-5 text-ink-disabled" />
      <p className="mt-3 text-[15px] font-medium text-ink-primary">{title}</p>
      <p className="mt-2 max-w-md text-[13px] leading-5 text-ink-secondary">{copy}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface p-5 shadow-ui">
      <div className="space-y-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-[18px] w-[52%]" />
              <Skeleton className="h-[22px] w-[64px]" />
            </div>
            <Skeleton className="h-[8px] w-full rounded-full" />
            <Skeleton className="h-[13px] w-[36%]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorState({ message, title = "Data unavailable" }: { message: string; title?: string }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-[12px] border border-dashed border-line bg-canvas px-6 py-10 text-center">
      <AlertCircle className="h-5 w-5 text-ink-disabled" />
      <p className="mt-3 text-[15px] font-medium text-ink-primary">{title}</p>
      <p className="mt-2 max-w-md text-[13px] leading-5 text-ink-secondary">{message}</p>
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const width = normalizedProgress(value);
  return (
    <div className={cn("h-[6px] w-full overflow-hidden rounded-full bg-surface-raised", className)}>
      <div className="h-full rounded-full bg-semantic-escrow transition-all" style={{ width: `${width}%` }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-[4px]", className)} aria-hidden="true" />;
}

export function MetricCard({ label, value, detail }: { label: string; value: React.ReactNode; detail?: string }) {
  return (
    <div className="rounded-[12px] border border-line bg-surface px-6 py-5 shadow-ui">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-ink-secondary">{label}</p>
      <div className="mt-2 font-mono text-[28px] font-medium tabular-nums text-ink-primary">{value}</div>
      {detail ? <p className="mt-1 text-[12px] text-ink-secondary">{detail}</p> : null}
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

export function InlineField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-surface-raised py-3 last:border-0">
      <span className="text-[13px] text-ink-secondary">{label}</span>
      <span className="text-right text-[13px] font-medium text-ink-primary">{value}</span>
    </div>
  );
}
