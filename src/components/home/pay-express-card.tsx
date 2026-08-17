import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    placeholder: "Ej: 12345678-9",
  },
];

/**
 * Pago express del home: elección N° Cliente / Rut, campo de búsqueda y
 * acción principal. Réplica del patrón en producción con tokens del DS 4.0.
 */
export function PayExpressCard({ className }: { className?: string }) {
  const [mode, setMode] = useState<PayMode>("cliente");
  const [value, setValue] = useState("");
  const active = modes.find((m) => m.id === mode)!;
  const canSubmit = value.trim().length > 0;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
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
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "ch-touch inline-flex items-center justify-center rounded-pill border-2 px-ch-base py-ch-md text-base font-bold transition-colors",
              mode === m.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary bg-surface text-primary hover:bg-primary/10",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative mt-ch-lg rounded-[1.25rem] border-2 border-border bg-surface px-ch-base pb-ch-sm pt-ch-md">
        <label
          htmlFor="pago-express"
          className="absolute -top-3 left-ch-base bg-surface px-1 text-sm font-bold text-foreground"
        >
          {active.helper} <span className="text-primary">{active.helperAccent}</span>
        </label>
        <Input
          id="pago-express"
          name="identificador"
          inputMode="numeric"
          autoComplete="off"
          placeholder={active.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-10 min-h-10 border-0 bg-transparent px-0 text-base font-bold shadow-none focus-visible:ring-0"
        />
      </div>

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