import { Building2, Gauge, Lamp, Home, PlugZap, Zap } from "lucide-react";

import { SelectionCard } from "@/components/chilquinta/cards";
import type { SimuladorState } from "./data";

export interface StepProps {
  value: SimuladorState;
  onChange: (patch: Partial<SimuladorState>) => void;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-base font-bold text-foreground">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/** Paso 1 — Tipo de requerimiento. */
export function StepTipo({ value, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-8">
      <Group title="¿Qué necesitas?">
        <SelectionCard
          icon={<PlugZap />}
          title="Nuevo empalme"
          description="Tu propiedad todavía no cuenta con suministro eléctrico."
          selected={value.requerimiento === "nuevo"}
          onClick={() => onChange({ requerimiento: "nuevo" })}
        />
        <SelectionCard
          icon={<Gauge />}
          title="Aumento de potencia"
          description="Ya tienes empalme y necesitas más capacidad instalada."
          selected={value.requerimiento === "aumento"}
          onClick={() => onChange({ requerimiento: "aumento" })}
        />
      </Group>

      <Group title="Tipo de tensión">
        <SelectionCard
          icon={<Home />}
          title="Baja tensión"
          description="Casas, departamentos y locales comerciales de consumo habitual."
          selected={value.tension === "baja"}
          onClick={() => onChange({ tension: "baja" })}
        />
        <SelectionCard
          icon={<Zap />}
          title="Media o alta tensión"
          description="Industrias, condominios y proyectos de gran consumo."
          selected={value.tension === "media"}
          onClick={() => onChange({ tension: "media" })}
        />
      </Group>

      <Group title="Uso del empalme">
        <SelectionCard
          icon={<Building2 />}
          title="Empalme unitario"
          description="Un solo medidor para una propiedad."
          selected={value.uso === "unitario"}
          onClick={() => onChange({ uso: "unitario" })}
        />
        <SelectionCard
          icon={<Lamp />}
          title="Alumbrado público"
          description="Iluminación de calles, pasajes o áreas comunes."
          selected={value.uso === "alumbrado"}
          onClick={() => onChange({ uso: "alumbrado" })}
        />
      </Group>
    </div>
  );
}
