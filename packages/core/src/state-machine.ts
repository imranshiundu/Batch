import type { BatchSnapshot, BatchStatus, DomainResult } from "./types";

const transitions: Record<BatchStatus, BatchStatus[]> = {
  DRAFT: ["UNDER_REVIEW", "CANCELLED"],
  UNDER_REVIEW: ["OPEN", "DRAFT", "CANCELLED"],
  OPEN: ["FUNDED", "FAILED", "CANCELLED"],
  FUNDED: ["SUPPLIER_CONFIRMING", "FAILED", "DISPUTED"],
  SUPPLIER_CONFIRMING: ["ACTIVE", "FAILED", "DISPUTED"],
  ACTIVE: ["PRODUCTION", "FAILED", "DISPUTED"],
  PRODUCTION: ["SHIPPED", "FAILED", "DISPUTED"],
  SHIPPED: ["RECEIVED_AT_HUB", "FAILED", "DISPUTED"],
  RECEIVED_AT_HUB: ["ALLOCATING", "FAILED", "DISPUTED"],
  ALLOCATING: ["DELIVERING", "DISPUTED"],
  DELIVERING: ["DELIVERED", "DISPUTED"],
  DELIVERED: ["SETTLED", "DISPUTED"],
  SETTLED: [],
  FAILED: ["REFUNDING", "DISPUTED"],
  REFUNDING: ["REFUNDED", "DISPUTED"],
  REFUNDED: [],
  DISPUTED: ["ACTIVE", "FAILED", "REFUNDING", "SETTLED", "CANCELLED"],
  CANCELLED: [],
};

export function canTransition(from: BatchStatus, to: BatchStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function assertTransition(from: BatchStatus, to: BatchStatus): DomainResult<{ from: BatchStatus; to: BatchStatus }> {
  if (!canTransition(from, to)) {
    return {
      ok: false,
      error: {
        code: "INVALID_BATCH_TRANSITION",
        message: `Cannot transition batch from ${from} to ${to}.`,
        detail: { from, to, allowed: transitions[from] ?? [] },
      },
    };
  }

  return { ok: true, data: { from, to } };
}

export function nextAutomaticStatus(batch: BatchSnapshot, now: Date): DomainResult<BatchStatus> {
  if (batch.status === "OPEN") {
    if (batch.committedUnits >= batch.minimumUnits && batch.committedAmount >= batch.minimumAmount) {
      return { ok: true, data: "FUNDED" };
    }

    if (now > batch.deadlineAt) {
      return { ok: true, data: "FAILED" };
    }
  }

  if (batch.status === "FUNDED") {
    return { ok: true, data: "SUPPLIER_CONFIRMING" };
  }

  if (batch.status === "SUPPLIER_CONFIRMING") {
    if (batch.supplierConfirmed) {
      return { ok: true, data: "ACTIVE" };
    }

    if (batch.supplierConfirmationDueAt && now > batch.supplierConfirmationDueAt) {
      return { ok: true, data: "FAILED" };
    }
  }

  return { ok: true, data: batch.status };
}

export function requireNonBlockedRisk(batch: BatchSnapshot): DomainResult<true> {
  if (batch.riskLevel === "BLOCKED") {
    return {
      ok: false,
      error: {
        code: "BATCH_RISK_BLOCKED",
        message: "This batch is blocked by risk controls.",
      },
    };
  }

  return { ok: true, data: true };
}
