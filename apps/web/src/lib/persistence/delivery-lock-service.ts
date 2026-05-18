import { prisma } from "@batch/db";

export async function lockBatchDelivery(input: { actorId: string; batchSlug: string; reason?: string }) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({ where: { slug: input.batchSlug } });
    if (!batch) throw new Error("BATCH_NOT_FOUND");

    const lockedAt = new Date();
    const updatedBatch = await tx.batch.update({ where: { id: batch.id }, data: { deliveryLockAt: lockedAt } });

    await tx.batchSlot.updateMany({
      where: { batchId: batch.id, status: { in: ["ACTIVE", "LISTED", "RESERVED"] } },
      data: { status: "LOCKED", deliveryLockedAt: lockedAt, transferLockedAt: lockedAt },
    });

    await tx.deliverySnapshot.updateMany({
      where: { slot: { batchId: batch.id }, status: "ACTIVE" },
      data: { status: "LOCKED", lockedAt },
    });

    await tx.batchSlotListing.updateMany({ where: { batchId: batch.id, status: { in: ["OPEN", "RESERVED"] } }, data: { status: "LOCKED" } });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "DELIVERY_LOCK",
        targetType: "BATCH",
        targetId: batch.id,
        before: { deliveryLockAt: batch.deliveryLockAt },
        after: { deliveryLockAt: lockedAt },
        reason: input.reason,
      },
    });

    return updatedBatch;
  });
}
