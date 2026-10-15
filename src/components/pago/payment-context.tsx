import { createContext, useContext, useState, type ReactNode } from "react";
import type { CollectorId } from "@/lib/pago-data";

export type PaymentIdentity = { mode: "cliente" | "rut"; value: string };
export type PaymentOutcome = "success" | "error";
export type PaymentDraft = { choice: "total" | "previous" | "cutoff" | "custom"; custom: string; collector: CollectorId; email: string };
export type PaymentReceipt = { amount: number; collector: CollectorId; email: string; reference: string; date: string; outcome: PaymentOutcome };
type PaymentContextValue = {
  identity: PaymentIdentity | null;
  receipt: PaymentReceipt | null;
  draft: PaymentDraft | null;
  saveDraft: (draft: PaymentDraft) => void;
  retry: () => void;
  start: (identity: PaymentIdentity) => void;
  complete: (receipt: PaymentReceipt) => void;
  clear: () => void;
};
const PaymentContext = createContext<PaymentContextValue | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<PaymentIdentity | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [draft, setDraft] = useState<PaymentDraft | null>(null);
  return <PaymentContext.Provider value={{ identity, receipt, draft, saveDraft: setDraft, retry: () => setReceipt(null), start: (next) => { setIdentity(next); setReceipt(null); setDraft(null); }, complete: setReceipt, clear: () => { setIdentity(null); setReceipt(null); setDraft(null); } }}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("PaymentProvider is required");
  return context;
}