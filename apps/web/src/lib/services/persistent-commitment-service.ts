import { buyerCommitmentHold, quoteCommitment, wouldClearAfterCommitment } from "@batch/core";
import { createMockPaymentAdapter } from "@batch/payments";
import { prisma } from "@batch/db";
import { createAuditDraft } from "@/lib/security/audit";
import { beginIdempotentOperation, completeIdempotentOperation, failIdempotentOperation } from "@/lib/persistence/idempotency-store";

export async function createPersistentCommitment(input: {
  idempotencyKey: string;
  buyerId: string;
  batchSlug: string;
  quantity: number;
}) {
  const idempotency = await beginIdempotentOperation({
    key: input.idempotencyKey,
    actorId: input.buyerId,
    route: "POST /api/buyer/commitments",
    requestBody: { batchSlug: input.batchSlug, quantity: input.quantity },
  });

  if (!idempotency.ok) {
    return { ok: false as const, error: { code: "IDEMPOTENCY_CONFLICT", message: "The idempotency key was already used with a different request body." } };
  }

  if (idempotency.status === "COMPLETED" && idempotency.record.responseBody) {
    return { ok: true as const, data: idempotency.record.responseBody, replayed: true };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const batch = await tx.batch.findUnique({
        where: { slug: input.batchSlug },
        include: { tiers: { orderBy: { minUnits: "asc" } } },
      });

      if (!batch) {
        throw new Error("BATCH_NOT_FOUND");
      }

      const tier = [...batch.tiers].reverse().find((item) => input.quantity >= item.minUnits) ?? batch.tiers[0];
      if (!tier) {
        throw new Error("BATCH_TIER_REQUIRED");
      }

      const quote = quoteCommitment({
        id: batch.slug,
        status: batch.status,
        type: batch.type,
        minimumUnits: batch.minimumUnits,
        targetUnits: batch.targetUnits,
        committedUnits: batch.committedUnits,
        minimumAmount: Number(batch.minimumAmount),
        committedAmount: Number(batch.committedAmount),
        deadlineAt: batch.deadlineAt,
        supplierConfirmationDueAt: batch.supplierConfirmationDueAt ?? undefined,
        riskLevel: batch.riskLevel,
        supplierConfirmed: batch.supplierConfirmed,
      }, {
        buyerId: input.buyerId,
        batchId: batch.id,
        quantity: input.quantity,
        unitPrice: Number(tier.unitPrice),
        currency: batch.currency,
        now: new Date(),
      });

      if (!quote.ok) {
        throw new Error(quote.error.code);
      }

      const commitment = await tx.commitment.create({
        data: {
          batchId: batch.id,
          buyerId: input.buyerId,
          quantity: input.quantity,
          unitPrice: quote.data.unitPrice,
          totalAmount: quote.data.totalAmount,
          currency: quote.data.currency,
          status: "ACTIVE",
          paymentStatus: "HELD",
          escrowStatus: quote.data.lockState === "LOCKED_AFTER_CLEARING" ? "LOCKED" : "HELD",
        },
      });

      const ledgerDraft = buyerCommitmentHold({
        batchId: batch.id,
        commitmentId: commitment.id,
        buyerId: input.buyerId,
        amount: quote.data.totalAmount,
        currency: quote.data.currency,
        idempotencyKey: `${input.idempotencyKey}:ledger`,
      });

      if (!ledgerDraft.ok) {
        throw new Error(ledgerDraft.error.code);
      }

      const ledger = await tx.escrowLedgerEntry.create({
        data: ledgerDraft.data,
      });

      const clearsBatch = wouldClearAfterCommitment(batch as never, input.quantity, quote.data.totalAmount);

      await tx.batch.update({
        where: { id: batch.id },
        data: {
          committedUnits: { increment: input.quantity },
          committedAmount: { increment: quote.data.totalAmount },
          ...(clearsBatch ? { status: "FUNDED" } : {}),
        },
      });

      const audit = createAuditDraft({
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "COMMITMENT_CREATE",
        targetType: "BATCH",
        targetId: batch.id,
        after: { commitmentId: commitment.id, amount: quote.data.totalAmount, quantity: input.quantity },
      });

      await tx.auditEvent.create({
        data: {
          actorId: audit.actorId,
          actorRole: "BUYER",
          action: audit.action,
          targetType: audit.targetType,
          targetId: audit.targetId,
          after: audit.after as object,
        },
      });

      return { commitment, ledger, clearsBatch };
    });

    const payment = await createMockPaymentAdapter().createCommitmentIntent({
      buyerId: input.buyerId,
      commitmentId: result.commitment.id,
      batchId: result.commitment.batchId,
      amount: Number(result.commitment.totalAmount),
      currency: result.commitment.currency,
      idempotencyKey: input.idempotencyKey,
    });

    const response = { ...result, payment };
    await completeIdempotentOperation({ key: input.idempotencyKey, responseBody: response });

    return { ok: true as const, data: response, replayed: false };
  } catch (error) {
    await failIdempotentOperation({ key: input.idempotencyKey, responseBody: { error: error instanceof Error ? error.message : "UNKNOWN_ERROR" } }).catch(() => null);
    return { ok: false as const, error: { code: error instanceof Error ? error.message : "COMMITMENT_CREATE_FAILED", message: "Commitment could not be created." } };
  }
}
