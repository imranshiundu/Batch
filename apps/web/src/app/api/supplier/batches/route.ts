import { ok } from "@/lib/api-response";
import { batches } from "@/lib/data";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { createSupplierBatchDraft, listSupplierBatchRecords } from "@/lib/persistence/supplier-batch-service";
import { serializeBatch } from "@/lib/serializers/batch";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { createAuditDraft } from "@/lib/security/audit";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { rateLimit } from "@/lib/security/rate-limit";
import { parseJson, supplierBatchDraftSchema } from "@/lib/security/validation";

export async function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (useDatabasePersistence()) {
    const records = await listSupplierBatchRecords(user.id);
    return ok(records.map(serializeBatch), { source: "database", actor: user.id });
  }

  return ok(batches.map((batch) => ({ ...batch, supplierEditable: batch.status === "OPEN" || batch.status === "FUNDED" })), { source: "seeded-demo", actor: user.id });
}

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "supplier-batches", limit: 12, windowMs: 60_000 });
  if (limited) return limited;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["SUPPLIER"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, supplierBatchDraftSchema);
  if (!parsed.ok) return parsed.response;

  if (useDatabasePersistence()) {
    const draftRecord = await createSupplierBatchDraft({ supplierUserId: user.id, ...parsed.data });
    return ok(serializeBatch(draftRecord), { source: "database", persisted: true, idempotencyKey: idempotency.key }, 201);
  }

  const draft = {
    id: `draft_${Date.now()}`,
    status: "DRAFT",
    supplierId: user.id,
    title: parsed.data.title,
    summary: parsed.data.summary ?? "Draft batch pending supplier completion and operator review.",
    type: parsed.data.type ?? "MERCHANT_RESTOCK_BATCH",
    minimumUnits: parsed.data.minimumUnits,
    targetUnits: parsed.data.targetUnits ?? parsed.data.minimumUnits,
    currency: parsed.data.currency ?? "USD",
    deliveryMode: parsed.data.deliveryMode ?? "UNSET",
  };

  return ok({
    ...draft,
    audit: createAuditDraft({ actorId: user.id, actorRole: user.role, action: "SUPPLIER_BATCH_DRAFT_CREATE", targetType: "BATCH", targetId: draft.id, after: draft }),
  }, { persisted: false, next: "complete-pricing-delivery-milestones", idempotencyKey: idempotency.key }, 201);
}
