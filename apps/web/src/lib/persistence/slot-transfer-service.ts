import { calculateTransferFee } from "@batch/core";
import { prisma } from "@batch/db";

export async function completeSlotListingPurchase(input: {
  buyerId: string;
  listingId: string;
  deliveryProfileId?: string;
  idempotencyKey: string;
}) {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.batchSlotListing.findUnique({
      where: { id: input.listingId },
      include: { slot: { include: { batch: true } } },
    });

    if (!listing) throw new Error("SLOT_LISTING_NOT_FOUND");
    if (listing.status !== "OPEN") throw new Error("SLOT_LISTING_NOT_OPEN");
    if (listing.sellerId === input.buyerId) throw new Error("CANNOT_BUY_OWN_SLOT");

    const batch = listing.slot.batch;
    if (["ALLOCATING", "DELIVERING", "DELIVERED", "SETTLED", "FAILED", "REFUNDING", "REFUNDED", "DISPUTED", "CANCELLED"].includes(batch.status)) {
      throw new Error("BATCH_TRANSFER_LOCKED");
    }

    if (batch.deliveryLockAt && new Date() >= batch.deliveryLockAt) throw new Error("DELIVERY_LOCK_REACHED");

    const transferAmount = Number(listing.askTotalAmount);
    const feeAmount = calculateTransferFee({ transferAmount });

    const transfer = await tx.batchSlotTransfer.create({
      data: {
        batchId: listing.batchId,
        fromBuyerId: listing.sellerId,
        toBuyerId: input.buyerId,
        commitmentId: listing.slot.commitmentId,
        slotId: listing.slotId,
        listingId: listing.id,
        quantity: listing.quantity,
        transferAmount,
        feeAmount,
        currency: listing.currency,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    const sellerRemainingQuantity = listing.slot.quantity - listing.quantity;
    const buyerSlot = sellerRemainingQuantity > 0
      ? await tx.batchSlot.create({
          data: {
            batchId: listing.batchId,
            commitmentId: listing.slot.commitmentId,
            ownerId: input.buyerId,
            quantity: listing.quantity,
            entryUnitPrice: listing.askUnitPrice,
            entryTotalAmount: listing.askTotalAmount,
            currency: listing.currency,
            status: "ACTIVE",
          },
        })
      : await tx.batchSlot.update({
          where: { id: listing.slotId },
          data: { ownerId: input.buyerId, entryUnitPrice: listing.askUnitPrice, entryTotalAmount: listing.askTotalAmount, status: "ACTIVE" },
        });

    if (sellerRemainingQuantity > 0) {
      await tx.batchSlot.update({ where: { id: listing.slotId }, data: { quantity: sellerRemainingQuantity, status: "ACTIVE" } });
    }

    await tx.batchSlotListing.update({ where: { id: listing.id }, data: { status: "COMPLETED" } });

    const deliveryProfile = await tx.deliveryProfile.findFirst({
      where: input.deliveryProfileId ? { id: input.deliveryProfileId, userId: input.buyerId } : { userId: input.buyerId, isDefault: true },
    });

    const deliverySnapshot = deliveryProfile ? await tx.deliverySnapshot.create({
      data: {
        userId: input.buyerId,
        deliveryProfileId: deliveryProfile.id,
        commitmentId: buyerSlot.commitmentId,
        slotId: buyerSlot.id,
        label: deliveryProfile.label,
        recipientName: deliveryProfile.recipientName,
        phone: deliveryProfile.phone,
        country: deliveryProfile.country,
        city: deliveryProfile.city,
        addressLine1: deliveryProfile.addressLine1,
        addressLine2: deliveryProfile.addressLine2,
        postalCode: deliveryProfile.postalCode,
        hubCode: deliveryProfile.hubCode,
        deliveryMode: deliveryProfile.deliveryMode,
      },
    }) : null;

    await tx.escrowLedgerEntry.create({
      data: {
        batchId: listing.batchId,
        commitmentId: listing.slot.commitmentId,
        type: "SLOT_TRANSFER_FEE",
        amount: feeAmount,
        currency: listing.currency,
        sourceType: "SLOT_TRANSFER",
        sourceId: transfer.id,
        destinationType: "PLATFORM",
        destinationId: "batch",
        status: "PENDING",
        idempotencyKey: `${input.idempotencyKey}:slot-fee`,
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.buyerId,
        actorRole: "BUYER",
        action: "SLOT_TRANSFER_COMPLETE",
        targetType: "SLOT_LISTING",
        targetId: listing.id,
        after: { transferId: transfer.id, buyerSlotId: buyerSlot.id, deliverySnapshotId: deliverySnapshot?.id ?? null, feeAmount },
      },
    });

    return { transfer, buyerSlot, deliverySnapshot, feeAmount };
  });
}
