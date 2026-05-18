import { prisma } from "@batch/db";
import type { AuditDraft } from "@/lib/security/audit";

export async function writeAuditEvent(draft: AuditDraft) {
  return prisma.auditEvent.create({
    data: {
      actorId: draft.actorId,
      actorRole: draft.actorRole as "BUYER" | "SUPPLIER" | "OPERATOR" | "ADMIN",
      action: draft.action,
      targetType: draft.targetType,
      targetId: draft.targetId,
      before: draft.before as object | undefined,
      after: draft.after as object | undefined,
      reason: draft.reason,
    },
  });
}
