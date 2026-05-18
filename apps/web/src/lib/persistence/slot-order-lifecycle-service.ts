import { calculateTransferFee } from "@batch/core";
import { prisma } from "@batch/db";

export async function listSlotOrders(userId: string) {
  return prisma.batchSlotOrder.findMany({
    where: { buyerId: userId },
    include: { batch: true, listing: { include: { slot: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function reserveMatchedSlotOrder(input: { buyerId: string; orderId: string; idempotencyKey: string }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.batchSlotOrder.findFirst({ where: { id: input.orderId, buyerId: input.buyerId }, include: { listing: true, batch: true } });
    if (!order) throw new Error("SLOT_ORDER_NOT_FOUND");
    if (!order.listingId || !order.listing) throw new Error("SLOT_ORDER_HAS_NO_MATCH");
    if (!["OPEN", "PARTIALLY_FILLED"].includes(order.status)) throw new Error("SLOT_ORDER_NOT_RESERVABLE");
    if (order.listing.status !== "OPEN") throw new Error("SLOT_LISTING_NOT_AVAILABLE");

    const transferAmount = Number(order.listing.askTotalAmount);
    const feeAmount = calculateTransferFee({ transferAmount });

    const transfer = await tx.batchSlotTransfer.create({
      data: {
        batchId: order.batchId,
        fromBuyerId: order.listing.sellerId,
        toBuyerId: input.buyerId,
        commitmentId: order.listing.slotId,
        slotId: order.listing.slotId,
        listingId: order.listing.id,
        quantity: order.quantity,
        transferAmount,
        feeAmount,
        currency: order.listing.currency,
        status: "HELD",
      },
    });

    await tx.batchSlotListing.update({ where: { id: order.listing.id }, data: { status: "RESERVED" } });
    await tx.batchSlotOrder.update({ where: { id: order.id }, data: { status: "PARTIALLY_FILLED" } });
    await tx.escrowLedgerEntry.create({
      data: {
        batchId: order.batchId,
        type: "SLOT_TRANSFER_HOLD",
        amount: transferAmount,
        currency: order.listing.currency,
        sourceType: "BUYER",
        sourceId: input.buyerId,
        destinationType: "SLOT_TRANSFER",
        destinationId: transfer.id,
        status: "PENDING",
        idempotencyKey: `${input.idempotencyKey}:slot-transfer-hold`,
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "SLOT_ORDER_RESERVE",
        targetType: "SLOT_ORDER",
        targetId: order.id,
        after: { transferId: transfer.id, listingId: order.listing.id, feeAmount },
      },
    });

    return { orderId: order.id, transfer, listingStatus: "RESERVED" };
  });
}

export async function expireSlotOrder(input: { actorId: string; orderId: string; reason?: string }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.batchSlotOrder.findUnique({ where: { id: input.orderId }, include: { listing: true } });
    if (!order) throw new Error("SLOT_ORDER_NOT_FOUND");
    if (!["OPEN", "PARTIALLY_FILLED"].includes(order.status)) throw new Error("SLOT_ORDER_NOT_EXPIRABLE");

    if (order.listing?.status === "RESERVED") {
      await tx.batchSlotListing.update({ where: { id: order.listing.id }, data: { status: "OPEN" } });
    }

    const updated = await tx.batchSlotOrder.update({ where: { id: order.id }, data: { status: "EXPIRED" } });
    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "SLOT_ORDER_EXPIRE",
        targetType: "SLOT_ORDER",
        targetId: order.id,
        reason: input.reason,
      },
    });

    return updated;
  });
}
