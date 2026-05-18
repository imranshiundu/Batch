import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { revokeBotApiKey } from "@/lib/persistence/bot-api-key-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({ reason: z.string().min(3).max(500).optional() }).strict();

export async function POST(request: Request, context: { params: Promise<{ keyId: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const { keyId } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ id: keyId, status: "REVOKED", reason: parsed.data.reason ?? null }, { persisted: false, idempotencyKey: idempotency.key });
  }

  try {
    const result = await revokeBotApiKey({ ownerId: user.id, ownerRole: user.role, keyId, reason: parsed.data.reason });
    return ok(result, { source: "database", idempotencyKey: idempotency.key });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "BOT_API_KEY_REVOKE_FAILED", message: "Bot API key could not be revoked." }, 400);
  }
}
