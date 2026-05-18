import { ok } from "@/lib/api-response";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getSlotPnL } from "@/lib/persistence/slot-service";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireBotScope } from "@/lib/security/bot-access";

export async function GET(request: Request) {
  const botForbidden = await requireBotScope(request, "slots:pnl:read");
  if (botForbidden) return botForbidden;

  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["BUYER", "OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  if (!useDatabasePersistence()) return ok([], { source: "demo", message: "Slot P/L requires database persistence." });

  return ok(await getSlotPnL(user.id), { source: "database" });
}
