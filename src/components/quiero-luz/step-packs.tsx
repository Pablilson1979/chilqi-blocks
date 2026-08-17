import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { PACKS } from "./data";
import type { StepProps } from "./step-tipo";

/** Paso 3 — Pack referencial de artefactos. */
export function StepPacks({ value, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Selecciona el pack que más se parezca a los artefactos que usarás en tu propiedad. Es una
        referencia para estimar la potencia que necesitas.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {PACKS.map((pack) => {
          const selected = value.packId === pack.id;
          return (
            <button
              key={pack.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange({ packId: pack.id })}
              className={cn(
                "flex flex-col gap-3 rounded-card border-2 bg-card p-6 text-left transition-colors focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2",
                selected
                  ? "border-success bg-success-soft shadow-card-hover"
                  : "border-border shadow-card hover:border-success/50",
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-lg font-bold text-foreground">{pack.nombre}</span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border-2",
                    selected
                      ? "border-success bg-success text-success-foreground"
                      : "border-border text-transparent",
                  )}
                >
                  <Check className="size-4" />
                </span>
              </span>
              <span className="rounded-pill bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {pack.rango}
              </span>
              <span className="text-sm leading-relaxed text-foreground/80">{pack.artefactos}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
