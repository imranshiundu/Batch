import { batches, progress } from "@/lib/data";
import type { Batch, BatchStatus } from "@/lib/data";
import type { BatchDepth, BatchInstrument, MarketOrderRequest } from "./market-types";

export function toInstrument(batch: Batch): BatchInstrument {
  return {
    symbol: batch.slug.toUpperCase().replace(/-/g, "_"),
    batchSlug: batch.slug,
    title: batch.title,
    status: mapStatus(batch.status),
    currency: batch.currency,
    lastUnitPrice: batch.batchPrice,
    minimumUnits: batch.minimumUnits,
    targetUnits: batch.targetUnits,
    committedUnits: batch.committedUnits,
    clearingProgress: progress(batch),
    tradable: ["OPEN", "FUNDED", "ACTIVE", "RECEIVED_AT_HUB"].includes(batch.status),
    settlementModel: "BATCH_COMMITMENT",
  };
}

export function listBatchInstruments() {
  return batches.map(toInstrument);
}

export function findInstrumentBySlug(slugOrSymbol: string) {
  const normalized = slugOrSymbol.toLowerCase().replace(/_/g, "-");
  const batch = batches.find((item) => item.slug === normalized || item.slug.toUpperCase().replace(/-/g, "_") === slugOrSymbol.toUpperCase());
  return batch ? toInstrument(batch) : null;
}

export function getBatchDepth(slugOrSymbol: string): BatchDepth | null {
  const normalized = slugOrSymbol.toLowerCase().replace(/_/g, "-");
  const batch = batches.find((item) => item.slug === normalized || item.slug.toUpperCase().replace(/-/g, "_") === slugOrSymbol.toUpperCase());
  if (!batch) return null;

  const remainingToMinimum = Math.max(0, batch.minimumUnits - batch.committedUnits);
  const remainingToTarget = Math.max(0, batch.targetUnits - batch.committedUnits);

  return {
    symbol: batch.slug.toUpperCase().replace(/-/g, "_"),
    batchSlug: batch.slug,
    bidIntent: [
      { quantity: batch.committedUnits, unitPrice: batch.batchPrice, source: "buyer-commitment" },
    ],
    availableSupply: [
      { quantity: remainingToMinimum || remainingToTarget, unitPrice: batch.batchPrice, source: "batch-capacity" },
    ],
    transferableSlots: batch.status === "RECEIVED_AT_HUB" ? [
      { quantity: Math.max(1, Math.floor(batch.committedUnits * 0.05)), unitPrice: batch.batchPrice, source: "buyer-slot" },
    ] : [],
  };
}

export function validateMarketOrder(order: MarketOrderRequest) {
  const instrument = findInstrumentBySlug(order.symbol);
  if (!instrument) {
    return { ok: false as const, error: { code: "INSTRUMENT_NOT_FOUND", message: "Batch instrument was not found." } };
  }

  if (!instrument.tradable) {
    return { ok: false as const, error: { code: "INSTRUMENT_NOT_TRADABLE", message: "This batch is not currently tradable." } };
  }

  if (order.quantity <= 0 || !Number.isInteger(order.quantity)) {
    return { ok: false as const, error: { code: "INVALID_ORDER_QUANTITY", message: "Order quantity must be a positive whole number." } };
  }

  if (order.side === "BUY_COMMITMENT") {
    return { ok: true as const, data: { instrument, action: "CREATE_BATCH_COMMITMENT" } };
  }

  return { ok: true as const, data: { instrument, action: "CREATE_SLOT_TRANSFER_INTENT" } };
}

function mapStatus(status: BatchStatus) {
  if (status === "OPEN") return "OPEN";
  if (status === "FUNDED") return "CLEARING";
  if (status === "ACTIVE" || status === "PRODUCTION" || status === "SHIPPED") return "ACTIVE";
  if (status === "RECEIVED_AT_HUB") return "DELIVERING";
  if (status === "FAILED") return "FAILED";
  return "OPEN";
}
