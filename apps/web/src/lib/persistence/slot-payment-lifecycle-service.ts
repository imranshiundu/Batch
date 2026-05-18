import { calculateTransferFee } from "@batch/core";
import { prisma } from "@batch/db";

export async function markSlotTransferHoldPosted(input: { buyerId: string; transferId: string; externalReference?: string; idempotencyKey: string }) {
  return prisma.$transaction(async (tx) => {
    const transfer = await tx.batchSlotTransfer.findFirst({
      where: { id: input.transferId, toBuyerId: input.buyerId },
      include: { listing: { include: { slot: true } }, batch: true },
    });

    if (!transfer) throw new Error("SLOT_TRANSFER_NOT_FOUND");
    if (transfer.status !== "HELD") throw new Error("SLOT_TRANSFER_NOT_HELD");

    const amount = Number(transfer.transferAmount);
    const feeAmount = Number(transfer.feeAmount || calculateTransferFee({ transferAmount: amount }));

    await tx.escrowLedgerEntry.upsert({
      where: { idempotencyKey: `${input.idempotencyKey}:posted-hold` },
      update: { status: "POSTED", postedAt: new Date(), externalReference: input.externalReference },
      create: {
        batchId: transfer.batchId,
        commitmentId: transfer.commitmentId,
        type: "SLOT_TRANSFER_HOLD",
        amount,
        currency: transfer.currency,
        sourceType: "BUYER",
        sourceId: input.buyerId,
        destinationType: "SLOT_TRANSFER",
        destinationId: transfer.id,
        status: "POSTED",
        externalReference: input.externalReference,
        idempotencyKey: `${input.idempotencyKey}:posted-hold`,
        postedAt: new Date(),
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "SLOT_TRANSFER_HOLD_POSTED",
        targetType: "SLOT_TRANSFER",
        targetId: transfer.id,
        after: { externalReference: input.externalReference ?? null, amount, feeAmount },
      },
    });

    return { transferId: transfer.id, status: transfer.status, holdPosted: true, externalReference: input.externalReference ?? null };
  });
}

export async function completeHeldSlotTransfer(input: { buyerId: string; transferId: string; idempotencyKey: string }) {
  return prisma.$transaction(async (tx) => {
    const transfer = await tx.batchSlotTransfer.findFirst({
      where: { id: input.transferId, toBuyerId: input.buyerId },
      include: { listing: { include: { slot: true } } },
    });

    if (!transfer) throw new Error("SLOT_TRANSFER_NOT_FOUND");
    if (transfer.status !== "HELD") throw new Error("SLOT_TRANSFER_NOT_COMPLETABLE");
    if (!transfer.listing || !transfer.listing.slot) throw new Error("SLOT_TRANSFER_LISTING_NOT_FOUND");
    if (transfer.listing.status !== "RESERVED") throw new Error("SLOT_LISTING_NOT_RESERVED");

    const sellerRemainingQuantity = transfer.listing.slot.quantity - transfer.quantity;
    let buyerSlot;

    if (sellerRemainingQuantity > 0) {
      await tx.batchSlot.update({ where: { id: transfer.listing.slotId }, data: { quantity: sellerRemainingQuantity, status: "ACTIVE" } });
      buyerSlot = await tx.batchSlot.create({
        data: {
          batchId: transfer.batchId,
          commitmentId: transfer.commitmentId,
          ownerId: input.buyerId,
          quantity: transfer.quantity,
          entryUnitPrice: transfer.listing.askUnitPrice,
          entryTotalAmount: transfer.transferAmount,
          currency: transfer.currency,
          status: "ACTIVE",
        },
      });
    } else {
      buyerSlot = await tx.batchSlot.update({
        where: { id: transfer.listing.slotId },
        data: {
          ownerId: input.buyerId,
          entryUnitPrice: transfer.listing.askUnitPrice,
          entryTotalAmount: transfer.transferAmount,
          status: "ACTIVE",
        },
      });
    }

    await tx.batchSlotListing.update({ where: { id: transfer.listing.id }, data: { status: "COMPLETED" } });
    await tx.batchSlotTransfer.update({ where: { id: transfer.id }, data: { status: "COMPLETED", completedAt: new Date(), slotId: buyerSlot.id } });

    await tx.escrowLedgerEntry.createMany({
      data: [
        {
          batchId: transfer.batchId,
          commitmentId: transfer.commitmentId,
          type: "SLOT_TRANSFER_SETTLEMENT",
          amount: Number(transfer.transferAmount) - Number(transfer.feeAmount),
          currency: transfer.currency,
          sourceType: "SLOT_TRANSFER",
          sourceId: transfer.id,
          destinationType: "BUYER",
          destinationId: transfer.fromBuyerId,
          status: "POSTED",
          idempotencyKey: `${input.idempotencyKey}:seller-credit`,
          postedAt: new Date(),
        },
        {
          batchId: transfer.batchId,
          commitmentId: transfer.commitmentId,
          type: "SLOT_TRANSFER_FEE",
          amount: Number(transfer.feeAmount),
          currency: transfer.currency,
          sourceType: "SLOT_TRANSFER",
          sourceId: transfer.id,
          destinationType: "PLATFORM",
          destinationId: "batch",
          status: "POSTED",
          idempotencyKey: `${input.idempotencyKey}:platform-fee`,
          postedAt: new Date(),
        },
      ],
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "SLOT_TRANSFER_COMPLETE",
        targetType: "SLOT_TRANSFER",
        targetId: transfer.id,
        after: { buyerSlotId: buyerSlot.id, sellerRemainingQuantity },
      },
    });

    return { transferId: transfer.id, buyerSlot, status: "COMPLETED" };
  });
}
