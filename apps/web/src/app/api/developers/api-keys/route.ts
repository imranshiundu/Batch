import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { createBotApiKey, listBotApiKeys } from "@/lib/persistence/bot-api-key-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({
  name: z.string().min(3).max(80),
  scopes: z.array(z.string().min(3)).min(1).max(20),
  expiresAt: z.string().datetime().optional(),
}).strict();

export async function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (!useDatabasePersistence()) return ok([], { source: "demo", message: "API keys require database persistence." });

  return ok(await listBotApiKeys(user.id), { source: "database" });
}

export async function POST(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  if (!useDatabasePersistence()) {
    return ok({
      key: "batch_live_demo_only_not_real",
      preview: "batch_live_demo...real",
      record: { id: `bot_key_${Date.now()}`, name: parsed.data.name, scopes: parsed.data.scopes, status: "ACTIVE" },
    }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  try {
    const result = await createBotApiKey({
      ownerId: user.id,
      ownerRole: user.role,
      name: parsed.data.name,
      scopes: parsed.data.scopes,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    });

    return ok(result, { source: "database", idempotencyKey: idempotency.key, warning: "The raw key is shown once. Store it now." }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "BOT_API_KEY_CREATE_FAILED", message: "Bot API key could not be created." }, 400);
  }
}
