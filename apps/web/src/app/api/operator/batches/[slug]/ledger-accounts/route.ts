import { fail, ok } from "@/lib/api-response";
import { listBatchLedgerAccounts, provisionBatchLedgerAccounts } from "@/lib/persistence/ledger-account-service";
import { useDatabasePersistence } from "@/lib/persistence/mode";
import { getRequestUser, requireRole } from "@/lib/security/auth";
import { requireIdempotencyKey } from "@/lib/security/idempotency";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const { slug } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ batch: { slug }, accounts: [] }, { persisted: false, message: "Ledger accounts require database persistence." });
  }

  try {
    return ok(await listBatchLedgerAccounts(slug), { source: "database" });
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "LEDGER_ACCOUNTS_READ_FAILED", message: "Ledger accounts could not be read." }, 400);
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const user = getRequestUser(request);
  const forbidden = requireRole(user, ["OPERATOR", "ADMIN"]);
  if (forbidden) return forbidden;

  const idempotency = requireIdempotencyKey(request);
  if (!idempotency.ok) return idempotency.response;

  const { slug } = await context.params;

  if (!useDatabasePersistence()) {
    return ok({ batch: { slug }, accounts: ["BATCH_ESCROW", "SUPPLIER_PAYABLE", "LOGISTICS_PAYABLE", "PLATFORM_FEE", "REFUND_RESERVE", "SPV_CONTROL"] }, { persisted: false, idempotencyKey: idempotency.key }, 201);
  }

  try {
    const accounts = await provisionBatchLedgerAccounts({ actorId: user.id, batchSlug: slug });
    return ok(accounts, { source: "database", idempotencyKey: idempotency.key }, 201);
  } catch (error) {
    return fail({ code: error instanceof Error ? error.message : "LEDGER_ACCOUNTS_PROVISION_FAILED", message: "Ledger accounts could not be provisioned." }, 400);
  }
}
