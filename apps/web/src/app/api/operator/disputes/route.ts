import { ok } from "@/lib/api-response";
import { demoDisputes } from "@/lib/api-demo-store";
import { openDispute, listDisputes } from "@/lib/persistence/dispute-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { createAuditDraft } from "@/lib/security/audit";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { disputeSchema, parseJson } from "@/lib/security/validation";

export async function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (useDatabasePersistence()) {
    const disputes = await listDisputes();
    return ok(disputes, { source: "database", actor: user.id });
  }

  return ok(demoDisputes, { source: "seeded-demo", actor: user.id });
}

export async function POST(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, disputeSchema);
  if (!parsed.ok) return parsed.response;

  if (useDatabasePersistence()) {
    const disputeRecord = await openDispute({ buyerId: user.id, ...parsed.data });
    return ok(disputeRecord, { source: "database", persisted: true, idempotencyKey: idempotency.key }, 201);
  }

  const dispute = { id: `dispute_${Date.now()}`, status: "OPEN", buyerId: user.id, ...parsed.data };
  return ok({
    ...dispute,
    audit: createAuditDraft({ actorId: user.id, actorRole: user.role, action: "DISPUTE_OPEN", targetType: "BATCH", targetId: parsed.data.batchId, after: dispute }),
  }, { persisted: false, idempotencyKey: idempotency.key }, 201);
}
