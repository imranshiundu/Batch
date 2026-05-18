import { fail, ok } from "@/lib/api-response";
import { demoCommitments } from "@/lib/api-demo-store";
import { batches } from "@/lib/data";
import { createCommitmentService } from "@/lib/services/commitment-service";
import { createPersistentCommitment } from "@/lib/services/persistent-commitment-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { rateLimit } from "@/lib/security/rate-limit";
import { createCommitmentSchema, parseJson } from "@/lib/security/validation";
import { createAuditDraft } from "@/lib/security/audit";
import { useDatabasePersistence } from "@/lib/persistence/mode";

export function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;
  return ok(demoCommitments, { source: "seeded-demo", actor: user.id });
}

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "buyer-commitments", limit: 20, windowMs: 60_000 });
  if (limited) return limited;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, createCommitmentSchema);
  if (!parsed.ok) return parsed.response;

  if (useDatabasePersistence()) {
    const persistent = await createPersistentCommitment({
      idempotencyKey: idempotency.key,
      buyerId: user.id,
      batchSlug: parsed.data.batchId,
      quantity: parsed.data.quantity,
    });

    if (!persistent.ok) return fail(persistent.error, 400);
    return ok(persistent.data, { source: "database", idempotencyKey: idempotency.key, replayed: persistent.replayed }, 201);
  }

  const batch = batches.find((item) => item.slug === parsed.data.batchId);
  if (!batch) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);

  const result = await createCommitmentService({
    buyerId: user.id,
    batch: {
      id: batch.slug,
      status: batch.status === "OPEN" ? "OPEN" : "FUNDED",
      type: batch.type,
      minimumUnits: batch.minimumUnits,
      targetUnits: batch.targetUnits,
      committedUnits: batch.committedUnits,
      minimumAmount: batch.minimumUnits * batch.batchPrice,
      committedAmount: batch.committedUnits * batch.batchPrice,
      deadlineAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      riskLevel: batch.riskLevel.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "BLOCKED",
      supplierConfirmed: false,
    },
    quantity: parsed.data.quantity,
    unitPrice: batch.batchPrice,
    currency: batch.currency,
  });

  if (!result.ok) return fail(result.error, 400);

  return ok({
    ...result.data,
    audit: createAuditDraft({ actorId: user.id, actorRole: user.role, action: "COMMITMENT_CREATE", targetType: "BATCH", targetId: batch.slug, after: result.data }),
  }, { mode: "mock-payment", idempotencyKey: idempotency.key }, 201);
}
