import { prisma } from "@batch/db";

export async function persistPaymentEvent(input: {
  provider: "CIRCLE" | "ARC" | "MOCK" | "LOCAL_RAIL";
  eventType: string;
  externalId: string;
  payload: unknown;
}) {
  return prisma.paymentEvent.upsert({
    where: { externalId: input.externalId },
    update: {
      payload: input.payload as object,
      status: "RECEIVED",
    },
    create: {
      provider: input.provider,
      eventType: input.eventType,
      externalId: input.externalId,
      payload: input.payload as object,
    },
  });
}

export function mapWebhookProvider(provider: string) {
  if (provider === "circle") return "CIRCLE" as const;
  if (provider === "arc") return "ARC" as const;
  if (provider === "local") return "LOCAL_RAIL" as const;
  return "MOCK" as const;
}
