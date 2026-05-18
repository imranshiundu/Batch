import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { batchPrisma?: PrismaClient };

export const prisma = globalForPrisma.batchPrisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.batchPrisma = prisma;
}

export type BatchPrismaClient = typeof prisma;
export type BatchTransaction = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];
