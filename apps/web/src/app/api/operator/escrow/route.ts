import { ok } from "@/lib/api-response";
import { demoLedger } from "@/lib/api-demo-store";

export function GET() {
  return ok({ entries: demoLedger, totals: { held: 1428, pendingRelease: 320, pendingRefund: 18, currency: "USD" } }, { source: "mock-ledger" });
}
