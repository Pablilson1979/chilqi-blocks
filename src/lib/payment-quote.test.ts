import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { paymentQuote } from "./payment-quote";

describe("Comisión Bemobi", () => {
  it("aplica 2,2% en un pago", () => {
    assert.equal(paymentQuote(100000, "bemobi", 1).commission, 2200);
  });
  it("aplica 2,60% por cuota entre 2 y 6", () => {
    for (let count = 2; count <= 6; count++) assert.equal(paymentQuote(100000, "bemobi", count).commission, 2600 * count);
  });
  it("aplica 2,50% por cuota entre 7 y 12", () => {
    for (let count = 7; count <= 12; count++) assert.equal(paymentQuote(100000, "bemobi", count).commission, 2500 * count);
  });
  it("redondea a pesos y conserva el total al ajustar la última cuota", () => {
    const quote = paymentQuote(107459, "bemobi", 3);
    assert.equal(quote.commission, 8382);
    assert.equal(quote.total, 115841);
    assert.equal(quote.installmentAmount, 38614);
    assert.equal(quote.finalInstallment, 38613);
    assert.equal(quote.installmentAmount * 2 + quote.finalInstallment, quote.total);
  });
  it("no conserva comisiones ni cuotas de Bemobi al cambiar de recaudador", () => {
    for (const collector of ["bancoestado", "mach", "servipag", "unired"] as const) {
      assert.deepEqual(paymentQuote(100000, collector, 12), { amount: 100000, commission: 0, total: 100000, installments: 1, installmentAmount: 100000, finalInstallment: 100000 });
    }
  });
  it("no admite cantidades fuera de 1 a 12 cuotas", () => {
    for (const count of [0, 13, 2.5, NaN]) assert.equal(paymentQuote(100000, "bemobi", count).installments, 1);
  });
});