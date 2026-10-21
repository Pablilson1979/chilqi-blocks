import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { validAdvanceAmount } from "./pago-adelantado";

describe("pago adelantado", () => {
  it("exige monto mínimo de $500", () => {
    assert.equal(validAdvanceAmount(499), false);
    assert.equal(validAdvanceAmount(500), true);
  });
});
