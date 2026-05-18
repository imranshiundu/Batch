import test from "node:test";
import assert from "node:assert/strict";
import { quoteCommitment, wouldClearAfterCommitment } from "../src/commitments.ts";

const batch = {
  id: "batch_1",
  status: "OPEN",
  type: "IMPORT_BATCH",
  minimumUnits: 10,
  targetUnits: 20,
  committedUnits: 8,
  minimumAmount: 100,
  committedAmount: 80,
  deadlineAt: new Date(Date.now() + 1000 * 60 * 60),
  riskLevel: "MEDIUM",
  supplierConfirmed: false,
};

test("quotes buyer commitment", () => {
  const result = quoteCommitment(batch, {
    buyerId: "buyer_1",
    batchId: "batch_1",
    quantity: 2,
    unitPrice: 10,
    currency: "USD",
    now: new Date(),
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.totalAmount, 20);
});

test("detects clearing commitment", () => {
  assert.equal(wouldClearAfterCommitment(batch, 2, 20), true);
});
