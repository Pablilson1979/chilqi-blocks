export const ADVANCE_MIN = 500;
export const ADVANCE_DEMO = { customer: "110095", address: "YUNGAY 584", lastPaid: 21846, lastDate: "05/10/2026", lastKwh: 69.9 };
/** Clientes de prueba con deuda: no pueden pagar por adelantado. */
export const ADVANCE_DEBT_CUSTOMERS = ["123123"];
export function validAdvanceAmount(amount: number) {
  return Number.isSafeInteger(amount) && amount >= ADVANCE_MIN && amount <= 1000000;
}
