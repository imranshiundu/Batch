import { ok } from "@/lib/api-response";
import { listBatchInstruments } from "@/lib/market/market-service";

export function GET() {
  const instruments = listBatchInstruments();
  return ok(instruments, {
    market: "batch-commitments",
    settlementModel: "BATCH_COMMITMENT",
    count: instruments.length,
  });
}
