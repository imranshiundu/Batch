import { buyerCommitmentHold, quoteCommitment, wouldClearAfterCommitment, type BatchSnapshot } from "@batch/core";
import { createMockPaymentAdapter } from "@batch/payments";

export type CreateCommitmentServiceInput = {
  buyerId: string;
  batch: BatchSnapshot;
  quantity: number;
  unitPrice: number;
  currency: string;
};

export async function createCommitmentService(input: CreateCommitmentServiceInput) {
  const quote = quoteCommitment(input.batch, {
    buyerId: input.buyerId,
    batchId: input.batch.id,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    currency: input.currency,
    now: new Date(),
  });

  if (!quote.ok) return quote;

  const commitmentId = `commit_${input.batch.id}_${Date.now()}`;
  const idempotencyKey = `commitment:${commitmentId}:hold`;
  const ledger = buyerCommitmentHold({
    batchId: input.batch.id,
    commitmentId,
    buyerId: input.buyerId,
    amount: quote.data.totalAmount,
    currency: input.currency,
    idempotencyKey,
  });

  if (!ledger.ok) return ledger;

  const adapter = createMockPaymentAdapter();
  const payment = await adapter.createCommitmentIntent({
    buyerId: input.buyerId,
    commitmentId,
    batchId: input.batch.id,
    amount: quote.data.totalAmount,
    currency: input.currency,
    idempotencyKey,
  });

  return {
    ok: true as const,
    data: {
      commitment: { id: commitmentId, ...quote.data, status: "ACTIVE", paymentStatus: payment.status },
      ledgerEntry: ledger.data,
      payment,
      clearsBatch: wouldClearAfterCommitment(input.batch, input.quantity, quote.data.totalAmount),
    },
  };
}
