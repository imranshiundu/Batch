import { prisma } from "@batch/db";

export async function createSupplierBatchDraft(input: {
  supplierUserId: string;
  title: string;
  summary?: string;
  type?: string;
  minimumUnits: number;
  targetUnits?: number;
  currency?: string;
  deliveryMode?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.findUnique({ where: { userId: input.supplierUserId } });
    if (!supplier) throw new Error("SUPPLIER_PROFILE_REQUIRED");

    const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
    const batch = await tx.batch.create({
      data: {
        slug,
        supplierId: supplier.id,
        title: input.title,
        summary: input.summary ?? "Draft batch pending pricing, delivery, milestones, and operator review.",
        category: "Uncategorized",
        type: (input.type ?? "MERCHANT_RESTOCK_BATCH") as never,
        status: "DRAFT",
        minimumUnits: input.minimumUnits,
        targetUnits: input.targetUnits ?? input.minimumUnits,
        minimumAmount: 0,
        currency: input.currency ?? "USD",
        deadlineAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        deliveryMode: input.deliveryMode ?? "UNSET",
      },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.supplierUserId,
        actorRole: "SUPPLIER",
        action: "SUPPLIER_BATCH_DRAFT_CREATE",
        targetType: "BATCH",
        targetId: batch.id,
        after: batch as object,
      },
    });

    return batch;
  });
}

export async function listSupplierBatchRecords(supplierUserId: string) {
  return prisma.batch.findMany({
    where: { supplier: { userId: supplierUserId } },
    include: { tiers: true, milestones: true },
    orderBy: { updatedAt: "desc" },
  });
}
