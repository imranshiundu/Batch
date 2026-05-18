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
  developerManifest: "/api/developers/bot-manifest",
  developerApiMap: "/api/developers/api-map",
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

export const batchApi = {
  health: () => apiGet(apiRoutes.health),
  listBatches: () => apiGet(apiRoutes.batches),
  getBatch: (slug: string) => apiGet(apiRoutes.batch(slug)),
  listMarketInstruments: () => apiGet(apiRoutes.marketInstruments),
  getMarketInstrument: (slug: string) => apiGet(apiRoutes.marketInstrument(slug)),
  getMarketDepth: (slug: string) => apiGet(apiRoutes.marketDepth(slug)),
  placeMarketOrder: (body: unknown, idempotencyKey: string, role = "BUYER") => apiPost(apiRoutes.marketOrders, body, {
    headers: {
      "Idempotency-Key": idempotencyKey,
      "x-batch-demo-role": role,
    },
  }),
};
