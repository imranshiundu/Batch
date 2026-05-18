import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { listLedgerPostings, postLedgerEntryToAccount, reconcileBatchLedger } from "@/lib/persistence/ledger-posting-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";
import { parseJson } from "@/lib/security/validation";

const postSchema = z.object({
  accountType: z.enum(["BATCH_ESCROW", "SUPPLIER_PAYABLE", "LOGISTICS_PAYABLE", "PLATFORM_FEE", "REFUND_RESERVE", "SPV_CONTROL"]),
  entryType: z.enum(["BUYER_COMMITMENT_HOLD", "BUYER_COMMITMENT_CAPTURE", "PLATFORM_FEE", "SUPPLIER_MILESTONE_RELEASE", "LOGISTICS_PAYOUT", "REFUND", "SUPPLIER_BOND_HOLD", "SUPPLIER_BOND_RELEASE", "SUPPLIER_BOND_PENALTY", "SLOT_TRANSFER_HOLD", "SLOT_TRANSFER_SETTLEMENT", "SLOT_TRANSFER_FEE"]),
  amount: z.number().positive(),
  currency: z.string().min(3).max(8).optional(),
  direction: z.enum(["CREDIT", "DEBIT"]),
  sourceType: z.string().min(2).max(80),
  sourceId: z.string().min(1).max(200),
  destinationType: z.string().min(2).max(80),
  destinationId: z.string().min(1).max(200),
  externalReference: z.string().min(3).max(200).optional(),
}).strict();

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const { slug } = await context.params;
  const url = new URL(request.url);

  if (!useDatabasePersistence()) {
    return ok({ batch: { slug }, accounts: [], recentEntries: [] }, { persisted: false, message: "Ledger postings require database persistence." });
  }

  try {
    if (url.searchParams.get("view") === "reconcile") {
      return ok(await reconcileBatchLedger(slug), { source: "database" });
    }

    return ok(await listLedgerPostings(slug), { source: "database" });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "LEDGER_POSTINGS_READ_FAILED", message: "Ledger postings could not be read." }, 400);
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const parsed = await parseJson(request, postSchema);
  if (!parsed.ok) return parsed.response;

  const { slug } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ batchSlug: slug, posted: true, ...parsed.data }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  try {
    const result = await postLedgerEntryToAccount({
      actorId: user.id,
      batchSlug: slug,
      accountType: parsed.data.accountType,
      entryType: parsed.data.entryType,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      direction: parsed.data.direction,
      sourceType: parsed.data.sourceType,
      sourceId: parsed.data.sourceId,
      destinationType: parsed.data.destinationType,
      destinationId: parsed.data.destinationId,
      externalReference: parsed.data.externalReference,
      idempotencyKey: idempotency.key,
    });

    return ok(result, { source: "database", idempotencyKey: idempotency.key }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "LEDGER_POST_FAILED", message: "Ledger posting could not be completed." }, 400);
  }
}
