export const DEMO_ACCOUNT = {
  customer: "123123",
  address: "V LAFON 947",
  dueDate: "28/10/2026",
  billNumber: "10456892",
  total: 68049,
  previous: 40026,
  current: 28023,
};

export type CollectorId = "bemobi" | "bancoestado" | "mach" | "servipag" | "unired";
export type PaymentTab = "express" | "otros";
export const COLLECTORS: { id: CollectorId; name: string; type: string; limit: number; tab: PaymentTab; installments?: number }[] = [
  { id: "bemobi", name: "Bemobi", type: "Crédito", limit: 1000000, tab: "express", installments: 12 },
  { id: "bancoestado", name: "BancoEstado", type: "Débito", limit: 400000000, tab: "express" },
  { id: "mach", name: "Bci / MACH", type: "Débito", limit: 3000000, tab: "express" },
  { id: "servipag", name: "Servipag", type: "Débito", limit: 3000000, tab: "express" },
  { id: "unired", name: "Unired", type: "Débito y crédito", limit: 1000000, tab: "otros" },
];

export const pesos = (amount: number) => `$${new Intl.NumberFormat("es-CL").format(amount)}`;
export function validAmount(amount: number) {
  return Number.isSafeInteger(amount) && amount >= 100;
}
export function eligibleCollector(id: CollectorId, amount: number) {
  const collector = COLLECTORS.find((item) => item.id === id);
  return Boolean(collector && validAmount(amount) && amount <= collector.limit);
}
export function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
export function canPay(amount: number, collector: CollectorId | null, email: string) {
  return collector !== null && eligibleCollector(collector, amount) && validEmail(email);
}
export function firstEligible(tab: PaymentTab, amount: number): CollectorId | null {
  return COLLECTORS.find((item) => item.tab === tab && eligibleCollector(item.id, amount))?.id ?? null;
}