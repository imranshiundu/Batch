import { ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { listUserSlots } from "@/lib/persistence/slot-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";

export async function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (!useDatabasePersistence()) return ok([], { source: "demo", message: "Slots require database persistence." });

  return ok(await listUserSlots(user.id), { source: "database" });
}
