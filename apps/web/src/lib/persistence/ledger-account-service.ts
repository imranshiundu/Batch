import { prisma } from "@batch/db";

const defaultAccountTypes = [
  "BATCH_ESCROW",
  "SUPPLIER_PAYABLE",
  "LOGISTICS_PAYABLE",
  "PLATFORM_FEE",
  "REFUND_RESERVE",
  "SPV_CONTROL",
] as const;

export async function provisionBatchLedgerAccounts(input: { actorId: string; batchSlug: string }) {
  return prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({ where: { slug: input.batchSlug } });
    if (!batch) throw new Error("BATCH_NOT_FOUND");

    const accounts = [];

    for (const type of defaultAccountTypes) {
      const account = await tx.ledgerAccount.upsert({
        where: { batchId_type_currency: { batchId: batch.id, type, currency: batch.currency } },
        update: {},
        create: {
          batchId: batch.id,
          type,
          label: labelFor(type, batch.slug),
          currency: batch.currency,
          metadata: {
            legalNote: type === "SPV_CONTROL" ? "Operational control account only. Not a formed legal SPV by itself." : undefined,
          },
        },
      });
      accounts.push(account);
    }

    await tx.auditEvent.create({
      data: {
        actorId: input.actorId,
        actorRole: "OPERATOR",
        action: "LEDGER_ACCOUNTS_PROVISION",
        targetType: "BATCH",
        targetId: batch.id,
        after: { accountTypes: defaultAccountTypes },
      },
    });

    return accounts;
  });
}

export async function listBatchLedgerAccounts(batchSlug: string) {
  const batch = await prisma.batch.findUnique({ where: { slug: batchSlug }, include: { ledgerAccounts: { orderBy: { type: "asc" } } } });
  if (!batch) throw new Error("BATCH_NOT_FOUND");
  return { batch: { id: batch.id, slug: batch.slug, title: batch.title, currency: batch.currency }, accounts: batch.ledgerAccounts };
}

function labelFor(type: string, slug: string) {
  const readable = type.toLowerCase().replaceAll("_", " ");
  return `${slug} ${readable}`;
}
