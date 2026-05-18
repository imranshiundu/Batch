import { prisma } from "@batch/db";
import { botScopes, type BotScope } from "@/lib/security/bot-scopes";
import { generateBotApiKey, hashBotApiKey, previewKey } from "@/lib/security/api-key-crypto";

const allowedScopes = new Set<string>(Object.values(botScopes));

export function sanitizeScopes(scopes: string[]) {
  return [...new Set(scopes)].filter((scope) => allowedScopes.has(scope));
}

export async function createBotApiKey(input: {
  ownerId: string;
  ownerRole: "BUYER" | "SUPPLIER" | "OPERATOR" | "ADMIN";
  name: string;
  scopes: string[];
  expiresAt?: Date;
}) {
  const scopes = sanitizeScopes(input.scopes);
  if (!scopes.length) throw new Error("BOT_SCOPE_REQUIRED");

  const generated = generateBotApiKey();

  const record = await prisma.botApiKey.create({
    data: {
      ownerId: input.ownerId,
      name: input.name,
      prefix: generated.prefix,
      keyHash: generated.keyHash,
      scopes,
      expiresAt: input.expiresAt,
    },
  });

  await prisma.auditEvent.create({
    data: {
      actorId: input.ownerId,
      actorRole: input.ownerRole,
      action: "BOT_API_KEY_CREATE",
      targetType: "BOT_API_KEY",
      targetId: record.id,
      after: { name: record.name, prefix: record.prefix, scopes: record.scopes, expiresAt: record.expiresAt },
    },
  });

  return {
    key: generated.key,
    preview: previewKey(generated.key),
    record: maskBotApiKey(record),
  };
}

export async function listBotApiKeys(ownerId: string) {
  const records = await prisma.botApiKey.findMany({ where: { ownerId }, orderBy: { createdAt: "desc" } });
  return records.map(maskBotApiKey);
}

export async function revokeBotApiKey(input: { ownerId: string; ownerRole: "BUYER" | "SUPPLIER" | "OPERATOR" | "ADMIN"; keyId: string; reason?: string }) {
  const record = await prisma.botApiKey.findFirst({ where: { id: input.keyId, ownerId: input.ownerId } });
  if (!record) throw new Error("BOT_API_KEY_NOT_FOUND");

  const updated = await prisma.botApiKey.update({ where: { id: record.id }, data: { status: "REVOKED", revokedAt: new Date() } });

  await prisma.auditEvent.create({
    data: {
      actorId: input.ownerId,
      actorRole: input.ownerRole,
      action: "BOT_API_KEY_REVOKE",
      targetType: "BOT_API_KEY",
      targetId: updated.id,
      before: { status: record.status },
      after: { status: updated.status },
      reason: input.reason,
    },
  });

  return maskBotApiKey(updated);
}

export async function verifyStoredBotApiKey(key: string, requiredScope: BotScope) {
  const keyHash = hashBotApiKey(key);
  const record = await prisma.botApiKey.findUnique({ where: { keyHash }, include: { owner: true } });

  if (!record) return { ok: false as const, error: "BOT_KEY_INVALID" };
  if (record.status !== "ACTIVE") return { ok: false as const, error: "BOT_KEY_INACTIVE" };
  if (record.expiresAt && record.expiresAt <= new Date()) return { ok: false as const, error: "BOT_KEY_EXPIRED" };
  if (!record.scopes.includes(requiredScope)) return { ok: false as const, error: "BOT_SCOPE_DENIED" };

  await prisma.botApiKey.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } });

  return {
    ok: true as const,
    data: {
      keyId: record.id,
      ownerId: record.ownerId,
      ownerRole: record.owner.role,
      scopes: record.scopes,
    },
  };
}

function maskBotApiKey(record: { id: string; name: string; prefix: string; scopes: string[]; status: string; lastUsedAt: Date | null; expiresAt: Date | null; createdAt: Date; updatedAt: Date }) {
  return {
    id: record.id,
    name: record.name,
    prefix: record.prefix,
    scopes: record.scopes,
    status: record.status,
    lastUsedAt: record.lastUsedAt,
    expiresAt: record.expiresAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}
