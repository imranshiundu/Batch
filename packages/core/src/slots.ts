export type SlotBatchStatus =
  | "OPEN"
  | "FUNDED"
  | "SUPPLIER_CONFIRMING"
  | "ACTIVE"
  | "PRODUCTION"
  | "SHIPPED"
  | "RECEIVED_AT_HUB"
  | "ALLOCATING"
  | "DELIVERING"
  | "DELIVERED"
  | "SETTLED"
  | "FAILED"
  | "REFUNDING"
  | "REFUNDED"
  | "DISPUTED"
  | "CANCELLED";

export type SlotStatus = "ACTIVE" | "LISTED" | "RESERVED" | "TRANSFERRING" | "TRANSFERRED" | "CANCELLED" | "LOCKED" | "DELIVERED" | "REFUNDED" | "DISPUTED";

export type SlotRuleError = { code: string; message: string };

export type SlotRuleResult<T> = { ok: true; data: T } | { ok: false; error: SlotRuleError };

export function canListSlot(input: {
  batchStatus: SlotBatchStatus;
  slotStatus: SlotStatus;
  quantity: number;
  listedQuantity: number;
  now: Date;
  deliveryLockAt?: Date | null;
}): SlotRuleResult<{ transferableQuantity: number }> {
  if (!["ACTIVE", "LISTED"].includes(input.slotStatus)) {
    return { ok: false, error: { code: "SLOT_NOT_LISTABLE", message: "Only active slots can be listed for transfer." } };
  }

  if (["ALLOCATING", "DELIVERING", "DELIVERED", "SETTLED", "FAILED", "REFUNDING", "REFUNDED", "DISPUTED", "CANCELLED"].includes(input.batchStatus)) {
    return { ok: false, error: { code: "BATCH_TRANSFER_LOCKED", message: "This batch no longer allows slot transfers." } };
  }

  if (input.deliveryLockAt && input.now >= input.deliveryLockAt) {
    return { ok: false, error: { code: "DELIVERY_LOCK_REACHED", message: "Delivery is locked for this batch." } };
  }

  const transferableQuantity = input.quantity - input.listedQuantity;
  if (transferableQuantity <= 0) {
    return { ok: false, error: { code: "NO_TRANSFERABLE_QUANTITY", message: "No quantity remains available for listing." } };
  }

  return { ok: true, data: { transferableQuantity } };
}

export function canCancelMarketOrder(input: { status: string; filledQuantity?: number }): SlotRuleResult<{ cancellable: true }> {
  if (!["OPEN", "PARTIALLY_FILLED"].includes(input.status)) {
    return { ok: false, error: { code: "ORDER_NOT_CANCELLABLE", message: "Only open or partially filled orders can be cancelled." } };
  }

  return { ok: true, data: { cancellable: true } };
}

export function calculateSlotPnL(input: {
  entryUnitPrice: number;
  exitUnitPrice: number;
  quantity: number;
  transferFeeAmount?: number;
}) {
  const gross = (input.exitUnitPrice - input.entryUnitPrice) * input.quantity;
  const fees = input.transferFeeAmount ?? 0;
  const net = gross - fees;
  const entryTotal = input.entryUnitPrice * input.quantity;
  const returnPercent = entryTotal > 0 ? (net / entryTotal) * 100 : 0;

  return {
    gross,
    fees,
    net,
    returnPercent,
  };
}

export function calculateTransferFee(input: { transferAmount: number; feeBps?: number; minimumFee?: number }) {
  const feeBps = input.feeBps ?? 150;
  const minimumFee = input.minimumFee ?? 0;
  const fee = Math.max(minimumFee, input.transferAmount * (feeBps / 10_000));
  return Math.round(fee * 100) / 100;
}

export function deliveryCanBeChanged(input: { batchStatus: SlotBatchStatus; now: Date; deliveryLockAt?: Date | null }) {
  if (["ALLOCATING", "DELIVERING", "DELIVERED", "SETTLED"].includes(input.batchStatus)) return false;
  if (input.deliveryLockAt && input.now >= input.deliveryLockAt) return false;
  return true;
}
