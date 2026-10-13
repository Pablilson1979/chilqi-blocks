import { z } from "zod";

export const customerNumberSchema = z.string().trim()
  .regex(/^\d{6,7}$/, "Número de cliente debe tener entre 6 y 7 números");

function validRut(value: string) {
  const [body, digit] = value.toUpperCase().split("-");
  if (!body || !digit) return false;
  let sum = 0;
  let multiplier = 2;
  for (const number of [...body].reverse()) {
    sum += Number(number) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const result = 11 - (sum % 11);
  const expected = result === 11 ? "0" : result === 10 ? "K" : String(result);
  return digit === expected;
}

export const rutSchema = z.string().trim()
  .regex(/^\d{7,8}-[0-9kK]$/, "Ingresa tu RUT sin puntos y con guión. Ej: 12345678-5")
  .refine(validRut, "Revisa tu RUT: el dígito verificador no coincide.");

export function validatePayIdentifier(mode: "cliente" | "rut", value: string) {
  return (mode === "cliente" ? customerNumberSchema : rutSchema).safeParse(value);
}