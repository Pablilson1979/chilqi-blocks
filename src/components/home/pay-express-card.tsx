import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PayMode = "cliente" | "rut";

const modes: { id: PayMode; label: string; helper: string; placeholder: string }[] = [
  {
    id: "cliente",
    label: "N° Cliente",
    helper: "Ingresa N°Cliente sin guión ni dígito verificador",
    placeholder: "Ej:1234567",
  },
  {
    id: "rut",
    label: "Rut",
    helper: "Ingresa tu Rut sin puntos y con guión",
    placeholder: "Ej:12345678-9",
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

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        "w-full max-w-[420px] rounded-card bg-surface/90 p-ch-lg shadow-card-hover backdrop-blur-sm",
        className,
      )}
    >
      <h2 className="text-2xl font-bold text-foreground">Paga tu cuenta aquí</h2>
      <p className="mt-ch-xs text-sm text-foreground/80">
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

      <label htmlFor="pago-express" className="mt-ch-base block text-sm text-foreground/80">
        {active.helper}
      </label>
      <Input
        id="pago-express"
        name="identificador"
        inputMode="numeric"
        autoComplete="off"
        placeholder={active.placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-ch-sm h-12 min-h-12 bg-muted/60"
      />

      <Button type="submit" size="lg" className="mt-ch-base w-full text-base">
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