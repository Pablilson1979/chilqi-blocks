import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { OptionButton, QuestionGroup } from "./option-button";
import { PACKS, type Relacion, type TipoPropiedad } from "./data";
import type { StepProps } from "./step-datos";

const RELACIONES: Relacion[] = ["Propietario", "Arrendatario", "Comodato", "Otro"];
const TIPOS: TipoPropiedad[] = ["Casa", "Local Comercial", "Oficina", "Industria"];

/** Paso 2 — Detalles de la propiedad y pack referencial de artefactos. */
export function StepPropiedad({ value, onChange }: StepProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <QuestionGroup number={1} question="¿Qué tipo de relación tienes con la propiedad?">
        {RELACIONES.map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={value.relacion === item}
            onSelect={() => onChange({ relacion: item })}
          />
        ))}
      </QuestionGroup>

      <QuestionGroup number={2} question="¿Qué tipo de propiedad necesitas conectar?">
        {TIPOS.map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={value.tipoPropiedad === item}
            onSelect={() => onChange({ tipoPropiedad: item })}
          />
        ))}
      </QuestionGroup>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-base font-bold text-foreground">
          3.- Para dimensionar la capacidad de tu empalme selecciona el pack referencial según los
          artefactos que vas a utilizar.
        </legend>
        {PACKS.map((pack) => {
          const selected = value.packId === pack.id;
          return (
            <button
              key={pack.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange({ packId: pack.id })}
              className={cn(
                "flex flex-col gap-2 rounded-card border-2 bg-card p-6 text-left transition-colors focus-visible:outline-3 focus-visible:outline-ring focus-visible:outline-offset-2",
                selected
                  ? "border-success bg-success-soft"
                  : "border-border hover:border-success/50",
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">{pack.nombre}</span>
                  <span className="text-sm font-semibold text-foreground/80">{pack.rango}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    selected ? "bg-success-tint text-success" : "border-2 border-border",
                  )}
                >
                  <Check className={cn("size-4", !selected && "opacity-0")} />
                </span>
              </span>
              <span className="mt-2 text-sm font-bold text-foreground">Artefactos:</span>
              <span className="text-sm leading-relaxed text-foreground/80">{pack.artefactos}</span>
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
