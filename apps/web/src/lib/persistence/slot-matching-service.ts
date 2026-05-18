import { prisma } from "@batch/db";

export async function createSlotBuyOrder(input: {
  buyerId: string;
  batchSlug: string;
  quantity: number;
  limitUnitPrice?: number;
  expiresAt?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({ where: { slug: input.batchSlug } });
    if (!batch) throw new Error("BATCH_NOT_FOUND");

    const listing = await tx.batchSlotListing.findFirst({
      where: {
        batchId: batch.id,
        status: "OPEN",
        quantity: { gte: input.quantity },
        ...(input.limitUnitPrice ? { askUnitPrice: { lte: input.limitUnitPrice } } : {}),
      },
      orderBy: { askUnitPrice: "asc" },
    });

    const order = await tx.batchSlotOrder.create({
      data: {
        batchId: batch.id,
        listingId: listing?.id,
        buyerId: input.buyerId,
        side: "BUY_SLOT",
        orderType: input.limitUnitPrice ? "LIMIT" : "MARKET",
        quantity: input.quantity,
        limitUnitPrice: input.limitUnitPrice,
        status: listing ? "PARTIALLY_FILLED" : "OPEN",
        expiresAt: input.expiresAt,
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "SLOT_BUY_ORDER_CREATE",
        targetType: "BATCH",
        targetId: batch.id,
        after: { orderId: order.id, matchedListingId: listing?.id ?? null },
      },
    });

    return { order, matchedListing: listing };
  });
}
