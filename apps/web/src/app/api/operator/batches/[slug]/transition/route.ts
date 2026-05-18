import { assertTransition } from "@batch/core";
import { fail, ok } from "@/lib/api-response";
import { batches } from "@/lib/data";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { transitionBatch } from "@/lib/persistence/operator-transition-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { createAuditDraft } from "@/lib/security/audit";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { transitionSchema, parseJson } from "@/lib/security/validation";

type CoreStatus = Parameters<typeof assertTransition>[0];

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const { slug } = await context.params;
  const parsed = await parseJson(request, transitionSchema);
  if (!parsed.ok) return parsed.response;

  if (useDatabasePersistence()) {
    const result = await transitionBatch({
      actorId: user.id,
      actorRole: user.role as "OPERATOR" | "ADMIN",
      batchSlug: slug,
      to: parsed.data.to,
      reason: parsed.data.reason,
    });

    return ok(result, { source: "database", persisted: true, idempotencyKey: idempotency.key });
  }

  const batch = batches.find((item) => item.slug === slug);
  if (!batch) return fail({ code: "BATCH_NOT_FOUND", message: "Batch was not found." }, 404);

  const from = mapStatus(batch.status);
  const to = parsed.data.to as CoreStatus;
  const transition = assertTransition(from, to);

  if (!transition.ok) return fail(transition.error, 400);

  const audit = createAuditDraft({ actorId: user.id, actorRole: user.role, action: "BATCH_TRANSITION", targetType: "BATCH", targetId: slug, before: { status: from }, after: { status: to }, reason: parsed.data.reason });

  return ok({ batchId: slug, from, to, audit, persisted: false }, { mode: "operator-transition-demo", idempotencyKey: idempotency.key });
}

function mapStatus(status: string): CoreStatus {
  if (status === "OPEN") return "OPEN";
  if (status === "FUNDED") return "FUNDED";
  if (status === "ACTIVE") return "ACTIVE";
  if (status === "PRODUCTION") return "PRODUCTION";
  if (status === "SHIPPED") return "SHIPPED";
  if (status === "RECEIVED_AT_HUB") return "RECEIVED_AT_HUB";
  if (status === "FAILED") return "FAILED";
  return "OPEN";
}
