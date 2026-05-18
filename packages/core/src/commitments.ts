import type { BatchSnapshot, CommitmentInput, DomainResult } from "./types";
import { requireNonBlockedRisk } from "./state-machine";

export type CommitmentQuote = {
  buyerId: string;
  batchId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  lockState: "CANCELLABLE_UNTIL_CLEARING" | "LOCKED_AFTER_CLEARING";
};

export function quoteCommitment(batch: BatchSnapshot, input: CommitmentInput): DomainResult<CommitmentQuote> {
  const risk = requireNonBlockedRisk(batch);
  if (!risk.ok) return risk;
  if (batch.status !== "OPEN" && batch.status !== "FUNDED") return { ok: false, error: { code: "BATCH_NOT_ACCEPTING_COMMITMENTS", message: "This batch is not accepting buyer commitments.", detail: { status: batch.status } } };
  if (input.now > batch.deadlineAt) return { ok: false, error: { code: "BATCH_DEADLINE_PASSED", message: "This batch has passed its commitment deadline." } };
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) return { ok: false, error: { code: "INVALID_COMMITMENT_QUANTITY", message: "Commitment quantity must be a positive whole number." } };
  if (input.unitPrice <= 0) return { ok: false, error: { code: "INVALID_UNIT_PRICE", message: "Unit price must be greater than zero." } };

  return { ok: true, data: { buyerId: input.buyerId, batchId: input.batchId, quantity: input.quantity, unitPrice: input.unitPrice, totalAmount: Math.round(input.quantity * input.unitPrice * 100) / 100, currency: input.currency, lockState: batch.status === "FUNDED" ? "LOCKED_AFTER_CLEARING" : "CANCELLABLE_UNTIL_CLEARING" } };
}

export function wouldClearAfterCommitment(batch: BatchSnapshot, quantity: number, amount: number): boolean {
  return batch.committedUnits + quantity >= batch.minimumUnits && batch.committedAmount + amount >= batch.minimumAmount;
}
