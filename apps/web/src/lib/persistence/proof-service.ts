import { prisma } from "@batch/db";

export async function submitMilestoneProof(input: {
  supplierUserId: string;
  milestoneId: string;
  proofType: string;
  fileUrl?: string;
  notes?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.findUnique({ where: { userId: input.supplierUserId } });
    if (!supplier) throw new Error("SUPPLIER_PROFILE_REQUIRED");

    const milestone = await tx.milestone.findUnique({ where: { id: input.milestoneId } });
    if (!milestone) throw new Error("MILESTONE_NOT_FOUND");

    const proof = await tx.milestoneProof.create({
      data: {
        milestoneId: input.milestoneId,
        supplierId: supplier.id,
        proofType: input.proofType as never,
        fileUrl: input.fileUrl ?? "pending-upload://manual-review-required",
        notes: input.notes,
        status: "SUBMITTED",
      },
    });

    await tx.milestone.update({
      where: { id: input.milestoneId },
      data: { status: "SUBMITTED" },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.supplierUserId,
        actorRole: "SUPPLIER",
        action: "MILESTONE_PROOF_SUBMIT",
        targetType: "MILESTONE",
        targetId: input.milestoneId,
        after: proof as object,
      },
    });

    return proof;
  });
}
