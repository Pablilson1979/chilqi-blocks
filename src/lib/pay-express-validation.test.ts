import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { customerNumberSchema, rutSchema } from "./pay-express-validation";

describe("Pago express: número de cliente", () => {
  test("acepta números de 6 y 7 dígitos", () => {
    assert.equal(customerNumberSchema.safeParse("123123").success, true);
    assert.equal(customerNumberSchema.safeParse("1234567").success, true);
  });
  test("rechaza números fuera del rango de 6 a 7 dígitos", () => {
    for (const value of ["", "123", "12345", "12345678"]) {
      assert.equal(customerNumberSchema.safeParse(value).success, false);
    }
  });
  test("rechaza guión, dígito verificador y caracteres no numéricos", () => {
    for (const value of ["123456-7", "12345K", "123.456", "<script>"]) {
      assert.equal(customerNumberSchema.safeParse(value).success, false);
    }
  });
});

describe("Pago express: RUT", () => {
  test("valida formato y dígito verificador", () => {
    assert.equal(rutSchema.safeParse("12345678-5").success, true);
    assert.equal(rutSchema.safeParse("12345678-9").success, false);
    assert.equal(rutSchema.safeParse("12.345.678-5").success, false);
  });
});