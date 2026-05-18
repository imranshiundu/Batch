export type ApiEnvelope<T> = {
  ok: boolean;
  data: T | null;
  meta: Record<string, unknown>;
  error: null | {
    code: string;
    message: string;
    detail?: Record<string, unknown>;
  };
};

export const apiRoutes = {
  health: "/api/health",
  batches: "/api/public/batches",
  batch: (slug: string) => `/api/public/batches/${slug}`,
  buyerDashboard: "/api/buyer/dashboard",
  buyerCommitments: "/api/buyer/commitments",
  marketInstruments: "/api/market/instruments",
  marketInstrument: (slug: string) => `/api/market/instruments/${slug}`,
  marketDepth: (slug: string) => `/api/market/instruments/${slug}/depth`,
  marketOrders: "/api/market/orders",
  slots: "/api/slots",
  slotListings: "/api/slots/listings",
  slotListingPurchase: (listingId: string) => `/api/slots/listings/${listingId}/purchase`,
  slotOrders: "/api/slots/orders",
  slotOrderReserve: (orderId: string) => `/api/slots/orders/${orderId}/reserve`,
  slotOrderCancel: (orderId: string) => `/api/slots/orders/${orderId}/cancel`,
  slotPnl: "/api/slots/pnl",
  deliveryProfiles: "/api/profile/delivery",
  developerManifest: "/api/developers/bot-manifest",
  developerApiMap: "/api/developers/api-map",
  developerApiKeys: "/api/developers/api-keys",
  developerApiKeyRevoke: (keyId: string) => `/api/developers/api-keys/${keyId}/revoke`,
};

export async function apiGet<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const response = await fetch(path, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  return response.json();
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const response = await fetch(path, {
    method: "POST",
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });

  return response.json();
}

function idempotencyHeaders(idempotencyKey: string, role = "BUYER") {
  return {
    "Idempotency-Key": idempotencyKey,
    "x-batch-demo-role": role,
  };
}

export const batchApi = {
  health: () => apiGet(apiRoutes.health),
  listBatches: () => apiGet(apiRoutes.batches),
  getBatch: (slug: string) => apiGet(apiRoutes.batch(slug)),
  listMarketInstruments: () => apiGet(apiRoutes.marketInstruments),
  getMarketInstrument: (slug: string) => apiGet(apiRoutes.marketInstrument(slug)),
  getMarketDepth: (slug: string) => apiGet(apiRoutes.marketDepth(slug)),
  placeMarketOrder: (body: unknown, idempotencyKey: string, role = "BUYER") => apiPost(apiRoutes.marketOrders, body, {
    headers: idempotencyHeaders(idempotencyKey, role),
  }),
  listSlots: () => apiGet(apiRoutes.slots, { headers: { "x-batch-demo-role": "BUYER" } }),
  listSlotOrders: () => apiGet(apiRoutes.slotOrders, { headers: { "x-batch-demo-role": "BUYER" } }),
  createSlotOrder: (body: unknown, idempotencyKey: string) => apiPost(apiRoutes.slotOrders, body, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
  reserveSlotOrder: (orderId: string, idempotencyKey: string) => apiPost(apiRoutes.slotOrderReserve(orderId), {}, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
  createSlotListing: (body: unknown, idempotencyKey: string) => apiPost(apiRoutes.slotListings, body, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
  purchaseSlotListing: (listingId: string, body: unknown, idempotencyKey: string) => apiPost(apiRoutes.slotListingPurchase(listingId), body, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
  cancelSlotOrder: (orderId: string, body: unknown, idempotencyKey: string) => apiPost(apiRoutes.slotOrderCancel(orderId), body, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
  getSlotPnl: () => apiGet(apiRoutes.slotPnl, { headers: { "x-batch-demo-role": "BUYER" } }),
  listDeliveryProfiles: () => apiGet(apiRoutes.deliveryProfiles, { headers: { "x-batch-demo-role": "BUYER" } }),
  listDeveloperApiKeys: () => apiGet(apiRoutes.developerApiKeys, { headers: { "x-batch-demo-role": "BUYER" } }),
  createDeveloperApiKey: (body: unknown, idempotencyKey: string) => apiPost(apiRoutes.developerApiKeys, body, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
  revokeDeveloperApiKey: (keyId: string, body: unknown, idempotencyKey: string) => apiPost(apiRoutes.developerApiKeyRevoke(keyId), body, {
    headers: idempotencyHeaders(idempotencyKey),
  }),
};
