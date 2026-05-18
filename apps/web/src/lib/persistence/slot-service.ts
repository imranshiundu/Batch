import { calculateSlotPnL, calculateTransferFee, canCancelMarketOrder, canListSlot } from "@batch/core";
import { prisma } from "@batch/db";

export async function listUserSlots(userId: string) {
  return prisma.batchSlot.findMany({
    where: { ownerId: userId },
    include: { batch: true, commitment: true, listings: true, transfers: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createSlotListing(input: {
  sellerId: string;
  slotId: string;
  quantity: number;
  askUnitPrice: number;
  expiresAt?: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const slot = await tx.batchSlot.findUnique({
      where: { id: input.slotId },
      include: { batch: true, listings: { where: { status: { in: ["OPEN", "RESERVED"] } } } },
    });

    if (!slot) throw new Error("SLOT_NOT_FOUND");
    if (slot.ownerId !== input.sellerId) throw new Error("SLOT_OWNER_MISMATCH");

    const listedQuantity = slot.listings.reduce((sum, listing) => sum + listing.quantity, 0);
    const allowed = canListSlot({
      batchStatus: slot.batch.status as never,
      slotStatus: slot.status as never,
      quantity: slot.quantity,
      listedQuantity,
      now: new Date(),
      deliveryLockAt: slot.batch.deliveryLockAt,
    });

    if (!allowed.ok) throw new Error(allowed.error.code);
    if (input.quantity > allowed.data.transferableQuantity) throw new Error("LISTING_QUANTITY_EXCEEDS_AVAILABLE_SLOT");

    const askTotalAmount = input.quantity * input.askUnitPrice;
    const listing = await tx.batchSlotListing.create({
      data: {
        batchId: slot.batchId,
        slotId: slot.id,
        sellerId: input.sellerId,
        quantity: input.quantity,
        askUnitPrice: input.askUnitPrice,
        askTotalAmount,
        currency: slot.currency,
        expiresAt: input.expiresAt,
      },
    });

    await tx.batchSlot.update({ where: { id: slot.id }, data: { status: "LISTED" } });
    await tx.auditEvent.create({
      data: {
        actorId: input.sellerId,
        actorRole: "BUYER",
        action: "SLOT_LISTING_CREATE",
        targetType: "BATCH_SLOT",
        targetId: slot.id,
        after: listing as object,
      },
    });

    return listing;
  });
}

export async function cancelSlotOrder(input: { actorId: string; orderId: string; reason?: string }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.batchSlotOrder.findUnique({ where: { id: input.orderId } });
    if (!order) throw new Error("SLOT_ORDER_NOT_FOUND");
    if (order.buyerId !== input.actorId) throw new Error("SLOT_ORDER_OWNER_MISMATCH");

    const allowed = canCancelMarketOrder({ status: order.status });
    if (!allowed.ok) throw new Error(allowed.error.code);

    const updated = await tx.batchSlotOrder.update({
      where: { id: order.id },
      data: { status: "CANCELLED", cancelledAt: new Date(), cancellationReason: input.reason },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "BUYER",
        action: "SLOT_ORDER_CANCEL",
        targetType: "SLOT_ORDER",
        targetId: order.id,
        before: { status: order.status },
        after: { status: updated.status },
        reason: input.reason,
      },
    });

    return updated;
  });
}

export async function getSlotPnL(userId: string) {
  const slots = await prisma.batchSlot.findMany({ where: { ownerId: userId }, include: { transfers: true, listings: true, batch: true } });

  return slots.map((slot) => {
    const completedTransfers = slot.transfers.filter((transfer) => transfer.status === "COMPLETED");
    const realized = completedTransfers.reduce((sum, transfer) => {
      const exitUnitPrice = Number(transfer.transferAmount) / transfer.quantity;
      return sum + calculateSlotPnL({
        entryUnitPrice: Number(slot.entryUnitPrice),
        exitUnitPrice,
        quantity: transfer.quantity,
        transferFeeAmount: Number(transfer.feeAmount),
      }).net;
    }, 0);

    const openListing = slot.listings.find((listing) => listing.status === "OPEN");
    const unrealized = openListing ? calculateSlotPnL({
      entryUnitPrice: Number(slot.entryUnitPrice),
      exitUnitPrice: Number(openListing.askUnitPrice),
      quantity: openListing.quantity,
      transferFeeAmount: calculateTransferFee({ transferAmount: Number(openListing.askTotalAmount) }),
    }).net : 0;

    return {
      slotId: slot.id,
      batchSlug: slot.batch.slug,
      quantity: slot.quantity,
      currency: slot.currency,
      status: slot.status,
      entryUnitPrice: Number(slot.entryUnitPrice),
      realized,
      unrealized,
    };
  });
}
