import { Field } from "@/components/chilquinta/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMUNAS, type SimuladorState } from "./data";

export interface StepProps {
  value: SimuladorState;
  onChange: (patch: Partial<SimuladorState>) => void;
}

/** Paso 1 — Ingresar datos del solicitante y de la propiedad. */
export function StepDatos({ value, onChange }: StepProps) {
  const emailsCoinciden =
    value.emailRepetir.length === 0 ||
    value.email.trim().toLowerCase() === value.emailRepetir.trim().toLowerCase();

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <Field
        id="ql-rut"
        label="Ingresa tu rut:"
        placeholder="12345678-9"
        value={value.rut}
        onChange={(e) => onChange({ rut: e.target.value })}
      />
      <Field
        id="ql-nombre"
        label="Ingresa tu nombre:"
        value={value.nombre}
        onChange={(e) => onChange({ nombre: e.target.value })}
      />
      <Field
        id="ql-apellido"
        label="Ingresa tu apellido:"
        value={value.apellido}
        onChange={(e) => onChange({ apellido: e.target.value })}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="ql-comuna" className="text-sm font-semibold text-foreground">
          Selecciona la comuna de la propiedad donde quieres el medidor:
        </Label>
        <Select value={value.comuna} onValueChange={(v) => onChange({ comuna: v })}>
          <SelectTrigger id="ql-comuna">
            <SelectValue placeholder="Selecciona una comuna" />
          </SelectTrigger>
          <SelectContent>
            {COMUNAS.map((comuna) => (
              <SelectItem key={comuna} value={comuna}>
                {comuna}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Field
        id="ql-direccion"
        label="Ingresa dirección:"
        placeholder="Calle, número, depto."
        value={value.direccion}
        onChange={(e) => onChange({ direccion: e.target.value })}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="ql-celular" className="text-sm font-semibold text-foreground">
          Ingrese su celular
        </Label>
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-foreground">+56</span>
          <Field
            id="ql-celular"
            label="Número de celular"
            className="flex-1 [&>label]:sr-only"
            inputMode="numeric"
            placeholder="912345678"
            value={value.celular}
            onChange={(e) => onChange({ celular: e.target.value.replace(/\D/g, "").slice(0, 9) })}
          />
        </div>
      </div>

      <Field
        id="ql-correo"
        label="Ingrese correo electrónico"
        type="email"
        placeholder="nombre@correo.cl"
        value={value.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <Field
        id="ql-correo-2"
        label="Repita su correo electrónico:"
        type="email"
        value={value.emailRepetir}
        onChange={(e) => onChange({ emailRepetir: e.target.value })}
        state={emailsCoinciden ? "default" : "error"}
        {...(emailsCoinciden ? {} : { message: "Los correos electrónicos no coinciden." })}
      />
    </div>
  );
}
