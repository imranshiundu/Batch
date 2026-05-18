import { prisma } from "@batch/db";

export async function persistPaymentEvent(input: {
  provider: "CIRCLE" | "ARC" | "MOCK" | "LOCAL_RAIL";
  eventType: string;
  externalId: string;
  payload: unknown;
}) {
  const existing = await prisma.paymentEvent.findUnique({ where: { externalId: input.externalId } });

  if (existing?.processedAt) {
    return { event: existing, replayed: true, alreadyProcessed: true };
  }

  const event = await prisma.paymentEvent.upsert({
    where: { externalId: input.externalId },
    update: {
      payload: input.payload as object,
      status: existing ? "REPLAYED" : "RECEIVED",
    },
    create: {
      provider: input.provider,
      eventType: input.eventType,
      externalId: input.externalId,
      payload: input.payload as object,
    },
  });

  return { event, replayed: Boolean(existing), alreadyProcessed: false };
}

export async function markPaymentEventProcessed(externalId: string) {
  return prisma.paymentEvent.update({
    where: { externalId },
    data: { status: "PROCESSED", processedAt: new Date() },
  });
}

export function mapWebhookProvider(provider: string) {
  if (provider === "circle") return "CIRCLE" as const;
  if (provider === "arc") return "ARC" as const;
  if (provider === "local") return "LOCAL_RAIL" as const;
  return "MOCK" as const;
}
