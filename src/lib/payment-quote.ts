import type { CollectorId } from "./pago-data";

export type PaymentQuote = { amount: number; commission: number; total: number; installments: number; installmentAmount: number; finalInstallment: number };

export function paymentQuote(amount: number, collector: CollectorId | null, installments = 1): PaymentQuote {
  const count = collector === "bemobi" && Number.isInteger(installments) && installments >= 1 && installments <= 12 ? installments : 1;
  const basisPoints = count === 1 ? 220 : count <= 6 ? 260 * count : 250 * count;
  const commission = collector === "bemobi" ? Math.round(amount * basisPoints / 10000) : 0;
  const total = amount + commission;
  const installmentAmount = Math.ceil(total / count);
  return { amount, commission, total, installments: count, installmentAmount, finalInstallment: total - installmentAmount * (count - 1) };
}