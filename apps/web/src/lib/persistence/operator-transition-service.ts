import { assertTransition } from "@batch/core";
import { prisma } from "@batch/db";

export async function transitionBatch(input: {
  actorId: string;
  actorRole: "OPERATOR" | "ADMIN";
  batchSlug: string;
  to: string;
  reason?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({ where: { slug: input.batchSlug } });
    if (!batch) throw new Error("BATCH_NOT_FOUND");

    const transition = assertTransition(batch.status, input.to as never);
    if (!transition.ok) throw new Error(transition.error.code);

    const updated = await tx.batch.update({
      where: { id: batch.id },
      data: { status: input.to as never },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: input.actorRole,
        action: "BATCH_TRANSITION",
        targetType: "BATCH",
        targetId: batch.id,
        before: { status: batch.status },
        after: { status: updated.status },
        reason: input.reason,
      },
    });

    return { batch: updated, from: batch.status, to: updated.status };
  });
}
