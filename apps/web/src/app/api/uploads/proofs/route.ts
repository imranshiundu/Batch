import { ok } from "@/lib/api-response";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { createPendingUpload, validateUploadRequest } from "@/lib/security/uploads";
import { parseJson } from "@/lib/security/validation";
import { z } from "zod";

const schema = z.object({
  filename: z.string().min(1).max(180),
  mimeType: z.string().min(3).max(120),
  sizeBytes: z.number().int().positive(),
}).strict();

export async function POST(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, schema);
  if (!parsed.ok) return parsed.response;

  const invalid = validateUploadRequest(parsed.data);
  if (invalid) return invalid;

  return ok(createPendingUpload({ ...parsed.data, ownerId: user.id }), { persisted: false, idempotencyKey: idempotency.key }, 201);
}
