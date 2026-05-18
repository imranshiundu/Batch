import { ok } from "@/lib/api-response";
import { demoCommitments, demoLedger } from "@/lib/api-demo-store";
import { batches, dashboardStats } from "@/lib/data";

export function GET() {
  return ok({ stats: dashboardStats, commitments: demoCommitments, ledger: demoLedger, recommendedBatches: batches });
}
