import test from "node:test";
import assert from "node:assert/strict";
import { canListSlot, canCancelMarketOrder, calculateSlotPnL, calculateTransferFee, deliveryCanBeChanged } from "../src/slots.ts";

test("allows listing active slots before delivery lock", () => {
  const result = canListSlot({
    batchStatus: "ACTIVE",
    slotStatus: "ACTIVE",
    quantity: 10,
    listedQuantity: 2,
    now: new Date("2026-01-01T00:00:00Z"),
    deliveryLockAt: new Date("2026-01-02T00:00:00Z"),
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.transferableQuantity, 8);
});

test("blocks listing after delivery lock", () => {
  const result = canListSlot({
    batchStatus: "ACTIVE",
    slotStatus: "ACTIVE",
    quantity: 10,
    listedQuantity: 0,
    now: new Date("2026-01-03T00:00:00Z"),
    deliveryLockAt: new Date("2026-01-02T00:00:00Z"),
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "DELIVERY_LOCK_REACHED");
});

test("allows cancelling open slot orders", () => {
  const result = canCancelMarketOrder({ status: "OPEN" });
  assert.equal(result.ok, true);
});

test("calculates slot P/L net of fees", () => {
  const pnl = calculateSlotPnL({ entryUnitPrice: 10, exitUnitPrice: 12, quantity: 5, transferFeeAmount: 1 });
  assert.equal(pnl.gross, 10);
  assert.equal(pnl.net, 9);
});

test("calculates transfer fee by basis points", () => {
  assert.equal(calculateTransferFee({ transferAmount: 100, feeBps: 150 }), 1.5);
});

test("blocks delivery change after allocating", () => {
  assert.equal(deliveryCanBeChanged({ batchStatus: "ALLOCATING", now: new Date() }), false);
});
