import test from "node:test";
import assert from "node:assert/strict";
import { assertTransition } from "../src/state-machine.ts";

test("allows valid batch transitions", () => {
  const result = assertTransition("OPEN", "FUNDED");
  assert.equal(result.ok, true);
});

test("blocks invalid batch transitions", () => {
  const result = assertTransition("OPEN", "SETTLED");
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "INVALID_BATCH_TRANSITION");
});
