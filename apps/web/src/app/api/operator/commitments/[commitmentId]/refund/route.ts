import { fail, ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { createCommitmentRefund } from "@/lib/persistence/settlement-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";
import { z } from "zod";

const schema = z.object({ reason: z.string().min(5).max(1000) }).strict();

export async function POST(request: Request, context: { params: Promise<{ commitmentId: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { commitmentId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ commitmentId, status: "REFUNDING", reason: parsed.data.reason }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await createCommitmentRefund({ actorId: user.id, commitmentId, reason: parsed.data.reason });
    return ok(result, { source: "database", persisted: true, idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "REFUND_CREATE_FAILED", message: "Refund could not be created." }, 400);
  }
}
