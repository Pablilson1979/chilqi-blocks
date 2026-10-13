import { useId, useState } from "react";
import { AlertCircle, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerNumberHelp } from "@/components/home/customer-number-help";
import { validatePayIdentifier } from "@/lib/pay-express-validation";

type PayMode = "cliente" | "rut";

const modes: {
  id: PayMode;
  label: string;
  helper: string;
  helperAccent: string;
  placeholder: string;
}[] = [
  {
    id: "cliente",
    label: "N° de cliente",
    helper: "Ingresa tu número de cliente",
    helperAccent: "sin guión:",
    placeholder: "Ej: 1234567",
  },
  {
    id: "rut",
    label: "Rut",
    helper: "Ingresa tu Rut sin puntos y",
    helperAccent: "con guión:",
    placeholder: "Ej: 12345678-5",
  },
];

/**
 * Pago express del home: elección N° Cliente / Rut, campo de búsqueda y
 * acción principal. Réplica del patrón en producción con tokens del DS 4.0.
 */
export function PayExpressCard({ className }: { className?: string }) {
  const [mode, setMode] = useState<PayMode>("cliente");
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const fieldId = useId();
  const active = modes.find((m) => m.id === mode) ?? modes[0];
  const validation = validatePayIdentifier(mode, value);
  const canSubmit = validation.success;
  const showError = !canSubmit && (value.length > 0 || touched);
  const error = !validation.success ? validation.error.issues[0]?.message : undefined;

  if (!active) return null;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTouched(true);
        validatePayIdentifier(mode, value);
      }}
      className={cn(
        "w-full max-w-[420px] rounded-[2rem] bg-surface/95 p-ch-xl shadow-card-hover backdrop-blur-sm",
        className,
      )}
    >
      <h2 className="text-3xl font-bold text-foreground">Paga tu cuenta aquí</h2>
      <p className="mt-ch-xs text-base text-foreground/80">
        Elige si pagarás con N° de cliente o Rut:
      </p>

      <div
        role="radiogroup"
        aria-label="Tipo de identificación"
        className="mt-ch-base grid grid-cols-2 gap-ch-md"
      >
        {modes.map((m) => (
          <Button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => { setMode(m.id); setValue(""); setTouched(false); }}
            variant={mode === m.id ? "primary" : "secondary"}
            className={cn(
              "ch-touch inline-flex items-center justify-center rounded-pill border-2 px-ch-base py-ch-md text-base font-bold transition-colors",
              mode === m.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary bg-surface text-primary hover:bg-primary/10",
            )}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <div className={cn("relative mt-ch-lg rounded-[1.25rem] border-2 bg-surface px-ch-base pb-ch-sm pt-ch-md", showError ? "border-destructive" : canSubmit ? "border-success" : "border-border")}>
        <label
          htmlFor={fieldId}
          className="relative -mt-7 mb-1 block w-fit max-w-full bg-surface px-1 text-sm font-bold leading-snug text-foreground"
        >
          {active.helper} <span className="text-primary">{active.helperAccent}</span>
        </label>
        <div className="flex min-h-11 items-center gap-2">
        <Input
          id={fieldId}
          name="identificador"
          inputMode={mode === "cliente" ? "numeric" : "text"}
          maxLength={20}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? `${fieldId}-error` : canSubmit ? `${fieldId}-success` : undefined}
          autoComplete="off"
          placeholder={active.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => setTouched(true)}
          className="h-10 min-h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-base font-bold shadow-none focus-visible:ring-0"
        />
        {canSubmit ? <span id={`${fieldId}-success`} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-soft text-success"><Check className="size-5" strokeWidth={3} aria-hidden /><span className="sr-only">Formato válido</span></span> : null}
        {mode === "cliente" ? <CustomerNumberHelp /> : null}
        </div>
      </div>
      {showError ? <p id={`${fieldId}-error`} role="status" className="mt-2 flex items-start gap-2 text-base font-semibold leading-snug text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />{error}</p> : null}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        className="mt-ch-base w-full text-base disabled:opacity-60"
      >
        Paga tu cuenta
      </Button>

      <div className="mt-ch-md text-center">
        <a
          href="#"
          className="ch-touch inline-flex items-center justify-center text-base font-bold text-primary hover:text-primary-hover hover:underline"
        >
          Paga con cupón
        </a>
      </div>
    </form>
  );
}

export default PayExpressCard;