import { ok } from "@/lib/api-response";
import { listBatchInstruments } from "@/lib/market/market-service";
import { requireBotScope } from "@/lib/security/bot-access";

export async function GET(request: Request) {
  const botForbidden = await requireBotScope(request, "market:read");
  if (botForbidden) return botForbidden;

  const instruments = listBatchInstruments();
  return ok(instruments, {
    market: "batch-commitments",
    settlementModel: "BATCH_COMMITMENT",
    count: instruments.length,
  });
}
