import { calculateMilestoneReleaseAmount, supplierMilestoneRelease, refundEntry } from "@batch/core";
import { prisma } from "@batch/db";

export async function approveMilestonePayout(input: {
  actorId: string;
  milestoneId: string;
  reason?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const milestone = await tx.milestone.findUnique({
      where: { id: input.milestoneId },
      include: { batch: { include: { supplier: true } } },
    });

    if (!milestone) throw new Error("MILESTONE_NOT_FOUND");

    const escrowTotal = Number(milestone.batch.committedAmount);
    const release = calculateMilestoneReleaseAmount(escrowTotal, {
      id: milestone.id,
      name: milestone.name,
      sequence: milestone.sequence,
      releasePercent: Number(milestone.releasePercent),
      requiredProofType: milestone.requiredProofType,
      status: "APPROVED",
      dueAt: milestone.dueAt,
    });

    if (!release.ok) throw new Error(release.error.code);

    const updatedMilestone = await tx.milestone.update({
      where: { id: milestone.id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });

    const ledgerDraft = supplierMilestoneRelease({
      batchId: milestone.batchId,
      milestoneId: milestone.id,
      supplierId: milestone.batch.supplierId,
      amount: release.data,
      currency: milestone.batch.currency,
      idempotencyKey: `milestone:${milestone.id}:release`,
    });

    if (!ledgerDraft.ok) throw new Error(ledgerDraft.error.code);

    const ledger = await tx.escrowLedgerEntry.create({ data: ledgerDraft.data });
    const payout = await tx.payout.create({
      data: {
        supplierId: milestone.batch.supplierId,
        batchId: milestone.batchId,
        milestoneId: milestone.id,
        amount: release.data,
        currency: milestone.batch.currency,
        status: "PENDING",
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "MILESTONE_PAYOUT_APPROVE",
        targetType: "MILESTONE",
        targetId: milestone.id,
        before: { status: milestone.status },
        after: { status: updatedMilestone.status, payoutId: payout.id, ledgerId: ledger.id },
        reason: input.reason,
      },
    });

    return { milestone: updatedMilestone, ledger, payout };
  });
}

export async function createCommitmentRefund(input: {
  actorId: string;
  commitmentId: string;
  reason: string;
}) {
  return prisma.$transaction(async (tx) => {
    const commitment = await tx.commitment.findUnique({ where: { id: input.commitmentId }, include: { batch: true } });
    if (!commitment) throw new Error("COMMITMENT_NOT_FOUND");

    const ledgerDraft = refundEntry({
      batchId: commitment.batchId,
      commitmentId: commitment.id,
      buyerId: commitment.buyerId,
      amount: Number(commitment.totalAmount),
      currency: commitment.currency,
      idempotencyKey: `commitment:${commitment.id}:refund`,
    });

    if (!ledgerDraft.ok) throw new Error(ledgerDraft.error.code);

    const ledger = await tx.escrowLedgerEntry.create({ data: ledgerDraft.data });
    const refund = await tx.refund.create({
      data: {
        commitmentId: commitment.id,
        batchId: commitment.batchId,
        amount: commitment.totalAmount,
        currency: commitment.currency,
        reason: input.reason,
        status: "PENDING",
      },
    });

    const updatedCommitment = await tx.commitment.update({
      where: { id: commitment.id },
      data: { status: "REFUNDED", paymentStatus: "REFUNDED", escrowStatus: "REFUNDING" },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "COMMITMENT_REFUND_CREATE",
        targetType: "COMMITMENT",
        targetId: commitment.id,
        before: { status: commitment.status },
        after: { status: updatedCommitment.status, refundId: refund.id, ledgerId: ledger.id },
        reason: input.reason,
      },
    });

    return { commitment: updatedCommitment, ledger, refund };
  });
}
