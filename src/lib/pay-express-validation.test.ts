import { describe, expect, test } from "bun:test";
import { customerNumberSchema, rutSchema } from "./pay-express-validation";

describe("Pago express: número de cliente", () => {
  test("acepta números de 6 y 7 dígitos", () => {
    expect(customerNumberSchema.safeParse("123123").success).toBe(true);
    expect(customerNumberSchema.safeParse("1234567").success).toBe(true);
  });
  test("rechaza números fuera del rango de 6 a 7 dígitos", () => {
    for (const value of ["", "123", "12345", "12345678"]) {
      expect(customerNumberSchema.safeParse(value).success).toBe(false);
    }
  });
  test("rechaza guión, dígito verificador y caracteres no numéricos", () => {
    for (const value of ["123456-7", "12345K", "123.456", "<script>"]) {
      expect(customerNumberSchema.safeParse(value).success).toBe(false);
    }
  });
});

describe("Pago express: RUT", () => {
  test("valida formato y dígito verificador", () => {
    expect(rutSchema.safeParse("12345678-5").success).toBe(true);
    expect(rutSchema.safeParse("12345678-9").success).toBe(false);
    expect(rutSchema.safeParse("12.345.678-5").success).toBe(false);
  });
});