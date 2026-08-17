import { AlertCircle, CableCar, Cable } from "lucide-react";

import { Field } from "@/components/chilquinta/field";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectionCard } from "@/components/chilquinta/cards";
import type { StepProps } from "./step-tipo";

const INMUEBLES = ["Casa", "Departamento", "Sitio o terreno", "Local comercial", "Bodega o taller"];

/** Paso 2 — Datos de la propiedad. */
export function StepPropiedad({ value, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-bold text-foreground">Tipo de inmueble</legend>
        <RadioGroup
          value={value.tipoInmueble}
          onValueChange={(v) => onChange({ tipoInmueble: v })}
          className="grid gap-3 sm:grid-cols-2"
        >
          {INMUEBLES.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <RadioGroupItem id={`inmueble-${item}`} value={item} />
              <Label htmlFor={`inmueble-${item}`} className="text-base font-normal">
                {item}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      <Field
        id="ql-comuna"
        label="Comuna de la propiedad"
        placeholder="Ej. Viña del Mar"
        value={value.comuna}
        onChange={(e) => onChange({ comuna: e.target.value })}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-bold text-foreground">¿Quién hace la solicitud?</legend>
        <RadioGroup
          value={value.solicitante ?? ""}
          onValueChange={(v) => onChange({ solicitante: v as "propietario" | "tercero" })}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem id="sol-propietario" value="propietario" />
            <Label htmlFor="sol-propietario" className="text-base font-normal">
              El propietario de la propiedad
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem id="sol-tercero" value="tercero" />
            <Label htmlFor="sol-tercero" className="text-base font-normal">
              Un tercero autorizado
            </Label>
          </div>
        </RadioGroup>
        {value.solicitante === "tercero" ? (
          <p className="inline-flex items-start gap-2 rounded-input bg-warning-soft p-3 text-sm text-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            Si la solicitud la realiza un tercero distinto del propietario, deberás adjuntar una
            autorización notarial.
          </p>
        ) : null}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-bold text-foreground">
          ¿La propiedad ya tiene medidor instalado?
        </legend>
        <RadioGroup
          value={value.tieneMedidor ?? ""}
          onValueChange={(v) => onChange({ tieneMedidor: v as "si" | "no" })}
          className="flex gap-6"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem id="medidor-si" value="si" />
            <Label htmlFor="medidor-si" className="text-base font-normal">
              Sí
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem id="medidor-no" value="no" />
            <Label htmlFor="medidor-no" className="text-base font-normal">
              No
            </Label>
          </div>
        </RadioGroup>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-base font-bold text-foreground">Tipo de acometida en la red</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectionCard
            icon={<CableCar />}
            title="Aérea"
            description="La red llega por postes en la vía pública."
            selected={value.acometida === "aerea"}
            onClick={() => onChange({ acometida: "aerea" })}
          />
          <SelectionCard
            icon={<Cable />}
            title="Subterránea"
            description="La red llega por cámaras o ductos bajo tierra."
            selected={value.acometida === "subterranea"}
            onClick={() => onChange({ acometida: "subterranea" })}
          />
        </div>
      </fieldset>
    </div>
  );
}
