import { useCallback, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChilquintaModal } from "@/components/chilquinta/modal";
import { canPay, DEMO_ACCOUNT, eligibleCollector, pesos, validAmount, type CollectorId } from "@/lib/pago-data";
import { CollectorStep } from "./collector-step";
import { AccountSummary, MissingPayment, PaymentHeading, PaymentShell } from "./payment-shared";
import { usePayment, type PaymentOutcome } from "./payment-context";

const LOGOS: Record<CollectorId, string> = { bemobi: bemobi.url, bancoestado: bancoestado.url, mach: mach.url, servipag: servipag.url, unired: unired.url };
import { AmountStep, BalanceLoader, amountFor, type AmountChoice } from "./amount-step";

export function PaymentFlow() {
  const payment = usePayment();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(payment.draft ? 2 : 1);
  const [loading, setLoading] = useState(!payment.draft);
  const doneLoading = useCallback(() => setLoading(false), []);
  const [choice, setChoice] = useState<AmountChoice>(payment.draft?.choice ?? "total");
  const [custom, setCustom] = useState(payment.draft?.custom ?? "");
  const [detail, setDetail] = useState(false);
  const [collector, setCollector] = useState<CollectorId | null>(payment.draft?.collector ?? null);
  const [email, setEmail] = useState(payment.draft?.email ?? "");
  const [processing, setProcessing] = useState(false);
  const submitting = useRef(false);
  const amount = amountFor(choice, custom);
  const valid = validAmount(amount);
  const ready = canPay(amount, collector, email);

  function changeStep(next: 1 | 2) {
    if (next === 2 && !valid) return;
    if (next === 2 && collector && !eligibleCollector(collector, amount)) setCollector(null);
    setStep(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  async function submitPayment(outcome: PaymentOutcome) {
    if (!ready || !collector || !payment.identity || submitting.current) return;
    submitting.current = true;
    setProcessing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 1200));
    payment.saveDraft({ choice, custom, collector, email });
    payment.complete({ outcome, amount, collector, email: email.trim(), reference: `QA-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, date: new Date().toLocaleString("es-CL") });
    await navigate({ to: "/pago-resultado" });
  }

  return <PaymentShell>{!payment.identity ? <MissingPayment /> : <>
    <PaymentHeading step={step} />
    <AccountSummary />
    {step === 1 ? (loading ? <BalanceLoader onDone={doneLoading} /> : <AmountStep choice={choice} setChoice={setChoice} custom={custom} setCustom={setCustom} amount={amount} valid={valid} onContinue={() => changeStep(2)} onDetail={() => setDetail(true)} onOther={payment.clear} customer={payment.identity.mode === "cliente" ? payment.identity.value : DEMO_ACCOUNT.customer} />) : <CollectorStep amount={amount} customer={payment.identity.mode === "cliente" ? payment.identity.value : DEMO_ACCOUNT.customer} collector={collector} setCollector={setCollector} email={email} setEmail={setEmail} processing={processing} onBack={() => changeStep(1)} onOther={() => { payment.clear(); void navigate({ to: "/" }); }} onSubmit={(outcome) => void submitPayment(outcome)} />)}
    <p className="mt-6 text-center text-sm text-muted-foreground">Prueba QA · No se realizarán cobros ni se enviarán correos.</p>
    <ChilquintaModal title="Detalle de tu boleta" open={detail} onOpenChange={setDetail} cancelLabel="Cerrar" confirmLabel="Volver al pago" onConfirm={() => setDetail(false)}><div className="space-y-3 text-base"><p>Boleta de prueba N° {DEMO_ACCOUNT.billNumber}</p><p>{DEMO_ACCOUNT.address}</p><dl className="space-y-3"><div className="flex justify-between gap-4"><dt>Saldo actual</dt><dd>{pesos(DEMO_ACCOUNT.current)}</dd></div><div className="flex justify-between gap-4"><dt>Saldo anterior</dt><dd>{pesos(DEMO_ACCOUNT.previous)}</dd></div><div className="flex justify-between gap-4 border-t border-border pt-3 font-bold"><dt>Saldo total</dt><dd>{pesos(DEMO_ACCOUNT.total)}</dd></div></dl><p>Vencimiento: {DEMO_ACCOUNT.dueDate}</p></div></ChilquintaModal>
  </>}</PaymentShell>;
}