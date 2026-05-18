export type MarketSide = "BUY_COMMITMENT" | "SELL_SLOT";
export type MarketOrderType = "MARKET" | "LIMIT";
export type MarketInstrumentStatus = "OPEN" | "CLEARING" | "ACTIVE" | "DELIVERING" | "SETTLED" | "FAILED";

export type BatchInstrument = {
  symbol: string;
  batchSlug: string;
  title: string;
  status: MarketInstrumentStatus;
  currency: string;
  lastUnitPrice: number;
  minimumUnits: number;
  targetUnits: number;
  committedUnits: number;
  clearingProgress: number;
  tradable: boolean;
  settlementModel: "BATCH_COMMITMENT";
};

export type BatchDepth = {
  symbol: string;
  batchSlug: string;
  bidIntent: Array<{ quantity: number; unitPrice: number; source: "buyer-commitment" }>;
  availableSupply: Array<{ quantity: number; unitPrice: number; source: "batch-capacity" }>;
  transferableSlots: Array<{ quantity: number; unitPrice: number; source: "buyer-slot" }>;
};

export type MarketOrderRequest = {
  symbol: string;
  side: MarketSide;
  orderType: MarketOrderType;
  quantity: number;
  limitPrice?: number;
};
