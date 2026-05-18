import { prisma } from "@batch/db";

export async function findUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profiles: true, supplier: true },
  });
}

export async function updateUserProfile(input: {
  userId: string;
  name?: string;
  phone?: string;
  country?: string;
  defaultCurrency?: string;
  defaultDeliveryMode?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: input.userId },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.country ? { country: input.country } : {}),
      },
    });

    const profile = await tx.profile.upsert({
      where: { id: `${input.userId}_default_profile` },
      update: {
        ...(input.defaultCurrency ? { defaultCurrency: input.defaultCurrency } : {}),
        ...(input.defaultDeliveryMode ? { defaultDeliveryMode: input.defaultDeliveryMode } : {}),
      },
      create: {
        id: `${input.userId}_default_profile`,
        userId: input.userId,
        label: "Default",
        defaultCurrency: input.defaultCurrency ?? "USD",
        defaultDeliveryMode: input.defaultDeliveryMode,
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.userId,
        actorRole: user.role,
        action: "PROFILE_UPDATE",
        targetType: "USER",
        targetId: input.userId,
        after: { user, profile },
      },
    });

    return { user, profile };
  });
}
