import { createContext, useContext, useState, type ReactNode } from "react";
import type { CollectorId } from "@/lib/pago-data";

export type PaymentIdentity = { mode: "cliente" | "rut"; value: string };
export type PaymentReceipt = { amount: number; collector: CollectorId; email: string; reference: string; date: string };
type PaymentContextValue = {
  identity: PaymentIdentity | null;
  receipt: PaymentReceipt | null;
  start: (identity: PaymentIdentity) => void;
  complete: (receipt: PaymentReceipt) => void;
  clear: () => void;
};
const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<PaymentIdentity | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  return <PaymentContext.Provider value={{ identity, receipt, start: (next) => { setIdentity(next); setReceipt(null); }, complete: setReceipt, clear: () => { setIdentity(null); setReceipt(null); } }}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("PaymentProvider is required");
  return context;
}