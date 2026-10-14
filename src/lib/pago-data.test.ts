import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { canPay, COLLECTORS, DEMO_ACCOUNT, eligibleCollector, firstEligible, validAmount, validEmail } from "./pago-data";

describe("Pago en línea", () => {
  it("respeta el mínimo de $1.000 y exige pesos enteros", () => {
    assert.equal(validAmount(999), false);
    assert.equal(validAmount(1000), true);
    assert.equal(validAmount(1000.5), false);
    assert.equal(validAmount(NaN), false);
  });
  it("mantiene total $107.459, mes anterior $79.436 y evitar corte $39.410", () => {
    assert.equal(DEMO_ACCOUNT.total, 107459);
    assert.equal(DEMO_ACCOUNT.previous, 79436);
    assert.equal(DEMO_ACCOUNT.cutoff, 39410);
    assert.equal(DEMO_ACCOUNT.current + DEMO_ACCOUNT.previous, DEMO_ACCOUNT.total);
  });
  for (const [id, limit] of [["bemobi", 1000000], ["bancoestado", 400000000], ["mach", 3000000], ["servipag", 3000000], ["unired", 1000000]] as const) {
    it(`respeta el límite ${limit} de ${id}`, () => {
      assert.equal(eligibleCollector(id, limit), true);
      assert.equal(eligibleCollector(id, limit + 1), false);
    });
  }
  it("Bemobi admite hasta 12 cuotas", () => assert.equal(COLLECTORS.find((item) => item.id === "bemobi")?.installments, 12));
  it("requiere correo válido", () => {
    assert.equal(validEmail(""), false);
    assert.equal(validEmail("persona@"), false);
    assert.equal(validEmail("qa@example.com"), true);
  });
  it("impide pagar sin monto, recaudador o correo válidos", () => {
    assert.equal(canPay(999, "bemobi", "qa@example.com"), false);
    assert.equal(canPay(68049, null, "qa@example.com"), false);
    assert.equal(canPay(68049, "bemobi", ""), false);
    assert.equal(canPay(1000001, "bemobi", "qa@example.com"), false);
    assert.equal(canPay(68049, "bemobi", "qa@example.com"), true);
  });
  it("cada pestaña selecciona solo recaudadores visibles y compatibles", () => {
    assert.equal(firstEligible("otros", 68049), "unired");
    assert.equal(firstEligible("express", 1000001), "bancoestado");
    assert.equal(firstEligible("otros", 1000001), null);
  });
});