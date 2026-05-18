import { prisma } from "@batch/db";

export async function listOpenBatches() {
  return prisma.batch.findMany({
    where: { status: { in: ["OPEN", "FUNDED", "ACTIVE", "PRODUCTION", "SHIPPED", "RECEIVED_AT_HUB", "ALLOCATING", "DELIVERING"] } },
    include: { tiers: true, supplier: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function findBatchBySlug(slug: string) {
  return prisma.batch.findUnique({
    where: { slug },
    include: {
      tiers: true,
      supplier: true,
      milestones: { orderBy: { sequence: "asc" } },
      commitments: true,
      ledgerEntries: true,
      deliveries: true,
    },
  });
}

export async function listSupplierBatches(supplierUserId: string) {
  return prisma.batch.findMany({
    where: { supplier: { userId: supplierUserId } },
    include: { tiers: true, milestones: true },
    orderBy: { updatedAt: "desc" },
  });
}
