import { ok } from "@/lib/api-response";
import { demoDisputes, demoLedger } from "@/lib/api-demo-store";
import { batches } from "@/lib/data";

export function GET() {
  return ok({
    queues: {
      review: 2,
      proof: 3,
      payout: 1,
      refund: 1,
      dispute: demoDisputes.length
    },
    batches,
    ledger: demoLedger,
    disputes: demoDisputes
  });
}
