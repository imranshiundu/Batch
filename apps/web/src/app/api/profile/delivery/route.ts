import { z } from "zod";
import { ok } from "@/lib/api-response";
import { createDeliveryProfile, listDeliveryProfiles } from "@/lib/persistence/delivery-profile-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const schema = z.object({
  label: z.string().min(2).max(80),
  recipientName: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  country: z.string().min(2).max(80),
  city: z.string().min(2).max(120),
  addressLine1: z.string().max(200).optional(),
  addressLine2: z.string().max(200).optional(),
  postalCode: z.string().max(40).optional(),
  hubCode: z.string().max(80).optional(),
  deliveryMode: z.string().min(2).max(80),
  isDefault: z.boolean().optional(),
}).strict();

export async function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "SUPPLIER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (!useDatabasePersistence()) {
    return ok([], { source: "demo", message: "Delivery profiles require database persistence." });
  }

  return ok(await listDeliveryProfiles(user.id), { source: "database" });
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
    return ok({ id: `delivery_profile_${Date.now()}`, userId: user.id, ...parsed.data }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  return ok(await createDeliveryProfile({ userId: user.id, ...parsed.data }), { source: "database", idempotencyKey: idempotency.key }, 201);
}
