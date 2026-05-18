import { ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getSlotPnL } from "@/lib/persistence/slot-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";

export async function GET(request: Request) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (!useDatabasePersistence()) return ok([], { source: "demo", message: "Slot P/L requires database persistence." });

  return ok(await getSlotPnL(user.id), { source: "database" });
}
