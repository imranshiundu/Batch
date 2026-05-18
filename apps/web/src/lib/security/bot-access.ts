import { fail } from "@/lib/api-response";
import { hasBotScope, type BotScope } from "@/lib/security/bot-scopes";

export function requireBotScope(request: Request, scope: BotScope) {
  const botKey = request.headers.get("x-batch-bot-key");
  const scopeHeader = request.headers.get("x-batch-bot-scopes");

  if (!botKey && !scopeHeader) return null;

  if (!botKey) {
    return fail({ code: "BOT_KEY_REQUIRED", message: "Bot requests must include x-batch-bot-key." }, 401);
  }

  if (!hasBotScope(request.headers, scope)) {
    return fail({ code: "BOT_SCOPE_DENIED", message: `Bot key does not include required scope: ${scope}.` }, 403);
  }

  return null;
}

export function getBotContext(request: Request) {
  const botKey = request.headers.get("x-batch-bot-key");
  if (!botKey) return null;

  return {
    keyPreview: `${botKey.slice(0, 8)}...`,
    scopes: request.headers.get("x-batch-bot-scopes") ?? "",
  };
}
