import { createHash } from "node:crypto";
import { prisma } from "@batch/db";

export function hashRequestBody(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value ?? {})).digest("hex");
}

export async function beginIdempotentOperation(input: {
  key: string;
  actorId?: string;
  route: string;
  requestBody: unknown;
}) {
  const requestHash = hashRequestBody(input.requestBody);
  const existing = await prisma.idempotencyRecord.findUnique({ where: { key: input.key } });

  if (existing) {
    if (existing.requestHash !== requestHash) {
      return { ok: false as const, status: "CONFLICT", record: existing };
    }

    return { ok: true as const, status: existing.status, record: existing };
  }

  const record = await prisma.idempotencyRecord.create({
    data: {
      key: input.key,
      actorId: input.actorId,
      route: input.route,
      requestHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  return { ok: true as const, status: "PROCESSING", record };
}

export async function completeIdempotentOperation(input: { key: string; responseBody: unknown }) {
  return prisma.idempotencyRecord.update({
    where: { key: input.key },
    data: {
      status: "COMPLETED",
      responseBody: input.responseBody as object,
      completedAt: new Date(),
    },
  });
}

export async function failIdempotentOperation(input: { key: string; responseBody?: unknown }) {
  return prisma.idempotencyRecord.update({
    where: { key: input.key },
    data: {
      status: "FAILED",
      responseBody: (input.responseBody ?? {}) as object,
      completedAt: new Date(),
    },
  });
}
