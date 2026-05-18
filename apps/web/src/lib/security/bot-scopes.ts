export const botScopes = {
  readMarket: "market:read",
  readDepth: "market:depth:read",
  createOrders: "orders:create",
  cancelOrders: "orders:cancel",
  readSlots: "slots:read",
  createSlotListings: "slots:listings:create",
  purchaseSlotListings: "slots:listings:purchase",
  readPnL: "slots:pnl:read",
  readDelivery: "delivery:read",
  writeDelivery: "delivery:write",
} as const;

export type BotScope = typeof botScopes[keyof typeof botScopes];

export function parseScopeHeader(value: string | null) {
  if (!value) return [] as string[];
  return value.split(/[ ,]+/).map((scope) => scope.trim()).filter(Boolean);
}

export function hasBotScope(headers: Headers, required: BotScope) {
  const scopes = parseScopeHeader(headers.get("x-batch-bot-scopes"));
  return scopes.includes(required);
}

export function describeBotScopes() {
  return Object.entries(botScopes).map(([key, scope]) => ({ key, scope }));
}
