import { createHash, randomBytes } from "node:crypto";

const KEY_PREFIX = "batch_live";

export function generateBotApiKey() {
  const secret = randomBytes(32).toString("base64url");
  const key = `${KEY_PREFIX}_${secret}`;
  return {
    key,
    prefix: key.slice(0, 18),
    keyHash: hashBotApiKey(key),
  };
}

export function hashBotApiKey(key: string) {
  return createHash("sha256").update(key).digest("hex");
}

export function previewKey(key: string) {
  return `${key.slice(0, 18)}...${key.slice(-4)}`;
}
