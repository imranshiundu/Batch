import { ok } from "@/lib/api-response";

export function GET() {
  return ok({
    public: [
      "GET /api/health",
      "GET /api/public/batches",
      "GET /api/public/batches/:slug",
      "GET /api/market/instruments",
      "GET /api/market/instruments/:symbol",
      "GET /api/market/instruments/:symbol/depth",
      "GET /api/developers/bot-manifest",
    ],
    buyer: [
      "GET /api/buyer/dashboard",
      "GET /api/buyer/commitments",
      "POST /api/buyer/commitments",
      "POST /api/market/orders",
    ],
    supplier: [
      "GET /api/supplier/profile",
      "PATCH /api/supplier/profile",
      "GET /api/supplier/batches",
      "POST /api/supplier/batches",
      "POST /api/supplier/proofs",
      "POST /api/uploads/proofs",
    ],
    operator: [
      "GET /api/operator/overview",
      "GET /api/operator/escrow",
      "GET /api/operator/disputes",
      "POST /api/operator/disputes",
      "POST /api/operator/batches/:slug/transition",
      "POST /api/operator/milestones/:milestoneId/approve-payout",
      "POST /api/operator/commitments/:commitmentId/refund",
      "POST /api/operator/batches/:slug/allocate-deliveries",
    ],
    payments: [
      "POST /api/payments/webhooks/:provider",
    ],
  }, { audience: "developers" });
}
