import type { DomainResult, LedgerEntryInput } from "./types";

export type LedgerEntryDraft = LedgerEntryInput & {
  status: "PENDING";
};

export function createLedgerEntry(input: LedgerEntryInput): DomainResult<LedgerEntryDraft> {
  if (input.amount <= 0) {
    return {
      ok: false,
      error: {
        code: "INVALID_LEDGER_AMOUNT",
        message: "Ledger entry amount must be greater than zero.",
      },
    };
  }

  if (!input.currency || input.currency.length < 3) {
    return {
      ok: false,
      error: {
        code: "INVALID_LEDGER_CURRENCY",
        message: "Ledger entry currency must be a valid currency code.",
      },
    };
  }

  if (!input.idempotencyKey || input.idempotencyKey.length < 12) {
    return {
      ok: false,
      error: {
        code: "INVALID_IDEMPOTENCY_KEY",
        message: "Ledger entries require a stable idempotency key.",
      },
    };
  }

  return { ok: true, data: { ...input, status: "PENDING" } };
}

export function buyerCommitmentHold(input: {
  batchId: string;
  commitmentId: string;
  buyerId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
}): DomainResult<LedgerEntryDraft> {
  return createLedgerEntry({
    batchId: input.batchId,
    commitmentId: input.commitmentId,
    type: "BUYER_COMMITMENT_HOLD",
    amount: input.amount,
    currency: input.currency,
    sourceType: "BUYER",
    sourceId: input.buyerId,
    destinationType: "BATCH_ESCROW",
    destinationId: input.batchId,
    idempotencyKey: input.idempotencyKey,
  });
}

export function refundEntry(input: {
  batchId: string;
  commitmentId: string;
  buyerId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
}): DomainResult<LedgerEntryDraft> {
  return createLedgerEntry({
    batchId: input.batchId,
    commitmentId: input.commitmentId,
    type: "REFUND",
    amount: input.amount,
    currency: input.currency,
    sourceType: "BATCH_ESCROW",
    sourceId: input.batchId,
    destinationType: "BUYER",
    destinationId: input.buyerId,
    idempotencyKey: input.idempotencyKey,
  });
}

export function supplierMilestoneRelease(input: {
  batchId: string;
  milestoneId: string;
  supplierId: string;
  amount: number;
  currency: string;
  idempotencyKey: string;
}): DomainResult<LedgerEntryDraft> {
  return createLedgerEntry({
    batchId: input.batchId,
    milestoneId: input.milestoneId,
    type: "SUPPLIER_MILESTONE_RELEASE",
    amount: input.amount,
    currency: input.currency,
    sourceType: "BATCH_ESCROW",
    sourceId: input.batchId,
    destinationType: "SUPPLIER",
    destinationId: input.supplierId,
    idempotencyKey: input.idempotencyKey,
  });
}
