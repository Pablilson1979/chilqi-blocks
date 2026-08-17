import { OptionButton, QuestionGroup } from "./option-button";
import type { TipoRedes, UbicacionEmpalme } from "./data";
import type { StepProps } from "./step-datos";

const UBICACIONES: UbicacionEmpalme[] = [
  "En la propiedad",
  "Fuera de la propiedad",
  "Camino público",
  "Camino privado",
];
const REDES: TipoRedes[] = ["Aéreas", "Subterráneas"];

/** Paso 3 — Detalles de la conexión. */
export function StepConexion({ value, onChange }: StepProps) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <QuestionGroup
        number={1}
        question="¿El nuevo empalme se instalará dentro de la propiedad o en un lugar distinto?"
      >
        {UBICACIONES.map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={value.ubicacionEmpalme === item}
            onSelect={() => onChange({ ubicacionEmpalme: item })}
          />
        ))}
      </QuestionGroup>

      <QuestionGroup number={2} question="¿Tienes un instalador eléctrico autorizado por la SEC?">
        {(["Si", "No"] as const).map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={value.instaladorSEC === item}
            onSelect={() => onChange({ instaladorSEC: item })}
          />
        ))}
      </QuestionGroup>

      <QuestionGroup
        number={3}
        question="¿Frente de la propiedad existen redes de distribución (postes/cables de luz)?"
      >
        {(["Si", "No"] as const).map((item) => (
          <OptionButton
            key={item}
            label={item}
            selected={value.redesExistentes === item}
            onSelect={() =>
              onChange(item === "No" ? { redesExistentes: item, tipoRedes: null } : { redesExistentes: item })
            }
          />
        ))}
      </QuestionGroup>

      {value.redesExistentes === "Si" ? (
        <QuestionGroup
          number={4}
          question="¿De qué tipo son las redes de distribución disponibles frente a su propiedad?"
        >
          {REDES.map((item) => (
            <OptionButton
              key={item}
              label={item}
              selected={value.tipoRedes === item}
              onSelect={() => onChange({ tipoRedes: item })}
            />
          ))}
        </QuestionGroup>
      ) : null}
    </div>
  );
}
