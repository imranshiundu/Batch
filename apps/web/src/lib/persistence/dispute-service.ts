import { prisma } from "@batch/db";

export async function listDisputes() {
  return prisma.dispute.findMany({
    include: { batch: true, commitment: true, buyer: true },
    orderBy: { openedAt: "desc" },
  });
}

export async function openDispute(input: {
  buyerId: string;
  batchId: string;
  commitmentId?: string;
  type?: string;
  reason: string;
}) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findFirst({ where: { OR: [{ id: input.batchId }, { slug: input.batchId }] } });
    if (!batch) throw new Error("BATCH_NOT_FOUND");

    const dispute = await tx.dispute.create({
      data: {
        batchId: batch.id,
        commitmentId: input.commitmentId,
        buyerId: input.buyerId,
        type: input.type ?? "GENERAL",
        reason: input.reason,
        status: "OPEN",
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "DISPUTE_OPEN",
        targetType: "BATCH",
        targetId: batch.id,
        after: dispute as object,
      },
    });

    return dispute;
  });
}
