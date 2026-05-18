import { prisma } from "@batch/db";

type AccountPurpose =
  | "BATCH_ESCROW"
  | "SUPPLIER_PAYABLE"
  | "LOGISTICS_PAYABLE"
  | "PLATFORM_FEE"
  | "REFUND_RESERVE"
  | "SPV_CONTROL";

export async function listLedgerPostings(batchSlug: string) {
  const batch = await prisma.batch.findUnique({
    where: { slug: batchSlug },
    include: {
      ledgerAccounts: { orderBy: [{ type: "asc" }, { currency: "asc" }] },
      ledgerEntries: { orderBy: { createdAt: "desc" }, take: 100 },
    },
  });

  if (!batch) throw new Error("BATCH_NOT_FOUND");

  return {
    batch: { id: batch.id, slug: batch.slug, title: batch.title, currency: batch.currency },
    accounts: batch.ledgerAccounts,
    recentEntries: batch.ledgerEntries,
  };
}

export async function postLedgerEntryToAccount(input: {
  actorId: string;
  batchSlug: string;
  accountType: AccountPurpose;
  entryType: string;
  amount: number;
  currency?: string;
  direction: "CREDIT" | "DEBIT";
  sourceType: string;
  sourceId: string;
  destinationType: string;
  destinationId: string;
  externalReference?: string;
  idempotencyKey: string;
}) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("INVALID_LEDGER_AMOUNT");

  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({ where: { slug: input.batchSlug } });
    if (!batch) throw new Error("BATCH_NOT_FOUND");

    const currency = input.currency ?? batch.currency;
    const account = await tx.ledgerAccount.findUnique({
      where: { batchId_type_currency: { batchId: batch.id, type: input.accountType, currency } },
    });

    if (!account) throw new Error("LEDGER_ACCOUNT_NOT_FOUND");
    if (account.status !== "ACTIVE") throw new Error("LEDGER_ACCOUNT_NOT_ACTIVE");

    const currentBalance = Number(account.balance);
    const signedAmount = input.direction === "CREDIT" ? input.amount : -input.amount;
    const nextBalance = currentBalance + signedAmount;

    if (nextBalance < 0) throw new Error("LEDGER_ACCOUNT_NEGATIVE_BALANCE_BLOCKED");

    const entry = await tx.escrowLedgerEntry.upsert({
      where: { idempotencyKey: input.idempotencyKey },
      update: {},
      create: {
        batchId: batch.id,
        type: input.entryType as never,
        amount: input.amount,
        currency,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        destinationType: input.destinationType,
        destinationId: input.destinationId,
        status: "POSTED",
        externalReference: input.externalReference,
        idempotencyKey: input.idempotencyKey,
        postedAt: new Date(),
      },
    });

    const updatedAccount = await tx.ledgerAccount.update({
      where: { id: account.id },
      data: { balance: nextBalance },
    });

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "LEDGER_ACCOUNT_POST",
        targetType: "LEDGER_ACCOUNT",
        targetId: account.id,
        before: { balance: currentBalance },
        after: {
          balance: nextBalance,
          direction: input.direction,
          amount: input.amount,
          entryId: entry.id,
          accountType: input.accountType,
        },
      },
    });

    return { account: updatedAccount, entry, previousBalance: currentBalance, nextBalance };
  });
}

export async function reconcileBatchLedger(batchSlug: string) {
  const batch = await prisma.batch.findUnique({
    where: { slug: batchSlug },
    include: { ledgerAccounts: true, ledgerEntries: true },
  });

  if (!batch) throw new Error("BATCH_NOT_FOUND");

  const postedEntries = batch.ledgerEntries.filter((entry) => entry.status === "POSTED");
  const accountBalanceTotal = batch.ledgerAccounts.reduce((sum, account) => sum + Number(account.balance), 0);
  const postedEntryTotal = postedEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);

  return {
    batch: { id: batch.id, slug: batch.slug, title: batch.title, currency: batch.currency },
    accountCount: batch.ledgerAccounts.length,
    postedEntryCount: postedEntries.length,
    accountBalanceTotal,
    postedEntryTotal,
    note: "Totals are operational checks. Double-entry settlement mapping comes after provider adapters are connected.",
  };
}
