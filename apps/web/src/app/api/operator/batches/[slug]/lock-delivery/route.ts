import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { lockBatchDelivery } from "@/lib/persistence/delivery-lock-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({ reason: z.string().min(5).max(1000).optional() }).strict();

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { slug } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ batchId: slug, deliveryLockAt: new Date().toISOString(), reason: parsed.data.reason ?? null }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await lockBatchDelivery({ actorId: user.id, batchSlug: slug, reason: parsed.data.reason });
    return ok(result, { source: "database", idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "DELIVERY_LOCK_FAILED", message: "Delivery could not be locked." }, 400);
  }
}
