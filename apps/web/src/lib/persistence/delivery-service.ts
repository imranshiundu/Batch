import { prisma } from "@batch/db";

export async function allocateBatchDeliveries(input: {
  actorId: string;
  batchSlug: string;
  carrier?: string;
  hubLocation?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({
      where: { slug: input.batchSlug },
      include: { commitments: true },
    });

    if (!batch) throw new Error("BATCH_NOT_FOUND");
    if (!["RECEIVED_AT_HUB", "ALLOCATING", "DELIVERING"].includes(batch.status)) {
      throw new Error("BATCH_NOT_READY_FOR_ALLOCATION");
    }

    const delivery = await tx.delivery.create({
      data: {
        batchId: batch.id,
        carrier: input.carrier,
        hubLocation: input.hubLocation,
        status: "READY_FOR_DISPATCH",
      },
    });

    const activeCommitments = batch.commitments.filter((commitment) => ["ACTIVE", "LOCKED"].includes(commitment.status));

    const allocations = await Promise.all(activeCommitments.map((commitment) => tx.orderAllocation.create({
      data: {
        batchId: batch.id,
        commitmentId: commitment.id,
        buyerId: commitment.buyerId,
        quantity: commitment.quantity,
        deliveryMode: batch.deliveryMode,
        deliveryStatus: "READY_FOR_DISPATCH",
        deliveryId: delivery.id,
        pickupCode: `BATCH-${commitment.id.slice(-6).toUpperCase()}`,
      },
    })));

    const updatedBatch = await tx.batch.update({
      where: { id: batch.id },
      data: { status: "DELIVERING" },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "DELIVERY_ALLOCATE",
        targetType: "BATCH",
        targetId: batch.id,
        before: { status: batch.status },
        after: { status: updatedBatch.status, deliveryId: delivery.id, allocations: allocations.length },
      },
    });

    return { batch: updatedBatch, delivery, allocations };
  });
}
