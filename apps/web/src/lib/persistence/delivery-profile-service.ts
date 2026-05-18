import { prisma } from "@batch/db";

export async function listDeliveryProfiles(userId: string) {
  return prisma.deliveryProfile.findMany({ where: { userId }, orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }] });
}

export async function createDeliveryProfile(input: {
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  addressLine1?: string;
  addressLine2?: string;
  postalCode?: string;
  hubCode?: string;
  deliveryMode: string;
  isDefault?: boolean;
}) {
  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.deliveryProfile.updateMany({ where: { userId: input.userId }, data: { isDefault: false } });
    }

    const profile = await tx.deliveryProfile.create({ data: input });

    await tx.auditEvent.create({
      data: {
        actorId: input.userId,
        actorRole: "BUYER",
        action: "DELIVERY_PROFILE_CREATE",
        targetType: "DELIVERY_PROFILE",
        targetId: profile.id,
        after: profile as object,
      },
    });

    return profile;
  });
}

export async function snapshotDeliveryForCommitment(input: {
  userId: string;
  commitmentId: string;
  slotId?: string;
  deliveryProfileId?: string;
  override?: {
    label: string;
    recipientName: string;
    phone: string;
    country: string;
    city: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    hubCode?: string;
    deliveryMode: string;
  };
}) {
  return prisma.$transaction(async (tx) => {
    const source = input.override ?? await tx.deliveryProfile.findFirst({
      where: input.deliveryProfileId ? { id: input.deliveryProfileId, userId: input.userId } : { userId: input.userId, isDefault: true },
    });

    if (!source) throw new Error("DELIVERY_PROFILE_REQUIRED");

    const snapshot = await tx.deliverySnapshot.create({
      data: {
        userId: input.userId,
        commitmentId: input.commitmentId,
        slotId: input.slotId,
        deliveryProfileId: "id" in source ? source.id : input.deliveryProfileId,
        label: source.label,
        recipientName: source.recipientName,
        phone: source.phone,
        country: source.country,
        city: source.city,
        addressLine1: source.addressLine1,
        addressLine2: source.addressLine2,
        postalCode: source.postalCode,
        hubCode: source.hubCode,
        deliveryMode: source.deliveryMode,
      },
    });

    return snapshot;
  });
}
