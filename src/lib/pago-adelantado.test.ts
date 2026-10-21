import { describe, expect, it } from "vitest";
import { validAdvanceAmount } from "./pago-adelantado";

describe("pago adelantado", () => {
  it("exige monto mínimo de $500", () => {
    expect(validAdvanceAmount(499)).toBe(false);
    expect(validAdvanceAmount(500)).toBe(true);
  });
});
